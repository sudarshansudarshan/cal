from fastapi import FastAPI, HTTPException
from .schemas import VideoRequest, VideoResponse
import re
import json
import google.generativeai as genai
import soundfile as sf
import whisper
import os
import uuid
import time
from youtube_transcript_api import YouTubeTranscriptApi
from pytubefix import YouTube
from pytubefix.cli import on_progress
from typing import List, Dict
import ffmpeg


# def generate_question(transcript: str) -> dict:
#     # Mock LLM logic
#     return {
#         "question": "What is the main topic of the transcript?",
#         "options": ["Option A", "Option B", "Option C", "Option D"],
#         "correct_answer": "Option A",
#     }

# def answer_question(question: str) -> str:
#     # Mock LLM logic
#     return "This is the answer based on the context provided."

app = FastAPI()

genai.configure(api_key="AIzaSyBOe0ZxXCHfjX2dzaVPkP67tqjCcspsvs0")

def generate_from_gemini(prompt: str) -> str:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    time.sleep(10)  # Delay to prevent hitting API rate limits
    return response.text

def hide_urls(text: str) -> str:
    url_pattern = r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"  # Regex to match URLs
    return re.sub(url_pattern, "<url-hidden>", text)

def parse_llama_json(text: str) -> List[Dict]:
    # Extract JSON part from the generated text
    start_idx = text.find('[')
    end_idx = text.rfind(']') + 1

    if start_idx == -1 or end_idx == -1:
        raise ValueError("No valid JSON found in the text")

    json_part = text[start_idx:end_idx]

    # Parse the extracted JSON
    try:
        parsed_data = json.loads(json_part)
        return parsed_data
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}")

def generate_questions_from_prompt(text: str) -> str:
    task_description = """
        You are an AI tasked with generating multiple-choice questions (MCQs) from a given transcript. 
        Your goal is to:
        1. Identify important concepts, events, or details in the transcript.
        2. Frame questions in a simple and clear manner based on these concepts.
        3. Provide 4 answer options for each question, ensuring one is correct and the others are plausible but incorrect.
        4. Specify the index (0-based) of the correct answer for each question.
        5. Format your response as a JSON list where each entry follows the structure:
        { "question": "<question_text>", "options": ["<option1>", "<option2>", "<option3>", "<option4>"], "correct_answer": <index_of_correct_option> }

        Example output:
        [
            {
                "question": "What is the capital of France?",
                "options": ["Berlin", "Madrid", "Paris", "Rome"],
                "correct_answer": 2
            },
            {
                "question": "Which planet is known as the Red Planet?",
                "options": ["Earth", "Mars", "Jupiter", "Venus"],
                "correct_answer": 1
            },
            {
                "question": "What is the chemical symbol for water?",
                "options": ["H2O", "O2", "CO2", "NaCl"],
                "correct_answer": 0
            }
        ]
        Your input will be a transcript, and you will generate 3 questions based on its content in this exact format.
    """

    prompt = task_description + '\n Here is the transcript content: \n' + str(text) + 'Generate 3 questions as a JSON list, each question following the specified json format { "question": "<question_text>", "options": ["<option1>", "<option2>", "<option3>", "<option4>"], "correct_answer": <index_of_correct_option> }.'

    response = generate_from_gemini(prompt)
    return response

def extract_video_id(url: str) -> str:
    yt = YouTube(url, on_progress_callback=on_progress)
    title = yt.title
    description = hide_urls(yt.description)

    patterns = [
        r"(?:https?://)?(?:www\.)?youtu\.be/([^?&]+)",  # youtu.be short links
        r"(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([^?&]+)",  # youtube.com/watch?v=
        r"(?:https?://)?(?:www\.)?youtube\.com/embed/([^?&]+)",  # youtube.com/embed/
        r"(?:https?://)?(?:www\.)?youtube\.com/shorts/([^?&]+)",  # youtube.com/shorts/
        r"(?:https?://)?(?:www\.)?youtube\.com/live/([^?&]+)",  # youtube.com/live/
    ]

    for pattern in patterns:
        match = re.match(pattern, url)
        if match:
            return match.group(1)
    return None

def get_raw_transcript(video_id: str) -> List[Dict]:
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript
    except Exception as e:
        return []

def generate_transcript_segments(transcript: List[Dict], timestamps: List[int]) -> List[Dict]:
    duration = max(item['start'] + item['duration'] for item in transcript)
    if timestamps == []:
        segment_count = 4
        timestamps = [i * (duration // segment_count) for i in range(0, segment_count)]
    timestamps = sorted(timestamps)
    timestamps.append(duration + 1)  # Add 1 to ensure all text is included
    

    segments = []
    time_ranges = []
    current_segment = []
    segment_index = 0

    for entry in transcript:
        while segment_index + 1 < len(timestamps) and entry['start'] >= timestamps[segment_index + 1]:
            if current_segment:
                segments.append(" ".join(current_segment))
                time_ranges.append((timestamps[segment_index], timestamps[segment_index + 1]))
            current_segment = []
            segment_index += 1

        current_segment.append(entry['text'])

    if current_segment:
        segments.append(" ".join(current_segment))
        time_ranges.append((timestamps[segment_index], timestamps[segment_index + 1]))

    return [{"text": segment, "start_time": start, "end_time": end}
            for segment, (start, end) in zip(segments, time_ranges)]

def process_video(url, timestamps) -> VideoResponse:
    video_id = extract_video_id(url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    transcript = get_raw_transcript(video_id)

    # Step 1: Fetch video title, description and transcript
    yt = YouTube(url, on_progress_callback=on_progress)
    title = yt.title
    description = hide_urls(yt.description)
    
    if transcript == []:
        # Download audio if transcript is not available
        unique_id = str(uuid.uuid4())[:8]  # Shorten UUID for brevity
        m4a_file = f"{unique_id}"
        wav_file = f"{unique_id}.wav"
        print(f"Downloading audio from YouTube video: {yt.title}")
        ys = yt.streams.get_audio_only()
        ys.download(filename=m4a_file)
        print(f"Downloaded audio file: {m4a_file}")

        # Convert audio to WAV format
        print(f"Converting audio file to WAV format: {wav_file}")
        ffmpeg.input(m4a_file).output(wav_file).run(overwrite_output=True)
        print(f"Converted audio file to WAV format: {wav_file}")
        
        print("Splitting audio into segments...")
        audio_data, samplerate = sf.read(wav_file)
        audio_duration = len(audio_data) / samplerate
        
        if not timestamps:
            timestamps = [i * (audio_duration // 4) for i in range(4)]
        
        timestamps = sorted(timestamps)
        timestamps.append(audio_duration)  # Ensure last timestamp is the duration of the audio

        segments = []
        model = whisper.load_model("base")

        for i in range(len(timestamps) - 1):
            start_time = timestamps[i]
            end_time = timestamps[i + 1]
            
            # Get the segment data based on the timestamps
            start_sample = int(start_time * samplerate)
            end_sample = int(end_time * samplerate)
            segment_data = audio_data[start_sample:end_sample]
            
            segment_file = f"{wav_file}_{i}.wav"
            
            # Save the segment to a file
            sf.write(segment_file, segment_data, samplerate)
            print(f"Segment {i + 1} saved: {segment_file}")
            
            # Transcribe the segment using Whisper
            result = model.transcribe(segment_file)
            segment_transcript = result['text']
            segments.append({
                "text": segment_transcript,
                "start_time": start_time,
                "end_time": end_time
            })
            os.remove(segment_file)
        os.remove(wav_file)
        os.remove(m4a_file)
        print("Audio segments processed successfully.")
        
        full_transcript = " ".join([segment["text"] for segment in segments])
        

        questions = []
        for i, segment in enumerate(segments):
            questions_response = generate_questions_from_prompt(segment["text"])
            question_data = parse_llama_json(questions_response)

            for question in question_data:
                question['segment'] = i+1  # Link the question to the segment
                questions.append(question)

        return VideoResponse(
            video_id=video_id,
            title=title,
            description=description,
            segments=segments,
            questions=questions
        )

    else:
        # Step 2: Segment the transcript
        segments = generate_transcript_segments(transcript, timestamps)
        
        # Step 3: Generate questions for each segment
        questions = []
        for i, segment in enumerate(segments):
            questions_response = generate_questions_from_prompt(segment["text"])
            question_data = parse_llama_json(questions_response)

            for question in question_data:
                question['segment'] = i+1  # Link the question to the segment
                questions.append(question)

        # Step 4: Return the processed data
        return VideoResponse(
            video_id=video_id,
            title=title,
            description=description,
            segments=segments,
            questions=questions
        )
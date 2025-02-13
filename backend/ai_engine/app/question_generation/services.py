# app/question_generation/services.py
import asyncio
import uuid
from fastapi import HTTPException
from typing import List, Dict, Tuple
import google.generativeai as genai
import soundfile as sf
import whisper
from youtube_transcript_api import YouTubeTranscriptApi
from pytubefix import YouTube, Playlist
from pytubefix.cli import on_progress
import ffmpeg
import aiofiles
import aiofiles.os
from .models import VideoSegment, Question, VideoResponse
from .utils import extract_video_id, hide_urls, parse_llama_json
from app.rag import upload_text
import os
from dotenv import load_dotenv
from .prompts import *
import requests
import json

load_dotenv()
os.environ["PATH"] += os.pathsep + os.getenv("FFMPEG_PATH") # Configure FFMPEG locally

print("FFMPEG PATH:", os.getenv("FFMPEG_PATH"))
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel(model_name="gemini-1.5-flash")

    def set_api_key(self, user_api_key: str):
        genai.configure(api_key=user_api_key)

    async def generate_content(self, prompt: str) -> str:
        # """Generate content from Gemini AI with rate limiting"""
        # response = await asyncio.to_thread(self.model.generate_content, prompt)
        # await asyncio.sleep(10)  # Maintain rate limiting
        # return response.text
        marker = "Here is the JSON input:"
        json_start = prompt.find(marker)
        if json_start != -1:
            json_str = prompt[json_start + len(marker):].strip()
            try:
                payload = json.loads(json_str)
                segments = payload.get("segments", [])
                print(f"Making a call to the LLM with {len(segments)} segments")
            except Exception as e:
                print("Could not parse JSON payload to count segments:", e)
        else:
            print("JSON input marker not found in prompt.")

        max_retries = 3
        backoff_times = [10, 20, 30]
        attempt = 0
        while attempt < max_retries:
            try:
                response = await asyncio.to_thread(self.model.generate_content, prompt)
                await asyncio.sleep(10)  # Delay to prevent hitting API rate limits
                return response.text
            except Exception as e:
                error_message = str(e).lower()
                if "429" in error_message or "resource exhausted" in error_message:
                    print(f"Received 429 resource exhausted error, retrying in {backoff_times[attempt]} seconds...")
                    await asyncio.sleep(backoff_times[attempt])
                    attempt += 1
                else:
                    raise e
        print("Max retries reached for Gemini API due to resource exhaustion. Exiting.")
        exit(1)
    
class OllamaService:
    def __init__(self):
        self.model = "deepseek-r1:14b"

    async def generate_content(self, prompt: str) -> str:
        """Generate content from Ollama AI with rate limiting"""
        response = requests.post(OLLAMA_API_URL, json={"model": self.model,
                                                        "prompt": prompt,
                                                        "raw":True,
                                                        "stream": False
                                                        })
        print(response)
        if response.status_code == 200:
            return response.json().get("response", "Error: No response from Ollama.")
        else:
            return f"Error: Ollama API request failed - {response.text}"

class VideoProcessor:
    def __init__(self, ai_service: GeminiService):
        self.whisper_model = whisper.load_model("base")
        self.ai_service = ai_service

    async def process_video(self, url: str, user_api_key: str, timestamps: List[int], segment_wise_q_no: List[int], segment_wise_q_model: List[str]) -> VideoResponse:
        video_id = extract_video_id(url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        transcript = await self.get_raw_transcript(video_id)
        yt = YouTube(url, 'WEB', on_progress_callback=on_progress)
        title = yt.title
        description = hide_urls(yt.description)

        if not transcript:
            segments = await self.process_audio_only(yt, timestamps)
        else:
            segments = self.generate_transcript_segments(transcript, timestamps)

        full_transcript = " ".join([segment.text for segment in segments])
        await upload_text(full_transcript, title)

        batches = self.batch_segments(segments, segment_wise_q_no, segment_wise_q_model)
        final_questions = []
        global_segment_index = 1  # To track the global segment index across batches
        max_retries = 5

        for batch_segments_list, batch_q_no, batch_q_model in batches:
            retries = 0
            valid = False
            batch_question_data = {}
            while retries < max_retries:
                try:
                    batch_response = await self.generate_questions_for_video(batch_segments_list, user_api_key, batch_q_no, batch_q_model)
                except Exception as e:
                    error_message = str(e).lower()
                    if "429" in error_message or "resource exhausted" in error_message:
                        wait_time = 10 * (retries + 1)
                        print(f"Received 429 resource exhausted error, retrying in {wait_time} seconds...")
                        await asyncio.sleep(wait_time)
                        retries += 1
                        continue
                    else:
                        raise e
                batch_question_data = parse_llama_json(batch_response)
                if ("questions" in batch_question_data and
                batch_question_data["questions"] and
                batch_question_data["questions"][0].get("questions", []) and
                batch_question_data["questions"][0]["questions"][0].get("question", "") != ""):
                    valid = True
                    break
                else:
                    print("JSON parsing failed for this batch, retrying...")
                    retries += 1
                    await asyncio.sleep(10 * retries)
            if not valid:
                print("Max retries reached for this batch, skipping batch.")
                global_segment_index += len(batch_segments_list)
                continue
            print("Number of question groups in batch:", len(batch_question_data.get("questions", [])))
            batch_groups = batch_question_data.get("questions", [])
            for i in range(len(batch_segments_list)):
                requested = batch_q_no[i]
                processed_questions = []
                if i < len(batch_groups):
                    group = batch_groups[i]
                    questions = group.get("questions", [])
                    for q in questions:
                        options = q.pop("options", [])
                        for j, option in enumerate(options, 1):
                            q[f"option_{j}"] = option
                        processed_questions.append(q)
                    if len(processed_questions) < requested:
                        missing = requested - len(processed_questions)
                        for _ in range(missing):
                            processed_questions.append({
                                "question": "",
                                "option_1": "",
                                "option_2": "",
                                "option_3": "",
                                "option_4": "",
                                "correct_answer": 0
                            })
                else:
                    for _ in range(requested):
                        processed_questions.append({
                            "question": "",
                            "option_1": "",
                            "option_2": "",
                            "option_3": "",
                            "option_4": "",
                            "correct_answer": 0
                        })
                for q in processed_questions:
                    q["segment"] = global_segment_index
                    final_questions.append(q)
                global_segment_index += 1
        for seg in segments:
                seg.title = title
                seg.video_url = url
                seg.description = description
        return VideoResponse(segments=segments, questions=final_questions)
    
    def batch_segments(self, segments: List[Dict],
                   segment_q_no: List[int],
                   segment_q_model: List[str],
                   max_total_questions: int = 25) -> List[Tuple[List[Dict], List[int], List[str]]]:
        """
        Batches segments into groups such that the sum of questions in each batch does not exceed max_total_questions.
        Returns a list of tuples: (batch_segments, batch_q_no, batch_q_model).
        """
        batches = []
        current_batch_segments = []
        current_batch_q_no = []
        current_batch_q_model = []
        current_sum = 0

        for seg, qno, qmodel in zip(segments, segment_q_no, segment_q_model):
            if current_sum + qno > max_total_questions and current_batch_segments:
                batches.append((current_batch_segments, current_batch_q_no, current_batch_q_model))
                current_batch_segments = []
                current_batch_q_no = []
                current_batch_q_model = []
                current_sum = 0
            current_batch_segments.append(seg)
            current_batch_q_no.append(qno)
            current_batch_q_model.append(qmodel)
            current_sum += qno
        if current_batch_segments:
            batches.append((current_batch_segments, current_batch_q_no, current_batch_q_model))
        return batches

    async def get_raw_transcript(self, video_id: str) -> List[Dict]:
        try:
            return await asyncio.to_thread(YouTubeTranscriptApi.get_transcript, video_id)
        except Exception:
            return []

    def generate_transcript_segments(self, transcript: List[Dict], timestamps: List[int]) -> List[VideoSegment]:
        duration = max(item["start"] + item["duration"] for item in transcript)
        if not timestamps:
            segment_count = 4
            timestamps = [i * (duration // segment_count) for i in range(0, segment_count)]

        timestamps = sorted(timestamps)
        timestamps.append(duration + 1)

        segments = []
        time_ranges = []
        current_segment = []
        segment_index = 0

        for entry in transcript:
            while (segment_index + 1 < len(timestamps) and 
                   entry["start"] >= timestamps[segment_index + 1]):
                if current_segment:
                    segments.append(" ".join(current_segment))
                    time_ranges.append((timestamps[segment_index], timestamps[segment_index + 1]))
                current_segment = []
                segment_index += 1

            current_segment.append(entry["text"])

        if current_segment:
            segments.append(" ".join(current_segment))
            time_ranges.append((timestamps[segment_index], timestamps[segment_index + 1]))

        return [
            VideoSegment(text=segment, start_time=start, end_time=end)
            for segment, (start, end) in zip(segments, time_ranges)
        ]

    async def process_audio_only(self, yt: YouTube, timestamps: List[int]) -> List[VideoSegment]:
        unique_id = str(uuid.uuid4())[:8]
        m4a_file = f"{unique_id}"
        wav_file = f"{unique_id}.wav"

        ys = yt.streams.get_audio_only()
        ys.download(filename=m4a_file)
        ffmpeg.input(m4a_file).output(wav_file).run()

        audio_data, samplerate = sf.read(wav_file)
        audio_duration = len(audio_data) / samplerate

        if not timestamps:
            timestamps = [i * (audio_duration // 4) for i in range(4)]

        timestamps = sorted(timestamps)
        timestamps.append(audio_duration + 1)

        segments = []
        for i in range(len(timestamps) - 1):
            start_time = timestamps[i]
            end_time = timestamps[i + 1]

            start_sample = int(start_time * samplerate)
            end_sample = int(end_time * samplerate)
            segment_data = audio_data[start_sample:end_sample]

            segment_file = f"{wav_file}_{i}.wav"
            sf.write(segment_file, segment_data, samplerate)

            segment = await self.process_audio_segment(segment_file, start_time, end_time)
            segments.append(segment)
            await aiofiles.os.remove(segment_file)

        await aiofiles.os.remove(wav_file)
        await aiofiles.os.remove(m4a_file)

        return segments

    async def process_audio_segment(self, segment_file: str, start_time: float, end_time: float) -> VideoSegment:
        result = self.whisper_model.transcribe(segment_file)
        return VideoSegment(text=result["text"], start_time=start_time, end_time=end_time)

    async def generate_questions_for_video(self, segments: List[Dict], user_api_key: str, segment_wise_q_no: List[int], segment_wise_q_model: List[str]) -> str:
        payload_segments = []
        for i, segment in enumerate(segments):
            payload_segments.append({
                "text": segment.text,
                "num_questions": segment_wise_q_no[i],
                "question_type": segment_wise_q_model[i]
            })
        payload = {"segments": payload_segments}
        prompt = self._get_prompt(json.dumps(payload))
        return await self.ai_service.generate_content(prompt)

    # async def generate_questions_from_prompt(self, text: str, user_api_key: str, n_questions: int, q_model: str) -> str:
    #     """Generate questions using AI service"""
    #     prompt = self._get_prompt(text, n_questions, q_model)
    #     print("APIIIKEYYYYYYCHECKKKKKKKK: ", user_api_key)
        
    #     # self.ai_service.set_api_key(os.getenv("API_KEY"))
    #     return await self.ai_service.generate_content(prompt)

    def _get_prompt(self, text:str) -> str:
        """Return appropriate prompt template based on question type"""
        # if q_model == "case-study":
        #     task_description = TASK_DESCRIPTION_CASE_STUDY.format(n)
        #     prompt = task_description + PROMPT_CASE_STUDY.format(text, n)
        #     return prompt

        # task_description = TASK_DESCRIPTION_ANALYTICAL
        prompt = PROMPT_NEW.format(text)
        return prompt

class PlaylistProcessor:
    async def get_urls_from_playlist(self, playlist_url: str):
        """Extract video URLs from YouTube playlist"""
        try:
            playlist = await asyncio.to_thread(Playlist, playlist_url)
            return {"video_urls": list(playlist.video_urls)}
        except Exception as e:
            return {"error": str(e), "video_urls": []}
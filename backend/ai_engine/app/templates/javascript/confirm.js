import { questionDB } from "./db.js";
import state from "./state.js";

async function confirmAndDownload () {

  if (!state.selectedSectionId) {
    alert("Please select a section before submitting");
    return;
  }

  // Save modifications before uploading
  if (state.currentVideo !== null) {
    saveVideoEdits(state.currentVideo);
  }
  console.log("State received by confirmAndDownload", state);
  const videoIndices = Object.keys(state.modifiedResponseData).map(Number);
  const errors = [];

  let sequenceCounter = 1; // Initialize sequence number counter

  for (const videoIndex of videoIndices) {
    const data = state.modifiedResponseData[videoIndex];
    console.log("keyboard smash", data.segments);

    // Step 1: Upload Video to LMS for each segment
    for (let i = 0; i < data.segments.length; i++) {
      const segment = data.segments[i];
      try {
        const videoPayload = {
          source: segment.video_url,
          title: segment.title,
          description: segment.description,
          section: selectedSectionId, // Add section_id here for each segment
          start_time: parseInt(segment.start_time, 10),
          end_time: parseInt(segment.end_time, 10),
          transcript: segment.text,
          sequence: sequenceCounter, // Assign sequence number for the video
        };
        sequenceCounter = sequenceCounter + 1;

        const videoResponse = await fetch(config.VIDEO_UPLOAD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.Authorization,
          },
          body: JSON.stringify(videoPayload),
        });

        if (!videoResponse.ok)
          throw new Error(`Video Upload Failed: ${videoResponse.status}`);
        const videoResult = await videoResponse.json();
        const videoId = videoResult.video_id;

        // Step 2: Upload Assessment Data for the current video
        const assessmentPayload = {
          title: `Assessment number ${i + 1}`, // Title should be "Assessment number" = i (iteration number)
          question_visibility_limit: 9, // Set default question visibility limit
          time_limit: 9, // Set default time limit
          section: selectedSectionId, // Section is the same as the video to which this assessment belongs
          sequence: sequenceCounter, // Set sequence number for the assessment (next number after video)
        };
        sequenceCounter = sequenceCounter + 1;

        const assessmentResponse = await fetch(config.ASSESSMENT_UPLOAD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: config.Authorization,
          },
          body: JSON.stringify(assessmentPayload),
        });

        if (!assessmentResponse.ok)
          throw new Error(
            `Assessment Upload Failed: ${assessmentResponse.status}`
          );
        const assessmentResult = await assessmentResponse.json();
        const assessmentId = assessmentResult.id; // Assuming API returns assessment_id

        // Step 3: Upload Questions for the current assessment (Only if segment matches)
        for (let j = 0; j < data.questions.length; j++) {
          const question = data.questions[j];
          if (question.segment === i + 1) {
            // Check if the question's segment matches the current segment number
            const questionPayload = {
              text: question.question,
              type: "MCQ", // Assuming it's an MCQ type
              marks: 1, // Default marks
              assessment: assessmentId, // Link question to the current assessment
              options: [
                { option_text: question.option_1 },
                { option_text: question.option_2 },
                { option_text: question.option_3 },
                { option_text: question.option_4 },
              ],
              solution_option_index: question.correct_answer, // Assuming correct_answer is the index of the correct option
            };

            const questionResponse = await fetch(
              config.QUESTIONS_UPLOAD_URL,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: config.Authorization,
                },
                body: JSON.stringify(questionPayload),
              }
            );

            if (!questionResponse.ok)
              throw new Error(
                `Question Upload Failed: ${questionResponse.status}`
              );
          }
        }

        // Save data to IndexedDB for backup
        await questionDB.saveVideoData({
          ...data,
          video_id: videoId,
          assessment_id: assessmentId,
        });
      } catch (error) {
        console.error("Error:", error);
        errors.push(error.message);
      }
    }
  }

  // Display errors or success message
  if (errors.length > 0) {
    alert("Some uploads failed:\n" + errors.join("\n"));
  } else {
    alert("All videos, assessments, and questions submitted successfully!");
  }
};
export { confirmAndDownload };
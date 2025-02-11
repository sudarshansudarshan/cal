// outputDisplay.js
import { questionDB } from "./db.js";
import state from "./state.js";
import { selectVideo, saveVideoEdits } from "./videoProcessing.js";

/**
 * Function to display video blocks after fetching URLs.
 */
function displayVideoBlocks() {
  const container = document.getElementById("videos-container");
  container.innerHTML = ""; // Clear the container
  console.log("Displaying video blocks");
  console.log("Video URLs:", state.videoUrls);
  state.videoUrls.forEach((_, index) => {
    const videoBlock = document.createElement("div");
    videoBlock.className = "video-block";
    videoBlock.textContent = `Video ${index + 1}`;
    videoBlock.addEventListener("click", () => selectVideo(index));
    container.appendChild(videoBlock);
  });
}

/**
 * Function to display video output after processing.
 */
function displayOutput(data) {
  console.log("Displaying processed output:", data);

  const outputVideosContainer = document.getElementById("output-videos-container");
  if (!outputVideosContainer.hasChildNodes()) {
    state.videoUrls.forEach((_, index) => {
      const videoBlock = document.createElement("div");
      videoBlock.className = "video-block";
      videoBlock.textContent = `Video ${index + 1}`;
      videoBlock.addEventListener("click", () => showVideoOutput(index));
      outputVideosContainer.appendChild(videoBlock);
    });
  }

  if (data) {
    console.log("Showing video output:", data);
    showVideoOutput(state.currentVideo);
  }
}

/**
 * Function to display the selected video’s details.
 */
async function showVideoOutput(index) {
  console.log("Showing video output for video:", index);
  // First, try to get data from IndexedDB
  const storedVideoData = await questionDB.getVideoData(state.videoUrls[index]);
  console.log("Stored video data1:", storedVideoData);
  if (storedVideoData) {
    // If data exists in IndexedDB, use it
    console.log("Stored video data2:", storedVideoData);
    state.modifiedResponseData[index] = storedVideoData;
  }

  if (!state.modifiedResponseData[index]) {
    console.log("No data found for video:", index);
    return
  };

  if (state.currentVideo !== null) {
    saveVideoEdits(state.currentVideo);
  }

  state.currentVideo = index;
  const data = state.modifiedResponseData[index];
  const blocks = document
    .getElementById("output-videos-container")
    .getElementsByClassName("video-block");
  Array.from(blocks).forEach((block) => block.classList.remove("active"));
  blocks[index].classList.add("active");
  console.log("State's Hierarchy data", state.hierarchyData);
  // Display video information
  const videoInfo = document.getElementById("video-info");
  const selectedSectionId = state.selectedSectionId || null;
  videoInfo.innerHTML = `
    <label for="video-url">Video URL</label>
    <input type="text" id="video-url" value="${data.video_url}" disabled />

    <label for="title">Title</label>
    <input type="text" id="title" value="${data.title}" />

    <label for="description">Description</label>
    <textarea id="description">${data.description}</textarea>

    <label for="section-info">Selected Section</label>
    <input type="text" id="section-info" value="${
      state.hierarchyData[2]
        .find((section) => section.id === selectedSectionId)?.title ||
      "No section selected"
    }" disabled />
  `;
  // Display segments
  const segmentsContainer = document.getElementById(
    "output-segments-container"
  );
  const segmentDetailsContainer = document.getElementById(
    "segment-details-container"
  );

  segmentsContainer.innerHTML = "";
  segmentDetailsContainer.innerHTML = "";

  data.segments.forEach((segment, i) => {
    const segmentBlock = document.createElement("div");
    segmentBlock.className = "segment-block";
    segmentBlock.textContent = `Segment ${i + 1}`;
    segmentBlock.dataset.segment = i;
    segmentBlock.addEventListener("click", () => showSegmentDetails(i));
    segmentsContainer.appendChild(segmentBlock);

    const segmentDetails = document.createElement("div");
    segmentDetails.className = "segment-details";
    segmentDetails.id = `segment-${i}`;
    segmentDetails.innerHTML = `
      <h5>Segment ${i + 1}</h5>
      <label for="segment-text-${i}">Text</label>
      <textarea id="segment-text-${i}">${segment.text}</textarea>

      <label for="start-time-${i}">Start Time</label>
      <div style="display: flex; gap: 10px;">
        <input type="number" id="start-time-hr-${i}" value="${Math.floor(
      i === 0 ? 0 : segment.start_time / 3600
    )}" disabled style="width: 33%;" />
        <input type="number" id="start-time-min-${i}" value="${Math.floor(
      (i === 0 ? 0 : segment.start_time % 3600) / 60
    )}" disabled style="width: 33%;" />
        <input type="number" id="start-time-sec-${i}" value="${Math.floor(
      (i === 0 ? 0 : segment.start_time) % 60
    )}" disabled style="width: 33%;" />
      </div>

      <label for="end-time-${i}">End Time</label>
      <div style="display: flex; gap: 10px;">
        <input type="number" id="end-time-hr-${i}" value="${Math.floor(
      segment.end_time / 3600
    )}" disabled style="width: 33%;" />
        <input type="number" id="end-time-min-${i}" value="${Math.floor(
      (segment.end_time % 3600) / 60
    )}" disabled style="width: 33%;" />
        <input type="number" id="end-time-sec-${i}" value="${Math.floor(
      segment.end_time % 60
    )}" disabled style="width: 33%;" />
      </div>
    `;
    segmentDetailsContainer.appendChild(segmentDetails);
  });
  // Display questions
  const questionsContainer = document.getElementById(
    "output-questions-container"
  );
  const questionDetailsContainer = document.getElementById(
    "question-details-container"
  );

  questionsContainer.innerHTML = "";
  questionDetailsContainer.innerHTML = "";
  console.log("Data", data);

  data.questions.forEach((question, i) => {
    const questionBlock = document.createElement("div");
    questionBlock.className = "question-block";
    questionBlock.textContent = `Question ${i + 1}`;
    questionBlock.dataset.question = i;
    questionBlock.addEventListener("click", () => showQuestionDetails(i));
    questionsContainer.appendChild(questionBlock);

    const questionDetails = document.createElement("div");
    questionDetails.className = "question-details";
    questionDetails.id = `question-${i}`;

    questionDetails.innerHTML = `
      <h5>Question ${i + 1}</h5>
      <label for="question-text-${i}">Question Text</label>
      <textarea id="question-text-${i}">${question.question}</textarea>
      
      <h6>Options</h6>
      <label for="option-${i}-0">Option 1</label>
      <input type="text" id="option-${i}-0" value="${
      question.option_1 || ""
    }" />
      <label for="option-${i}-1">Option 2</label>
      <input type="text" id="option-${i}-1" value="${
      question.option_2 || ""
    }" />
      <label for="option-${i}-2">Option 3</label>
      <input type="text" id="option-${i}-2" value="${
      question.option_3 || ""
    }" />
      <label for="option-${i}-3">Option 4</label>
      <input type="text" id="option-${i}-3" value="${
      question.option_4 || ""
    }" />

      <label for="correct-answer-${i}">Correct Answer</label>
      <input type="number" id="correct-answer-${i}" value="${
      question.correct_answer
    }" />

      <label for="segment-index-${i}">Segment</label>
      <input type="number" id="segment-index-${i}" value="${
      question.segment
    }" disabled />
    `;
    questionDetailsContainer.appendChild(questionDetails);
  });

  // Show first segment and question by default
  if (data.segments.length > 0) showSegmentDetails(0);
  if (data.questions.length > 0) showQuestionDetails(0);
}

function showSegmentDetails(index) {
  const allDetails = document.getElementsByClassName("segment-details");
  Array.from(allDetails).forEach((detail) => (detail.style.display = "none"));

  const allBlocks = document.getElementsByClassName("segment-block");
  Array.from(allBlocks).forEach((block) => block.classList.remove("active"));

  document.getElementById(`segment-${index}`).style.display = "block";
  document.querySelector(`[data-segment="${index}"]`).classList.add("active");

  saveVideoEdits(state.currentVideo);
}

function showQuestionDetails(index) {
  const allDetails = document.getElementsByClassName("question-details");
  Array.from(allDetails).forEach((detail) => (detail.style.display = "none"));

  const allBlocks = document.getElementsByClassName("question-block");
  Array.from(allBlocks).forEach((block) => block.classList.remove("active"));

  document.getElementById(`question-${index}`).style.display = "block";
  document.querySelector(`[data-question="${index}"]`).classList.add("active");

  saveVideoEdits(state.currentVideo);
}

export { displayVideoBlocks, displayOutput, showVideoOutput, showSegmentDetails }
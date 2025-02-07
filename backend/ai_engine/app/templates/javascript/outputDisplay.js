// outputDisplay.js
import state from "./state.js";
import { selectVideo } from "./videoProcessing.js";

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
  const storedVideoData = await questionDB.getVideoData(state.videoUrls[index]);

  if (storedVideoData) {
    state.modifiedResponseData[index] = storedVideoData;
  }

  if (!state.modifiedResponseData[index]) return;

  state.currentVideo = index;
  document.querySelectorAll(".video-block").forEach((block) => block.classList.remove("active"));
  document.getElementsByClassName("video-block")[index].classList.add("active");

  const videoInfo = document.getElementById("video-info");
  videoInfo.innerHTML = `
    <label for="video-url">Video URL</label>
    <input type="text" id="video-url" value="${state.modifiedResponseData[index].video_url}" disabled />
  `;
}

/**
 * Function to display segment details.
 */
function showSegmentDetails(index) {
  document.querySelectorAll(".segment-details").forEach((detail) => (detail.style.display = "none"));
  document.querySelectorAll(".segment-block").forEach((block) => block.classList.remove("active"));

  document.getElementById(`segment-${index}`).style.display = "block";
}

export { displayVideoBlocks, displayOutput, showVideoOutput, showSegmentDetails };
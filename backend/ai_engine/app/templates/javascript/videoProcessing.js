import state from "./state.js";
import { questionDB } from "./db.js";
import { secondsToHMS } from "./utils.js";

function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API is ready has been called.");
    state.player = new YT.Player("player", {
        height: "360",
        width: "640",
        videoId: "",
        playerVars: {
            playsinline: 1,
            origin: window.location.origin // Dynamically set the origin
        },
    });
    state.isYouTubeIframeAPIReady = true;
}

/**
 * Fetch the duration of a YouTube video.
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<number>} - Video duration in seconds
 */
async function getVideoDuration(videoId) {
  let isYouTubeAPIReady = state.isYouTubeIframeAPIReady;
  if (!isYouTubeAPIReady) {
    console.error("YouTube IFrame API is not ready yet.");
    return;
  }
  console.log("Fetching video duration for:", videoId);
  return new Promise((resolve) => {
    const tempPlayer = new YT.Player("temp-player", {
      videoId: videoId,
      events: {
        onReady: (event) => {
          const duration = event.target.getDuration();
          console.log("Video duration:", duration);
          event.target.destroy();
          resolve(duration);
        },
      },
    });
  });
}

/**
 * Function to select a video from the list of videos.
 * @param {number} index - Index of selected video
 */
function selectVideo(index) {
  // Use state.currentVideo instead of a local variable
  state.currentVideo = index;
  console.log("Selecting video:", index);

  const videoUrl = state.videoUrls[index]; // Fix capitalization (videoUrls, not VideoUrls)
  if (!videoUrl) {
    console.error("Invalid video index:", index);
    return;
  }

  const videoId = videoUrl.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/
  );
  const player = state.player;
  if (videoId && videoId[1]) {
    if (player && player.loadVideoById) {
      player.loadVideoById(videoId[1]);
    }
  }

  document.querySelectorAll(".video-block").forEach((block) => block.classList.remove("active"));
  const videoBlocks = document.getElementsByClassName("video-block");
  if (videoBlocks[index]) {
    videoBlocks[index].classList.add("active");
  }

  const videoForm = document.getElementById("video-form");
  videoForm.style.display = "block";
  const videoData = state.videoData;
  if (!videoData[index]) {
    videoData[index] = { segments: {} };
    document.getElementById("num-segments").value = "";
    document.getElementById("segments-container").innerHTML = "";
    document.getElementById("details-form").style.display = "none";
  } else {
    const numSegments = Object.keys(videoData[index].segments).length;
    document.getElementById("num-segments").value = numSegments;

    // Rebuild segments UI without recalculating timestamps
    const segmentsContainer = document.getElementById("segments-container");
    segmentsContainer.innerHTML = "";

    for (let i = 1; i <= numSegments; i++) {
      const segmentBlock = document.createElement("div");
      segmentBlock.className = "segment-block";
      segmentBlock.textContent = `Segment ${i}`;
      segmentBlock.setAttribute("data-segment", i);
      segmentBlock.addEventListener("click", () => openSegmentForm(i));
      segmentsContainer.appendChild(segmentBlock);
    }
  }
}

function openSegmentForm(segmentNumber) {
  state.currentSegment = segmentNumber;
  const currentVideo = state.currentVideo;
  const videoData = state.videoData;
  const data = videoData[currentVideo].segments[segmentNumber];
  console.log("Opening segment form:", segmentNumber, data);

  const formTitle = document.getElementById("form-title");
  const questionsInput = document.getElementById("questions");
  const typeInput = document.getElementById("type");

  const timestampFields = document.querySelectorAll(
    "#timestamp-hr, #timestamp-min, #timestamp-sec"
  );
  if (segmentNumber === 1) {
    timestampFields.forEach((field) => {
      field.value = "0";
      field.disabled = true;
    });
  } else {
    const timestamp = data.timestamp || 0;
    const { hrs, mins, secs } = secondsToHMS(timestamp);
    document.getElementById("timestamp-hr").value = hrs;
    document.getElementById("timestamp-min").value = mins;
    document.getElementById("timestamp-sec").value = secs;
    timestampFields.forEach((field) => (field.disabled = false));
  }

  formTitle.textContent = `Segment ${segmentNumber} Details`;
  questionsInput.value = data.questions || "";
  typeInput.value = data.type || "";

  document.getElementById("details-form").style.display = "block";

  const segmentBlocks = document.getElementsByClassName("segment-block");
  Array.from(segmentBlocks).forEach((block) =>
    block.classList.remove("active")
  );
  document
    .querySelector(`[data-segment="${segmentNumber}"]`)
    ?.classList.add("active");
}

/**
 * Function to update segment timestamps based on video duration.
 * @param {number} videoIndex - Index of the selected video
 * @param {number} numSegments - Number of segments
 */
function updateSegmentTimestamps(videoIndex, numSegments) {
  const videoDuration = state.videoDurations[videoIndex];
  const segmentDuration = videoDuration / numSegments;

  for (let i = 1; i <= numSegments; i++) {
    if (state.videoData[videoIndex].segments[i]) {
      state.videoData[videoIndex].segments[i].timestamp = i === 1 ? 0 : (i - 1) * segmentDuration;
    }
  }
}

function saveVideoEdits(videoIndex) {
  if (!state.modifiedResponseData[videoIndex]) return;

  const data = state.modifiedResponseData[videoIndex];

  // Save title and description
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  if (titleEl) data.title = titleEl.value;
  if (descEl) data.description = descEl.value;

  // Save segment modifications
  data.segments.forEach((segment, i) => {
    const textEl = document.getElementById(`segment-text-${i}`);
    if (textEl) segment.text = textEl.value;
  });

  // Save question modifications
  data.questions = data.questions.map((question, i) => {
    const newQuestion = { ...question };
    const questionTextEl = document.getElementById(`question-text-${i}`);
    const option1El = document.getElementById(`option-${i}-0`);
    const option2El = document.getElementById(`option-${i}-1`);
    const option3El = document.getElementById(`option-${i}-2`);
    const option4El = document.getElementById(`option-${i}-3`);
    const correctAnswerEl = document.getElementById(`correct-answer-${i}`);

    if (questionTextEl) newQuestion.question = questionTextEl.value;
    if (option1El) newQuestion.option_1 = option1El.value;
    if (option2El) newQuestion.option_2 = option2El.value;
    if (option3El) newQuestion.option_3 = option3El.value;
    if (option4El) newQuestion.option_4 = option4El.value;
    if (correctAnswerEl)
      newQuestion.correct_answer = parseInt(correctAnswerEl.value);

    return newQuestion;
  });

  questionDB.saveVideoData(data);
}

/**
 * Function to create batches for video processing.
 * @param {Array<number>} videoIndices - List of video indices
 * @returns {Array<Array<number>>} - Array of batches
 */
function createBatches(videoIndices) {
  console.log("Creating batches for videos:", videoIndices);
  const batches = [];
  let currentBatch = [];
  let currentBatchSegments = 0;

  for (const videoIndex of videoIndices) {
    const videoSegments = Object.keys(state.videoData[videoIndex]?.segments || {}).length;

    if (currentBatchSegments + videoSegments > 15) {
      if (currentBatch.length > 0) {
        batches.push(currentBatch);
      }
      currentBatch = [videoIndex];
      currentBatchSegments = videoSegments;
    } else {
      currentBatch.push(videoIndex);
      currentBatchSegments += videoSegments;
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }
  console.log("Created batches:", batches);
  return batches;
}

async function processBatches(batches) {
  console.log("Processing batches:", batches);
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    // Process each video in the batch
    const batchPromises = batch.map(async (videoIndex) => {
      try {
        const videoURL = state.videoUrls[videoIndex];
        const segments = state.videoData[videoIndex].segments;

        const timestamps = [];
        const segmentWiseQNo = [];
        const segmentWiseQModel = [];

        Object.values(segments).forEach((data) => {
          if (data.timestamp !== null) timestamps.push(parseInt(data.timestamp, 10));
          if (data.questions !== null) segmentWiseQNo.push(data.questions);
          if (data.type !== null) segmentWiseQModel.push(data.type);
        });

        const payload = {
          url: videoURL,
          user_api_key: document.getElementById("user-api-key").value,
          timestamps,
          segment_wise_q_no: segmentWiseQNo,
          segment_wise_q_model: segmentWiseQModel,
        };
        console.log("Processing video:", videoIndex, payload);
        const response = await fetch("/questions/process_video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to process video ${videoIndex}`);
        }
        let data;
        try {
          data = await response.json();
          state.responseData[videoIndex] = data;
          // Process the data
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // Handle the error, e.g., show an error message to the user
        }
        // Update the responseData with the processed data
        state.responseData[videoIndex] = data;

        // Save to IndexedDB
        await questionDB.saveVideoData({
          ...data,
          video_url: videoURL,
        });

        return data;
      } catch (error) {
        console.error(`Error processing batch ${i}:`, error);
        return null; // Skip failed uploads instead of blocking all
      }
    });

    await Promise.all(batchPromises);

    if (i < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 90000)); // Rate-limit API calls
    }
  }
}

export { getVideoDuration, selectVideo, updateSegmentTimestamps, createBatches, saveVideoEdits, onYouTubeIframeAPIReady, processBatches };

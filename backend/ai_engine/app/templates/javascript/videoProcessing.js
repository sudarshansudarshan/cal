import state from "./state.js";
import { questionDB } from "./db.js";

function onYouTubeIframeAPIReady() {
    state.player = new YT.Player("player", {
        height: "360",
        width: "640",
        videoId: "",
        playerVars: {
            playsinline: 1,
            origin: window.location.origin // Dynamically set the origin
        },
    });
}

/**
 * Function to save modifications made to a video.
 */
function saveVideoEdits(videoIndex) {
  if (!state.modifiedResponseData[videoIndex]) return;

  const data = state.modifiedResponseData[videoIndex];

  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  if (titleEl) data.title = titleEl.value;
  if (descEl) data.description = descEl.value;

  questionDB.saveVideoData(data);
}

// Possible issue with resoponseData.

/**
 * Function to check if the URL is a YouTube playlist URL.
 * @param {string} url - YouTube video URL
 * @returns {boolean}
 */
function isPlaylistUrl(url) {
  return url.includes("playlist?list=") || url.includes("&list=");
}

/**
 * Fetch the duration of a YouTube video.
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<number>} - Video duration in seconds
 */
async function getVideoDuration(videoId) {
  return new Promise((resolve) => {
    const tempPlayer = new YT.Player("temp-player", {
      videoId: videoId,
      events: {
        onReady: (event) => {
          const duration = event.target.getDuration();
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

  if (!videoId || !videoId[1]) {
    console.error("Invalid video URL or ID:", videoUrl);
    return;
  }

  console.log("Selected video ID:", videoId[1]);
  state.player = onYouTubeIframeAPIReady(); // Initialize the player

  // Use state.player instead of global 'player' variable
  if (state.player?.loadVideoById) {
    state.player.loadVideoById(videoId[1]);
  } else {
    console.error("Player is not initialized yet");
  }

  document.querySelectorAll(".video-block").forEach((block) => block.classList.remove("active"));
  const videoBlocks = document.getElementsByClassName("video-block");
  if (videoBlocks[index]) {
    videoBlocks[index].classList.add("active");
  }

  if (!state.videoData[index]) {
    state.videoData[index] = { segments: {} };
  }
}

/**
 * Function to update segment timestamps based on video duration.
 * @param {number} videoIndex - Index of the selected video
 * @param {number} numSegments - Number of segments
 */
function updateSegmentTimestamps(videoIndex, numSegments) {
  const videoDuration = state.VideoDurations[videoIndex];
  const segmentDuration = videoDuration / numSegments;

  for (let i = 1; i <= numSegments; i++) {
    if (state.VideoData[videoIndex].segments[i]) {
      state.VideoData[videoIndex].segments[i].timestamp = i === 1 ? 0 : (i - 1) * segmentDuration;
    }
  }
}

/**
 * Function to create batches for video processing.
 * @param {Array<number>} videoIndices - List of video indices
 * @returns {Array<Array<number>>} - Array of batches
 */
function createBatches(videoIndices) {
  const batches = [];
  let currentBatch = [];
  let currentBatchSegments = 0;

  for (const videoIndex of videoIndices) {
    const videoSegments = Object.keys(state.VideoData[videoIndex]?.segments || {}).length;

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

  return batches;
}

export { isPlaylistUrl, getVideoDuration, selectVideo, updateSegmentTimestamps, createBatches, saveVideoEdits, onYouTubeIframeAPIReady };

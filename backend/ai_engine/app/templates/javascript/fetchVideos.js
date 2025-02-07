// fetchVideos.js
import state from "./state.js";
import { getVideoDuration, isPlaylistUrl } from "./videoProcessing.js";
import { displayVideoBlocks } from "./outputDisplay.js";

async function fetchVideos() {
  const playlistUrl = document.getElementById("playlist-url").value;
  state.defaultSegments = parseInt(document.getElementById("default-segments").value) || 0;
  state.defaultQuestions = parseInt(document.getElementById("default-questions").value) || 0;

  if (!state.defaultSegments) {
    alert("Please enter default number of segments");
    return;
  }
  if (!state.defaultQuestions) {
    alert("Please enter default number of questions");
    return;
  }

  try {
    if (isPlaylistUrl(playlistUrl)) {
      const response = await fetch("/questions/get_urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: playlistUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      state.videoUrls = data.video_urls;
    } else {
      state.videoUrls = [playlistUrl];
    }

    // Get durations for all videos
    for (let i = 0; i < state.videoUrls.length; i++) {
      const videoId = state.videoUrls[i].match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/
  );
      state.videoDurations[i] = await getVideoDuration(videoId);
    }

    displayVideoBlocks();
    document.getElementById("video-form").style.display = "block";

    // Auto-populate videos with default segments
    state.videoUrls.forEach((_, index) => {
      state.videoData[index] = { segments: {} };
      if (state.defaultSegments > 0) {
        const numSegments = state.defaultSegments;
        for (let i = 1; i <= numSegments; i++) {
          const segmentDuration = state.videoDurations[index] / numSegments;
          state.videoData[index].segments[i] = {
            timestamp: (i - 1) * segmentDuration,
            questions: state.defaultQuestions || null,
            type: "analytical",
          };
        }
        document.getElementById("num-segments").value = numSegments;
      }
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
}

export { fetchVideos };

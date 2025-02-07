import { displayOutput } from "./outputDisplay.js";
import { selectVideo, getVideoDuration } from "./videoProcessing.js";
import { populateCourseDropdown } from "./eventHandlers.js";
import { loadConfig } from "./config.js";
import { fetchVideos } from "./fetchVideos.js";
import { onYouTubeIframeAPIReady } from "./videoProcessing.js";



document.addEventListener("DOMContentLoaded", async () => {
  await loadConfig();
  await populateCourseDropdown();
  document.getElementById("fetch-videos").addEventListener("click", fetchVideos);
});

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;


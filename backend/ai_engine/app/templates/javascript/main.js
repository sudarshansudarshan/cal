import { populateCourseDropdown, populateModuleDropdown, populateSectionDropdown } from "./eventHandlers.js";
import { loadConfig } from "./config.js";
import { fetchVideos } from "./fetchVideos.js";
import { onYouTubeIframeAPIReady } from "./videoProcessing.js";
import { uploadVideos } from "./uploadVideos.js";
import { confirmAndDownload } from "./confirm.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log(1)
  await loadConfig();
  await populateCourseDropdown();
  onYouTubeIframeAPIReady();
  document.getElementById("fetch-videos").addEventListener("click", fetchVideos);
  document.getElementById("course-select").addEventListener("change", populateModuleDropdown);
  document.getElementById("module-select").addEventListener("change", populateSectionDropdown);
  document.getElementById("upload-videos").addEventListener("click", uploadVideos);
  document.getElementById("confirm-btn").addEventListener("click", confirmAndDownload);
  //window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
});

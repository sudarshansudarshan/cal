import state from "./state.js";
const config = state.config;

async function loadConfig() {
  try {
    const response = await fetch("/config");
    const data = await response.json();
    config.LMS_GET_URL = data.LMS_GET_URL;
    config.VIDEO_UPLOAD_URL = data.VIDEO_UPLOAD_URL;
    config.ASSESSMENT_UPLOAD_URL = data.ASSESSMENT_UPLOAD_URL;
    config.QUESTIONS_UPLOAD_URL = data.QUESTIONS_UPLOAD_URL;
    config.Authorization = data.Authorization;
    console.log("Config Loaded:", config);
  } catch (error) {
    console.error("Error fetching config:", error);
  }
}

export { config, loadConfig };

import { displayOutput } from "./outputDisplay.js"; // Import output display function
import { createBatches, processBatches } from "./videoProcessing.js"; // Import createBatches function
import state from "./state.js"; // Import videoData, responseData, and deepCopy from state.js
import { deepCopy } from "./utils.js";

async function uploadVideos(e) {
  e.preventDefault();
  console.log("Upload Button Cliked");
  const userApiKey = document.getElementById("user-api-key").value;
  console.log("User API Key:", userApiKey);
  const generatingSign = document.getElementById("generating-sign");
  console.log("Generating Sign:", generatingSign);
  const outputDiv = document.getElementById("output");
  console.log("Output Div:", outputDiv);
  const confirmButton = document.getElementById("confirm-btn");
  console.log("Confirm Button:", confirmButton);

  generatingSign.style.display = "block";
  outputDiv.style.display = "none";
  confirmButton.style.display = "none";

  try {
    const videoIndices = Object.keys(state.videoData).map(Number);
    const batches = createBatches(videoIndices);
    console.log("Batches:", batches);
    await processBatches(batches);

    state.modifiedResponseData = deepCopy(state.responseData);

    console.log("Original responseData:", state.responseData);
    console.log("Modified responseData:", state.modifiedResponseData);

    generatingSign.style.display = "none";
    outputDiv.style.display = "block";
    console.log("Modified Response Data:", state.modifiedResponseData);
    displayOutput(state.modifiedResponseData[state.currentVideo]);

    confirmButton.style.display = "inline-block";
  } catch (error) {
    generatingSign.style.display = "none";
    outputDiv.textContent = `Error processing videos: ${error.message}`;
  }
}

export { uploadVideos };

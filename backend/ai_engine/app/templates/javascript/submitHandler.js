import { questionDB } from "./db.js";
import { config } from "./config.js";
import { displayOutput } from "./outputDisplay.js"; // Import output display function

let modifiedResponseData = {}; // Ensure this stores the generated data

function setupSubmitButton() {
  document.getElementById("video-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("🚀 Upload button clicked!");

    const userApiKey = document.getElementById("user-api-key").value;
    if (!userApiKey) {
      alert("⚠️ Please enter a valid API key.");
      return;
    }

    try {
      const response = await fetch("/questions/process_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: userApiKey }),
      });

      if (!response.ok) throw new Error(`Upload Failed: ${response.status}`);

      const data = await response.json();
      console.log("✅ Upload Successful:", data);

      // Store processed data in modifiedResponseData
      modifiedResponseData = data;

      // Save to IndexedDB
      await questionDB.saveVideoData({ ...data });

      // Display output in UI
      displayOutput(modifiedResponseData);

    } catch (error) {
      console.error("❌ Error during upload:", error);
    }
  });
}

export { setupSubmitButton, modifiedResponseData };

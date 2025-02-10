function deepCopy(obj) {
  return obj === null || typeof obj !== "object"
    ? obj
    : Array.isArray(obj)
    ? obj.map(deepCopy)
    : Object.keys(obj).reduce((copy, key) => {
        copy[key] = deepCopy(obj[key]);
        return copy;
      }, {});
}

function secondsToHMS(seconds) {
  return { hrs: Math.floor(seconds / 3600), mins: Math.floor((seconds % 3600) / 60), secs: seconds % 60 };
}

function hmsToSeconds(hrs, mins, secs) {
  return hrs * 3600 + mins * 60 + secs;
}

/**
 * Function to check if the URL is a YouTube playlist URL.
 * @param {string} url - YouTube video URL
 * @returns {boolean}
 */
function isPlaylistUrl(url) {
  return url.includes("playlist?list=") || url.includes("&list=");
}

/**
 * Function to validate timestamps in video segments.
 * Ensures that:
 * 1. Timestamps are strictly increasing within a video.
 * 2. The last segment timestamp is less than the total video duration.
 *
 * @param {Object} videoData - Object containing video segments with timestamps.
 * @param {Array} videoDurations - Array of total durations for each video.
 * @returns {boolean} - Returns true if all timestamps are valid, otherwise false.
 */
function validateTimestamps(videoData, videoDurations) {
  for (let videoIndex in videoData) {
    const segments = videoData[videoIndex].segments;

    // Extract and sort segment numbers in ascending order (convert keys to numbers)
    const segmentNumbers = Object.keys(segments)
      .map(Number) // Ensure numerical sorting
      .sort((a, b) => a - b);

    let previousTimestamp = -1; // Initialize previous timestamp for comparison

    for (let segNum of segmentNumbers) {
      const currentTimestamp = segments[segNum].timestamp;

      // Ensure timestamps are strictly increasing (except for the first segment)
      if (currentTimestamp <= previousTimestamp) {
        alert(
          `Video ${parseInt(videoIndex) + 1}, Segment ${segNum}: Timestamp (${currentTimestamp}s) must be greater than previous segment's timestamp (${previousTimestamp}s).`
        );
        return false;
      }

      // Ensure the last segment's timestamp is within the video's duration
      if (segNum === segmentNumbers[segmentNumbers.length - 1]) {
        if (currentTimestamp >= videoDurations[videoIndex]) {
          alert(
            `Video ${parseInt(videoIndex) + 1}, Segment ${segNum}: Last segment timestamp (${currentTimestamp}s) must be less than video duration (${videoDurations[videoIndex]}s).`
          );
          return false;
        }
      }

      previousTimestamp = currentTimestamp; // Update previous timestamp for next iteration
    }
  }
  return true; // Return true if all timestamps are valid
}

export { deepCopy, secondsToHMS, hmsToSeconds, isPlaylistUrl, validateTimestamps };

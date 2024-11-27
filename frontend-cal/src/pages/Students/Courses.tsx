import KeyboardLock from "@/components/proctoring-components/KeyboardLock";
import RightClickDisabler from "@/components/proctoring-components/RightClickDisable";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaExpand } from "react-icons/fa"; // Import Fullscreen Icon

const Courses = () => {
  const videoPlayerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [timestamps] = useState([10, 20, 30, 40, 50, 120]); // Timestamps in seconds
  const [showPopup, setShowPopup] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(50); // Volume percentage (0-100)
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // Default playback speed
  const triggeredTimestamps = useRef(new Set()); // To track triggered timestamps

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (player) {
          const current = player.getCurrentTime(); // Sync with video current time
          setCurrentTime(current);

          // Check if currentTime matches any unprocessed timestamp
          const currentTimestamp = Math.floor(current);
          if (
            timestamps.includes(currentTimestamp) &&
            !triggeredTimestamps.current.has(currentTimestamp)
          ) {
            triggeredTimestamps.current.add(currentTimestamp); // Mark timestamp as processed
            pauseVideoAndShowPopup(currentTimestamp);
          }
        }
      }, 500); // Update every 500ms
    } else {
      clearInterval(interval); // Stop updating when video is paused
    }
    return () => clearInterval(interval);
  }, [isPlaying, player, timestamps]);

  const initPlayer = () => {
    const playerInstance = new window.YT.Player(videoPlayerRef.current, {
      videoId: "1z-E_KOC2L0",
      playerVars: {
        enablejsapi: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
    setPlayer(playerInstance);
  };

  const onPlayerReady = (event) => {
    const duration = event.target.getDuration();
    setTotalDuration(duration); // Set total duration of the video
    player.setVolume(volume); // Set initial volume
    setPlaybackSpeed(player.getPlaybackRate()); // Initialize playback speed
  };

  const pauseVideoAndShowPopup = (timestamp) => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
    setCurrentTimestamp(timestamp);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    if (player) {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (player && !showPopup) {
      // Prevent playing video if popup is active
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    } else if (showPopup) {
      alert("Please close the popup before resuming the video.");
    }
  };

  const seekVideo = (newTime) => {
    if (player && newTime <= currentTime) {
      // Allow only rewinding
      player.seekTo(newTime, true); // Seek to the specified time
      setCurrentTime(newTime); // Update state
    } else {
      alert("Skipping forward is not allowed."); // Notify the user
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume); // Adjust the volume
    }
  };

  const changePlaybackSpeed = (speed) => {
    if (player) {
      player.setPlaybackRate(speed); // Set the new playback speed
      setPlaybackSpeed(speed); // Update state
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = document.querySelector(".video-container");
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
      videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
      videoContainer.msRequestFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="youtube-player h-full relative">
      <RightClickDisabler />
      <KeyboardLock/>
      <div className="youtube-player h-4/5">
        <div className="video-container h-full bg-gray-400 p-3 mx-20">
          <div
            ref={videoPlayerRef}
            className="w-full h-full no-interaction"
          ></div>
        </div>
        <div className="flex justify-center">
          <div className="controls-container w-full mx-20 mt-4 bg-white p-4 rounded-lg shadow">
            <div className="mt-2">
              <input
                type="range"
                className="w-full"
                min="0"
                max={totalDuration}
                value={currentTime}
                onChange={(e) => seekVideo(Number(e.target.value))}
              />
            </div>
            {/* Play/Pause and Volume */}
            <div className="flex justify-between">
              <div className="flex items-center">
                <button
                  onClick={togglePlayPause}
                  className="text-2xl p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <div className="ml-6 flex items-center">
                  <label htmlFor="volume" className="mr-2 text-sm font-medium">
                    Volume:
                  </label>
                  <input
                    id="volume"
                    type="range"
                    className="w-24"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Current Time and Duration */}
              <div className="flex items-center">
                <div className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </div>
              </div>

              {/* Playback Speed Buttons */}
              <div className="flex items-center">
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changePlaybackSpeed(speed)}
                    className={`mx-1 px-3 py-1 text-sm rounded-full ${
                      playbackSpeed === speed
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Fullscreen Button */}
              <div>
                <button
                  onClick={toggleFullscreen}
                  className="text-xl p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="popup-content bg-white p-5 rounded shadow-lg">
            <p className="text-lg font-bold">
              Video paused at {formatTime(currentTimestamp)}.
            </p>
            <p>You must close this popup to continue watching.</p>
            <button
              onClick={closePopup}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close Popup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

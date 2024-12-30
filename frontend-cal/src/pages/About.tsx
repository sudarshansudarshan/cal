import React, { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ videoId = 'u7pCgFHszI4' }) => {
  const playerRef = useRef(null);
  const [dynamicId, setDynamicId] = useState(0);

  // Function to cleanup existing player
  const cleanupPlayer = () => {
    if (window.player) {
      window.player.destroy();
    }
  };

  // Player event handlers
  const onPlayerReady = (event) => {
    console.log("Player is ready");
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    console.log("Player state changed", event.data);
  };

  // Create player using YouTube IFrame API
  const createPlayer = () => {
    cleanupPlayer(); // Clean up any existing player instance
    window.player = new YT.Player(`player-${dynamicId}`, {
      videoId: videoId,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
      playerVars: {
        rel: 0,
        controls: 0,
        modestbranding: 1,
        showinfo: 0,
        fs: 1,
        iv_load_policy: 3,
        cc_load_policy: 1,
        autohide: 1,
        enablejsapi: 1
      },
    });
    console.log("Player created: ", window.player);
  };

  // Effect to create the player
  useEffect(() => {
    if (typeof YT === 'undefined' || !YT.Player) {
      // Load the YouTube IFrame Player API asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Initialize player once API is ready
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      cleanupPlayer();
    };
  }, [videoId, dynamicId]);

  const handleButtonClick = () => {
    setDynamicId(prevId => prevId + 1);
  };

  return (
    <div className='h-screen'>
      <button onClick={handleButtonClick}>Change ID</button>
      <iframe
        id={`player-${dynamicId}`}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&controls=0&modestbranding=1&showinfo=0&fs=1&iv_load_policy=3&cc_load_policy=1&autohide=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;

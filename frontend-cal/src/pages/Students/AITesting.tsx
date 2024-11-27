import React, { useState, useEffect } from 'react';

const AITesting = () => {
  const [cameraDetected, setCameraDetected] = useState(null);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraDetected(true);
      } catch {
        setCameraDetected(false);
      }
    };
    checkCamera();
  }, []);

  if (cameraDetected === null) {
    return <div>Loading...</div>; // Show while checking for the camera
  }

  if (!cameraDetected) {
    return (
      <div>
        <h2>Camera Not Detected</h2>
        <p>Please connect a camera and reload the page.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return <div>Welcome to AI Testing</div>; // App content goes here
};

export default AITesting;

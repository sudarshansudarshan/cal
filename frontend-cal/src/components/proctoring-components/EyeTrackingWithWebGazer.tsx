import React, { useEffect, useRef, useState } from "react";

const EyeTrackingWithWebGazer: React.FC = () => {
  const [isGazeOnScreen, setIsGazeOnScreen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current!;
    const canvasElement = canvasRef.current!;
    const canvasCtx = canvasElement.getContext("2d");
    let animationFrameId: number;

    // Set up the video stream
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
          startProcessing();
        };
      })
      .catch((err) => {
        console.error("Error accessing the camera: " + err);
      });

    const startProcessing = () => {
      if (typeof window.webgazer !== "undefined") {
        window.webgazer
          .setRegression("ridge")
          .setGazeListener((data) => {
            if (!data) {
              setIsGazeOnScreen(false);
              return;
            }

            const x = data.x; // Gaze x-coordinate
            const y = data.y; // Gaze y-coordinate
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Check if gaze is within the screen bounds
            setIsGazeOnScreen(x >= 0 && x <= screenWidth && y >= 0 && y <= screenHeight);
          })
          .begin()
          .showVideo(false) // Disable default WebGazer video
          .showFaceOverlay(false)
          .showFaceFeedbackBox(false);

        processVideoFrame();
      } else {
        console.error("WebGazer is not loaded.");
      }
    };

    const processVideoFrame = () => {
      if (canvasCtx && videoElement) {
        // Draw video feed to canvas
        canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      }
      animationFrameId = requestAnimationFrame(processVideoFrame);
    };

    return () => {
      if (typeof window.webgazer !== "undefined") {
        window.webgazer.end();
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div>
      {/* Video Feed */}
      <div className="flex justify-center">
        <video ref={videoRef} style={{ display: "none" }} playsInline></video>
        <canvas
          ref={canvasRef}
          className="h-96 border-1 border-red-600"
        ></canvas>
      </div>

      {/* Gaze Status */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        Gaze On Screen: {isGazeOnScreen ? "True" : "False"}
      </div>

      
    
      {/* Hidden video element for capturing the stream */}
      <video ref={videoRef} style={{ display: "none" }} />
    </div>
  );
};

export default EyeTrackingWithWebGazer;

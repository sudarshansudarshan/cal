import React, { useEffect, useRef, useState } from "react";

// Define the type for calibration positions
interface CalibrationPosition {
  x: number;
  y: number;
}

const EyeTrackingWithWebGazer: React.FC = () => {
  const [status, setStatus] = useState<string>("Initializing...");
  const [gazeDirection, setGazeDirection] = useState<string>("Center");

  const calibrationCounterRef = useRef<number>(0);
  const totalCalibrationPoints = 9;
  const calibrationPositions: CalibrationPosition[] = [
    { x: 0.2, y: 0.2 },
    { x: 0.5, y: 0.2 },
    { x: 0.8, y: 0.2 },
    { x: 0.2, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.8, y: 0.5 },
    { x: 0.2, y: 0.8 },
    { x: 0.5, y: 0.8 },
    { x: 0.8, y: 0.8 },
  ];

  useEffect(() => {
    const initializeWebGazer = async () => {
      setStatus("WebGazer.js initialized. Starting calibration...");

      if (typeof window.webgazer !== "undefined") {
        window.webgazer
          .setRegression("ridge")
          .setGazeListener((data, elapsedTime) => {
            if (!data) return;

            const x = data.x; // Gaze x-coordinate
            const y = data.y; // Gaze y-coordinate
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const horizontalThreshold = screenWidth / 6;
            const verticalThreshold = screenHeight / 6;

            let gazeHorizontal: string, gazeVertical: string;

            // Horizontal Gaze Direction
            if (x < screenWidth / 2 - horizontalThreshold) {
              gazeHorizontal = "Left";
            } else if (x > screenWidth / 2 + horizontalThreshold) {
              gazeHorizontal = "Right";
            } else {
              gazeHorizontal = "Center";
            }

            // Vertical Gaze Direction
            if (y < screenHeight / 2 - verticalThreshold) {
              gazeVertical = "Up";
            } else if (y > screenHeight / 2 + verticalThreshold) {
              gazeVertical = "Down";
            } else {
              gazeVertical = "Center";
            }

            // Combine gaze directions
            if (gazeVertical === "Center" && gazeHorizontal === "Center") {
              setGazeDirection("Center");
            } else if (gazeVertical === "Center") {
              setGazeDirection(gazeHorizontal);
            } else if (gazeHorizontal === "Center") {
              setGazeDirection(gazeVertical);
            } else {
              setGazeDirection(`${gazeVertical}-${gazeHorizontal}`);
            }
          })
          .saveDataAcrossSessions(true)
          .begin()
          .showVideo(false)
          .showFaceOverlay(false)
          .showFaceFeedbackBox(false);

        startCalibration();
      } else {
        console.error("WebGazer is not loaded.");
        setStatus("Error: WebGazer.js not found.");
      }
    };

    initializeWebGazer();

    return () => {
      if (typeof window.webgazer !== "undefined") {
        window.webgazer.end();
      }
    };
  }, []);

  const startCalibration = () => {
    setStatus("Calibration in progress...");
    showCalibrationPoint();
  };

  const showCalibrationPoint = () => {
    if (calibrationCounterRef.current >= totalCalibrationPoints) {
      setStatus("Calibration complete. Tracking gaze...");
      return;
    }

    const position = calibrationPositions[calibrationCounterRef.current];
    const x = position.x * window.innerWidth;
    const y = position.y * window.innerHeight;

    const calibrationDot = document.createElement("div");
    calibrationDot.style.position = "absolute";
    calibrationDot.style.width = "30px";
    calibrationDot.style.height = "30px";
    calibrationDot.style.backgroundColor = "green";
    calibrationDot.style.borderRadius = "50%";
    calibrationDot.style.left = `${x - 15}px`;
    calibrationDot.style.top = `${y - 15}px`;
    calibrationDot.style.zIndex = "1000";
    calibrationDot.style.pointerEvents = "none";

    document.body.appendChild(calibrationDot);

    setTimeout(() => {
      if (typeof window.webgazer !== "undefined") {
        window.webgazer.recordScreenPosition(x, y, "click");
      }

      document.body.removeChild(calibrationDot);
      calibrationCounterRef.current++;
      showCalibrationPoint();
    }, 1500); // Adjust duration as needed
  };

  return (
    <div>
      <h1>Eye Tracking with WebGazer.js</h1>
      <div style={{ marginTop: "20px", fontSize: "1.5em" }}>{status}</div>
      <div style={{ marginTop: "20px", fontSize: "1.5em" }}>
        Gaze Direction: {gazeDirection}
      </div>
    </div>
  );
};

export default EyeTrackingWithWebGazer;

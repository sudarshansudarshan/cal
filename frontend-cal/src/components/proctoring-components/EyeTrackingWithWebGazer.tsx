import React, { useEffect, useRef, useState } from "react";

// Define the type for calibration positions
interface CalibrationPosition {
    x: number;
    y: number;
}

const EyeTrackingWithWebGazer: React.FC = () => {
    const [status, setStatus] = useState<string>("Initializing...");
    const [lookingAtScreen, setLookingAtScreen] = useState<boolean>(true);
    const [showMessage, setShowMessage] = useState<boolean>(true);

    const calibrationCounterRef = useRef<number>(0);
    const totalCalibrationPoints = 9;
    const calibrationPositions: CalibrationPosition[] = [
        { x: 0.1, y: 0.1 },
        { x: 0.5, y: 0.1 },
        { x: 0.9, y: 0.1 },
        { x: 0.1, y: 0.5 },
        { x: 0.5, y: 0.5 },
        { x: 0.9, y: 0.5 },
        { x: 0.1, y: 0.9 },
        { x: 0.5, y: 0.9 },
        { x: 0.9, y: 0.9 },
    ];

    const gazeXHistory: number[] = [];
    const gazeYHistory: number[] = [];
    const historySize = 20;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    useEffect(() => {
        const initializeWebGazer = async () => {
            setStatus("WebGazer.js initialized. Starting calibration...");

            if (typeof window.webgazer !== "undefined") {
                window.webgazer
                    .setRegression("ridge")
                    .setTracker("clmtrackr")
                    .setGazeListener((data, elapsedTime) => {
                        if (!data) {
                            setLookingAtScreen(false);
                            return;
                        }

                        let smoothedX = smoothCoordinates(gazeXHistory, data.x, historySize);
                        let smoothedY = smoothCoordinates(gazeYHistory, data.y, historySize);

                        if (isOutOfBounds(smoothedX, smoothedY)) {
                            setLookingAtScreen(false); // User is looking away
                        } else {
                            setLookingAtScreen(true); // User is looking at the screen
                        }
                    })
                    .saveDataAcrossSessions(true)
                    .begin();

                window.webgazer.showVideoPreview(false);
                window.webgazer.showPredictionPoints(false); // Hide the red dot
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
    }, [screenWidth, screenHeight]);

    const smoothCoordinates = (coordinates: number[], newValue: number, maxSize: number) => {
        coordinates.push(newValue);
        if (coordinates.length > maxSize) coordinates.shift();
        return coordinates.reduce((a, b) => a + b, 0) / coordinates.length;
    };

    const isOutOfBounds = (x: number, y: number) => {
        return x < 0 || x > screenWidth || y < 0 || y > screenHeight;
    };

    const startCalibration = () => {
        setStatus("Calibration in progress...");
        calibrationCounterRef.current = 0; // Reset counter
        setTimeout(() => {
            showCalibrationPoint();
        }, 2000); // Adjust delay as needed to ensure camera starts
    };

    const showCalibrationPoint = () => {
        if (calibrationCounterRef.current >= totalCalibrationPoints) {
            setStatus("Calibration complete. Validating...");
            validateCalibration();
            return;
        }

        const position = calibrationPositions[calibrationCounterRef.current];
        const x = position.x * screenWidth;
        const y = position.y * screenHeight;

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

        let dataPoints = 0;
        const interval = setInterval(() => {
            if (typeof window.webgazer !== "undefined") {
                window.webgazer.recordScreenPosition(x, y, "click");
                dataPoints++;
            }
        }, 200); // Collect data points every 200ms

        setTimeout(() => {
            clearInterval(interval); // Stop data collection
            document.body.removeChild(calibrationDot);
            calibrationCounterRef.current++;
            showCalibrationPoint();
        }, 2000); // Show each calibration point for 2 seconds
    };

    const validateCalibration = () => {
        // Placeholder: Add your calibration validation logic here
        setStatus("Calibration validated. Ready for gaze tracking.");
    };

    const handleAccept = () => {
        setShowMessage(false);
        startCalibration();
    };

    const handleRecalibrate = () => {
        setShowMessage(true);
        setStatus("Recalibrating...");
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {showMessage ? (
                <div>
                    <p>Please look at the green dot for calibration.</p>
                    <button onClick={handleAccept}>Accept</button>
                </div>
            ) : (
                <div style={{ marginTop: '10px' }}>
                    <p>Status: {status}</p>
                    <p>Looking at Screen: {lookingAtScreen.toString()}</p>
                    <button onClick={handleRecalibrate}>Recalibrate</button>
                </div>
            )}
        </div>
    );
};

export default EyeTrackingWithWebGazer;

import React, { useEffect, useRef } from "react";
import { PoseLandmarker } from "@mediapipe/tasks-vision";

type WasmFileset = any;
// take lookAwayCount and numPeople as props
interface PoseLandmarkerProps {
    filesetResolver: WasmFileset;
    lookAwayCount: number;
    setLookAwayCount: React.Dispatch<React.SetStateAction<number>>;
    numPeople: number;
    setNumPeople: React.Dispatch<React.SetStateAction<number>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const PoseLandmarkerComponent: React.FC<PoseLandmarkerProps> = ({filesetResolver, lookAwayCount, setLookAwayCount, numPeople, setNumPeople, status, setStatus}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
    const lookAwayCountRef = useRef(0);
    const minEyeDiffForFocus = 0.070;
    
    // useEffect to initialize the PoseLandmarker and start the webcam
    useEffect(() => {
        const initializePoseLandmarker = async () => {

            poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: "src/models/pose_landmarker_lite.task", 
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numPoses: 2
            });
        };

        const startWebcam = async () => {
            const video = videoRef.current;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (video) {
                    video.srcObject = stream;
                    video.play();
                }
            }
        };

        initializePoseLandmarker();
        startWebcam();

        return () => {
            const video = videoRef.current;
            if (video && video.srcObject) {
                const tracks = (video.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    // useEffect to detect poses in the webcam feed and update the number of people and status
    useEffect(() => {
        const video = videoRef.current;

        const detectLandmarks = async () => {
            if (poseLandmarkerRef.current && video && video.readyState === 4) {
                const landmarks = await poseLandmarkerRef.current.detectForVideo(video, performance.now());
                if(landmarks && landmarks.landmarks){
                    if(!landmarks.landmarks[0]){
                        setNumPeople(0);
                    }
                    if (landmarks.landmarks[0]) {
                        setNumPeople(landmarks.landmarks.length);                 
                    // checking if the person's face is in the middle of the fame
                    const nose = landmarks.landmarks[0][0]
                    if (nose) {
                        const videoWidth = video.videoWidth;
                        const videoHeight = video.videoHeight;

                        const box = {
                            // height and width of the box is 1/2 of the video frame
                            left: videoWidth / 4,
                            right: (videoWidth * 3) / 4,
                            top: videoHeight / 4,
                            bottom: (videoHeight * 3) / 4
                        };

                        const noseX = nose.x * videoWidth;
                        const noseY = nose.y * videoHeight;

                        const isInBox = 
                            noseX >= box.left &&
                            noseX <= box.right &&
                            noseY >= box.top &&
                            noseY <= box.bottom;

                        isInBox ? setStatus("User is in box") : setStatus("User is not in box")
                    }
                    const leftEye = landmarks.landmarks[0][2];
                    const rightEye = landmarks.landmarks[0][5];
                    const eyeDiff = Math.abs(leftEye.x - rightEye.x); // Difference in X positions of eyes
                    if (eyeDiff < minEyeDiffForFocus) {
                    lookAwayCountRef.current++;
                    setLookAwayCount(lookAwayCountRef.current);
                    setStatus('Focus on the lecture!');
                    }
                    } else {
                    setStatus("User not detected.")
                    }
                }
            }

            requestAnimationFrame(detectLandmarks);
        };

        detectLandmarks();
    }, []);

    return (
        <div>
            <video ref={videoRef} style={{ display: "none" }} />
            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '14px' }}>
              <h4>People Count: {numPeople}</h4>
              <h4>Status: {status}</h4>
              <p>Look Away Count: {lookAwayCount} ms</p>
            </div>
        </div>
    );
};

// Explain what this component does
// This component uses the PoseLandmarker from the MediaPipe library to detect poses in a webcam feed.
// It initializes the PoseLandmarker and starts the webcam when the component mounts.
// The component detects poses in the webcam feed and updates the number of people detected, status, and look away count.
// It checks if the person's face is in the middle of the frame and updates the status accordingly.
// It also calculates the difference in X positions of the eyes to detect if the user is looking away.
// The component renders the webcam feed, number of people detected, status, and look away count.
// This component can be used for proctoring or monitoring user activity during online activities.
// It provides real-time feedback on the user's behavior and attention during the activity.
// The component can be customized with different thresholds and alerts based on the use case.
// It helps ensure user engagement and focus during online interactions.
// The component can be integrated into online learning platforms, virtual events, or remote collaboration tools.
// It enhances the user experience by providing interactive and engaging features.
// The component leverages machine learning and computer vision technologies to analyze user behavior and engagement.
// It demonstrates the capabilities of real-time pose detection and monitoring in web applications.
// The component can be extended with additional features and functionalities to meet specific requirements.
// It showcases the integration of machine learning models and webcam access in web applications.
// The component contributes to enhancing the interactivity and engagement of online experiences.
// It aligns with the trend of incorporating AI and ML technologies into web applications for enhanced user experiences.
// The component can be further optimized for performance and scalability in production environments.
// It serves as a building block for developing intelligent and interactive web applications.
// The component highlights the potential of AI-powered features in web development and user engagement.
// The component demonstrates the seamless integration of machine learning models in web applications.
// It showcases the possibilities of real-time pose detection and monitoring for various applications.
// The component can be integrated with other ML models and APIs to create more advanced functionalities.
// It reflects the growing interest in AI-driven solutions for enhancing user experiences and interactions.

export default PoseLandmarkerComponent;

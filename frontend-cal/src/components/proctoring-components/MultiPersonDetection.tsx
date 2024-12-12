import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { useWebcam } from './WebcamProvider';

const MultiPersonDetection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [peopleCount, setPeopleCount] = useState(0);
    const alertTriggered = useRef(false); // Track if the alert was triggered
    const webcamStream = useWebcam(); // Access the webcam feed from context

    useEffect(() => {
        const loadModelAndDetect = async () => {
            const model = await cocoSsd.load(); // Load the COCO-SSD model

            const detectPeople = () => {
                if (
                    videoRef.current &&
                    videoRef.current.readyState >= 2 && // Ensure video is ready
                    videoRef.current.videoWidth > 0 &&
                    videoRef.current.videoHeight > 0
                ) {
                    model.detect(videoRef.current).then((predictions) => {
                        // Count the number of people in the frame
                        const count = predictions.filter(
                            (prediction) => prediction.class === 'person' && prediction.score > 0.6
                        ).length;

                        setPeopleCount(count); // Update the people count

                        // Trigger an alert if count is 2 and hasn't been triggered yet
                        if (count === 2 && !alertTriggered.current) {
                            alert('There are two people in the frame!');
                            alertTriggered.current = true; // Set the flag
                        }

                        // Reset the flag if the count changes from 2
                        if (count !== 2) {
                            alertTriggered.current = false;
                        }
                    });
                }
            };

            // Run detection every 200ms after video has loaded metadata
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                    setInterval(detectPeople, 200); // Detect every 200ms
                };
            }
        };

        if (webcamStream && videoRef.current) {
            videoRef.current.srcObject = webcamStream;
            videoRef.current.play();
            loadModelAndDetect();
        }

        return () => {
            // Stop video tracks on cleanup
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [webcamStream]);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <video ref={videoRef} style={{ display: 'none' }} />
            <div style={{ marginTop: '10px' }}>
                People Count: {peopleCount}
            </div>
        </div>
    );
};

export default MultiPersonDetection;

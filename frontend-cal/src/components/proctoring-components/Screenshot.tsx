import React, { useState, useEffect, useRef } from 'react';

function ScreenCapture() {
    const [images, setImages] = useState([]);
    const videoRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                intervalRef.current = setInterval(() => captureScreenshot(stream), 1000);
            }
        } catch (error) {
            console.error("Error accessing the screen:", error);
        }
    };

    const captureScreenshot = (stream) => {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        // Reduce resolution: scale down to half or less
        canvas.width = video.videoWidth / 2;
        canvas.height = video.videoHeight / 2;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/jpeg", 0.3); // Further reduce quality and use JPEG

        try {
            localStorage.setItem(`screenshot-${Date.now()}`, imageUrl);
            setImages(prevImages => [...prevImages, imageUrl]);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error("Storage limit reached. Please clear storage or reduce capture frequency.");
                // Handle storage limit reached scenario
            } else {
                console.error("Error saving screenshot:", error);
            }
        }
    };

    return (
        <div>
            <button onClick={startScreenShare}>Share Screen</button>
            <div>
                <video ref={videoRef} style={{ display: 'none' }} autoPlay></video>
                {images.map((img, index) => (
                    <img key={index} src={img} alt={`Screenshot ${index}`} />
                ))}
            </div>
        </div>
    );
}

export default ScreenCapture;

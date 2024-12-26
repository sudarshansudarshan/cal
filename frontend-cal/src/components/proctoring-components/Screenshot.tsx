import React, { useEffect, useState } from 'react';

const Screenshot: React.FC = () => {
    const [screenshots, setScreenshots] = useState<string[]>([]);

    useEffect(() => {
        const takeScreenshot = async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const track = stream.getVideoTracks()[0];
                const imageCapture = new ImageCapture(track);
                const bitmap = await imageCapture.grabFrame();
                const canvas = document.createElement('canvas');
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                const context = canvas.getContext('2d');
                context?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL();
                setScreenshots(prevScreenshots => [...prevScreenshots, dataUrl]);
                localStorage.setItem(`screenshot-${Date.now()}`, dataUrl);
                track.stop();
            } catch (err) {
                console.error('Error taking screenshot:', err);
            }
        };

        const intervalId = setInterval(takeScreenshot, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div>Taking screenshots every second...</div>
            <div>
                {screenshots.map((screenshot, index) => (
                    <img key={index} src={screenshot} alt={`Screenshot ${index}`} />
                ))}
            </div>
        </div>
    );
};

export default Screenshot;
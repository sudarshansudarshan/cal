import React, { useEffect, useRef, useState } from 'react';

const MultiPersonDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [peopleCount, setPeopleCount] = useState(0);

  let countHistory = []; // History of counts for smoothing
  const maxHistory = 10; // Number of frames to consider for smoothing

  // Dynamically load the MediaPipe SelfieSegmentation script
  useEffect(() => {
    const loadSelfieSegmentation = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
      script.async = true;
      document.body.appendChild(script);

      // Wait for the script to load before proceeding
      script.onload = () => {
        // Now you can use the SelfieSegmentation class
        initialize();
      };
    };

    loadSelfieSegmentation();

    // Cleanup on component unmount
    return () => {
      const script = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Setup webcam and camera stream
  const setupCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return new Promise((resolve) => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          resolve(videoRef.current);
        };
      }
    });
  };

  const stabilizeCount = (currentCount) => {
    countHistory.push(currentCount);
    if (countHistory.length > maxHistory) {
      countHistory.shift(); // Keep history size within limit
    }

    // Calculate average count over the history
    const averageCount = Math.round(
      countHistory.reduce((sum, count) => sum + count, 0) / countHistory.length
    );

    return averageCount;
  };

  const countPeople = (segmentationData, width, height) => {
    const threshold = 128; // Alpha threshold for segmentation
    const visited = new Set(); // To track visited pixels
    const minRegionSize = 500; // Minimum pixel count for a valid region
    let peopleCount = 0;

    const isValidPixel = (x, y) => x >= 0 && x < width && y >= 0 && y < height;

    const pixelIndex = (x, y) => (y * width + x) * 4;

    const floodFill = (x, y) => {
      const stack = [[x, y]];
      let regionSize = 0;

      while (stack.length) {
        const [px, py] = stack.pop();
        const index = pixelIndex(px, py);

        if (!visited.has(index) && isValidPixel(px, py) && segmentationData[index + 3] > threshold) {
          visited.add(index);
          regionSize++;
          stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
        }
      }

      return regionSize;
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = pixelIndex(x, y);
        if (!visited.has(index) && segmentationData[index + 3] > threshold) {
          const regionSize = floodFill(x, y);
          if (regionSize >= minRegionSize) {
            peopleCount++;
          }
        }
      }
    }

    return peopleCount;
  };

  const onResults = (results) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    const canvasElement = canvasRef.current;
    const width = canvasElement.width;
    const height = canvasElement.height;

    // Clear the canvas
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.drawImage(results.image, 0, 0, width, height);

    const mask = results.segmentationMask;

    // Overlay segmentation mask
    canvasCtx.globalCompositeOperation = 'source-in';
    canvasCtx.drawImage(mask, 0, 0, width, height);
    canvasCtx.globalCompositeOperation = 'source-over';

    // Analyze the mask to count people
    const segmentationData = canvasCtx.getImageData(0, 0, width, height).data;
    const currentCount = countPeople(segmentationData, width, height);

    // Stabilize count using smoothing and thresholding
    const stabilizedCount = stabilizeCount(currentCount);
    setPeopleCount(stabilizedCount);
  };

  const processFrame = async (selfieSegmentation) => {
    if (videoRef.current) {
      await selfieSegmentation.send({ image: videoRef.current });
    }
    requestAnimationFrame(() => processFrame(selfieSegmentation));
  };

  const initialize = async () => {
    await setupCamera();

    const canvasElement = canvasRef.current;
    const videoElement = videoRef.current;

    // Set canvas size to match video size
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1, // Higher accuracy model
    });
    selfieSegmentation.onResults(onResults);

    processFrame(selfieSegmentation);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0, backgroundColor: '#f0f0f0' }}>
      <h1>Stable People Counter</h1>
      <video ref={videoRef} autoPlay playsInline muted style={{ maxWidth: '80%', marginBottom: '10px' }} />
      <canvas ref={canvasRef} style={{ maxWidth: '80%', marginBottom: '10px' }} />
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
        People Count: {peopleCount}
      </div>
    </div>
  );
};

export default MultiPersonDetection;

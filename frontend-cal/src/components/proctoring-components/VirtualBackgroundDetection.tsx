import React, { useEffect, useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tflite  from "@tensorflow/tfjs-tflite";
import { run } from "node:test";

tflite.setWasmPath('http://localhost:3000/node_modules/@tensorflow/tfjs-tflite/dist/');

const VirtualBackgroundDetection = () => {
  const [model, setModel] = useState(null);
  const videoRef = useRef(null);
  const [background, setBackground] = useState(null);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function captureFrame(video) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the frame's pixel data
    const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Convert to 2D array (height x width) of RGB pixels
    const frame = [];
    for (let i = 0; i < canvas.height; i++) {
        const row = [];
        for (let j = 0; j < canvas.width; j++) {
            const index = (i * canvas.width + j) * 4; // RGBA data
            const red = frameData[index];
            const green = frameData[index + 1];
            const blue = frameData[index + 2];
            row.push([red, green, blue]); // Store RGB values
        }
        frame.push(row);
    }
    return frame;
}

  function intraChannelCooccurrence(channel) {
    const maxVal = 256; // Fixed max pixel value range
    const coMatrix = Array.from({ length: maxVal }, () => Array(maxVal).fill(0));
    const height = channel.length;
    const width = channel[0].length;

    // Offset (1, 1): Compare diagonally neighboring pixels
    for (let i = 0; i < height - 1; i++) { // Avoid bottom edge
        for (let j = 0; j < width - 1; j++) { // Avoid right edge
            const pixel1 = channel[i][j];
            const pixel2 = channel[i + 1][j + 1];
            coMatrix[pixel1][pixel2]++;
        }
    }

    return coMatrix;
  }

  function interChannelCooccurrence(channel1, channel2) {
    if (channel1.length !== channel2.length || channel1[0].length !== channel2[0].length) {
        throw new Error("Both channels must have the same dimensions.");
    }

    const maxVal = 256; // Fixed max pixel value range
    const coMatrix = Array.from({ length: maxVal }, () => Array(maxVal).fill(0));
    const height = channel1.length;
    const width = channel1[0].length;

    // Offset (0, 0): Compare pixel values at the same spatial location
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const pixel1 = channel1[i][j];
            const pixel2 = channel2[i][j];
            coMatrix[pixel1][pixel2]++;
        }
    }

    return coMatrix;
  }

  function getSixCoMat(frame) {
    // Assuming `frame` is a 2D or 3D array representing an image in BGR format

    // Separate the B, G, R channels
    const [redChannel, greenChannel, blueChannel] = splitChannels(frame);

    // Initialize the list to hold the 6 matrices
    const sixCoMat = [];

    // Intra-Channel Co-occurrence Matrices (Diagonal Offset (1, 1))
    sixCoMat.push(intraChannelCooccurrence(redChannel));  // Red-Red
    sixCoMat.push(intraChannelCooccurrence(greenChannel)); // Green-Green
    sixCoMat.push(intraChannelCooccurrence(blueChannel)); // Blue-Blue

    // Inter-Channel Co-occurrence Matrices (Same Location Offset (0, 0))
    sixCoMat.push(interChannelCooccurrence(redChannel, greenChannel)); // Red-Green
    sixCoMat.push(interChannelCooccurrence(redChannel, blueChannel));  // Red-Blue
    sixCoMat.push(interChannelCooccurrence(greenChannel, blueChannel)); // Green-Blue

    return sixCoMat;
}

function splitChannels(frame) {
    const height = frame.length;
    const width = frame[0].length;

    const redChannel = Array.from({ length: height }, () => Array(width).fill(0));
    const greenChannel = Array.from({ length: height }, () => Array(width).fill(0));
    const blueChannel = Array.from({ length: height }, () => Array(width).fill(0));

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const [red, green, blue] = frame[i][j]; // RGB order
            redChannel[i][j] = red;
            greenChannel[i][j] = green;
            blueChannel[i][j] = blue;
        }
    }

    return [redChannel, greenChannel, blueChannel];
}




  useEffect(() => {
    const loadModel = async () => {
      try {
        // Load the TensorFlow Lite model
        const tfliteModel = await tflite.loadTFLiteModel("src/models/model.tflite");
        setModel(tfliteModel);
        console.log("TFLite model loaded successfully!");
      } catch (error) {
        console.error("Error loading the TFLite model:", error);
      }
    };

    const startWebcam = async () => {
        const video = videoRef.current;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
        }
    };

    loadModel();
    startWebcam();
  }, []);


  useEffect(() => {
    const video = videoRef.current;
    const runInference = async () => {
        if (!model) {
          console.error("Model not loaded yet!");
          return;
        }
        if(video.readyState == 4){
            // Example: Run inference (adjust input format as per your model)
            const feats = getSixCoMat(captureFrame(video));
            const features = [feats];
            const inputTensor = tf.tensor(features, [1, 6, 256, 256]); // Example input shape
            const outputTensor = model.predict(inputTensor);
        
            // Process the output
            const outputData = outputTensor.arraySync();
            if(outputData[0][0] > outputData[0][1]){
                setBackground("Virtual")
            } else {
                setBackground("Real")
            }
        
            // Clean up
            inputTensor.dispose();
            outputTensor.dispose();
        }
      };

      const intervalId = setInterval(runInference, 5000); // Run every 5 seconds

      return () => clearInterval(intervalId); // Cleanup on component unmount
}, [model])


  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <h4>Background: {background}</h4>
    </div>
  );
};

export default VirtualBackgroundDetection;

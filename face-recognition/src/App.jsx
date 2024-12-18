import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const FaceRecognition = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [userDescriptionLoaded, setUserDescriptionLoaded] = useState(false);
  const [isFaceMatched, setFaceMatched] = useState(null);
  const [userDescription, setUserDescription] = useState(null);
  const [multipleFace, setMultipleFace] = useState(false);
  // Load face-api model
  const loadModel = useCallback(async () => {
    const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

    try {
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      ]);
      console.log("All models loaded successfully");
      setModelLoaded(true);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  }, []);

  // User description and data loading (predefined face)
  const loadUserDescription = useCallback(async () => {
    if (!modelLoaded) return;

    const userImage = document.getElementById("user-image");
    if (userImage) {
      try {
        const detections = await faceapi
          .detectSingleFace(userImage, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detections) {
          const labeledDescriptor = new faceapi.LabeledFaceDescriptors("User", [
            detections.descriptor,
          ]);
          setUserDescription(labeledDescriptor);
          setUserDescriptionLoaded(true);
          console.log("User descriptor loaded");
        } else {
          console.log("No face detected in user image");
        }
      } catch (error) {
        console.error("Error detecting user face:", error);
      }
    } else {
      console.log("User image not found or is not a valid image element");
    }
  }, [modelLoaded]);

  // Recognize face in webcam feed
  const recognizeFace = useCallback(async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      modelLoaded &&
      userDescriptionLoaded &&
      userDescription
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set canvas size to match video
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Perform face detection
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const context = canvasRef.current.getContext("2d");
        if (context) {
          context.clearRect(0, 0, videoWidth, videoHeight);
          faceapi.draw.drawDetections(canvasRef.current, detections);
          //multiple faces
          if (detections.length > 1) {
            setMultipleFace(true);
          } else {
            setMultipleFace(false);
          }
          // Comparison
          if (detections.length > 0) {
            const matcher = new faceapi.FaceMatcher(userDescription, 0.6);
            const result = detections.map((detection) =>
              matcher.findBestMatch(detection.descriptor)
            );
            const match = result.some((result) => result.label === "User");
            setFaceMatched(match ? "Access Granted" : "Face not recognized");
          } else {
            setFaceMatched("No Face Detected");
          }
        }
      }
    }
  }, [modelLoaded, userDescriptionLoaded, userDescription]);

  // Load models and user description on component mount
  useEffect(() => {
    loadModel();
  }, [loadModel]);

  // Load user description after models are loaded
  useEffect(() => {
    if (modelLoaded) {
      loadUserDescription();
    }
  }, [modelLoaded, loadUserDescription]);

  // Continuously recognize face if model and user description are loaded
  useEffect(() => {
    if (modelLoaded && userDescriptionLoaded) {
      const interval = setInterval(() => {
        recognizeFace();
      }, 500); // Check every 500ms

      return () => clearInterval(interval);
    }
  }, [modelLoaded, userDescriptionLoaded, recognizeFace]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 ml-20px">Face Recognition</h1>
      <p className="text-xl mb-4">
        {!modelLoaded || !userDescriptionLoaded
          ? "Initializing..."
          : isFaceMatched === "Access Granted"
          ? "✅ Access Granted"
          : isFaceMatched === "Face not recognized"
          ? "❌ Face Not Recognized"
          : isFaceMatched}
      </p>
      {multipleFace && (
        <p className="text-xl mb-4 text-yellow-500 font-bold">
          ⚠️ Multiple people detected in front of the webcam
        </p>
      )}
      <img
        id="user-image"
        src="/image/photo1.jpeg"
        alt="User"
        className="hidden"
        style={{ display: "none" }}
      />
      <div className="relative inline-block">
        <Webcam
          ref={webcamRef}
          className="absolute top-0 left-0 w-full h-full z-10"
          style={{ width: 640, height: 480 }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full z-20"
          style={{ width: 640, height: 480, marginRight: "200px" }}
        />
      </div>
    </div>
  );
};

export default FaceRecognition;

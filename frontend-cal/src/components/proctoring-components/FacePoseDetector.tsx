import { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

interface KalmanFilters {
  xFilter: KalmanFilter;
  yFilter: KalmanFilter;
  zFilter: KalmanFilter;
}     

class KalmanFilter {
  x: number;  // State (position)
  v: number;  // Velocity
  a: number;  // Acceleration
  P: number;  // State uncertainty
  Q: number;  // Process noise
  R: number;  // Measurement noise
  y: any;

  constructor() {
    this.x = 0; // State (position)
    this.v = 0; // Velocity
    this.a = 0; // Acceleration
    this.P = 1; // State uncertainty
    this.Q = 0.01; // Process noise
    this.R = 0.1; // Measurement noise
  }

  predict() {
    // Predict next state
    this.x += this.v;
    this.P += this.Q; // Increase uncertainty
  }

  update(measurement: number | null): void {
    if (measurement == null) return; // Skip update if no measurement
    const K = this.P / (this.P + this.R); // Kalman gain
    this.x = this.x + K * (measurement - this.x); // Update position with measurement
    this.P = (1 - K) * this.P; // Update uncertainty
  }

  setVelocity(velocity: number): void {
    this.v = velocity;
  }
}

class YourComponent {
  kalmanFilters: { current: KalmanFilters[] };

  constructor() {
    this.kalmanFilters = { current: [] }; // Initialize as an empty array
  }
  updateFilters(landmarks: any[]) {
    // Initialize filters if current is empty
    if (this.kalmanFilters.current.length === 0) {
      this.kalmanFilters.current = landmarks.map(() => ({
        xFilter: new KalmanFilter(),
        yFilter: new KalmanFilter(),
        zFilter: new KalmanFilter(), // Add Z dimension filter
      }));
    }

    // Ensure filters are initialized dynamically if missing
    return landmarks.map((landmark, index) => {
      let { xFilter, yFilter, zFilter } = this.kalmanFilters.current[index];

      if (!xFilter || !yFilter || !zFilter) {
        this.kalmanFilters.current[index] = {
          xFilter: new KalmanFilter(),
          yFilter: new KalmanFilter(),
          zFilter: new KalmanFilter(),
        };
      }

      // Extract measurements with null check based on visibility
      const measurementX = landmark.visibility > 0.5 ? landmark.x : null;
      const measurementY = landmark.visibility > 0.5 ? landmark.y : null;
      const measurementZ = landmark.visibility > 0.5 ? landmark.z : null;

      // Kalman filter prediction step
      xFilter.predict();
      yFilter.predict();
      zFilter.predict();

      // Kalman filter update step with measurements
      xFilter.update(measurementX);
      yFilter.update(measurementY);
      zFilter.update(measurementZ);

      // Return smoothed coordinates, ensure visibility threshold
      return {
        x: xFilter.x, // Smoothed X-coordinate
        y: yFilter.y, // Smoothed Y-coordinate
        z: zFilter.x, // Smoothed Z-coordinate (clarified naming)
        visibility: landmark.visibility > 0.5 ? landmark.visibility : 0, // Filter visibility
      };
    });
  }
}

const FacePoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lookAwayCountRef = useRef(0);

  const yourComponent = new YourComponent(); // For Kalman Filter
  const [status, setStatus] = useState('User not detected');
  const [noseEyeDistance, setNoseEyeDistance] = useState(0);
  const [lookAwayCount, setLookAwayCount] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement?.getContext('2d');
    if (!canvasCtx) return;

    const centerBox = {
      x: 320 - 100, // Adjusted for smaller frame
      y: 180 - 100, // Adjusted for smaller frame
      width: 200,
      height: 200,
    };

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    if (!videoElement) return;
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 640, // Adjusted for smaller frame
      height: 360, // Adjusted for smaller frame
    });

    camera.start();

    if (canvasElement) {
      canvasElement.width = 640;
      canvasElement.height = 360;
    }

    pose.onResults((results) => {
      if (canvasElement) {
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      }
      if (canvasElement) {
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
      }

      // Draw the center box
      canvasCtx.lineWidth = 2;
      if (status === 'User is inside the frame') {
        canvasCtx.strokeStyle = 'green';
      } else {
        canvasCtx.strokeStyle = 'red';
      }
      canvasCtx.strokeRect(centerBox.x, centerBox.y, centerBox.width, centerBox.height);
        
      if (results.poseLandmarks) {
        const landmarks = results.poseLandmarks;
        const nose = results.poseLandmarks[0]; // Nose landmark
        const leftEye = results.poseLandmarks[2]; // Left eye
        const rightEye = results.poseLandmarks[5]; // Right eye

        if (canvasElement && 
          nose.x * canvasElement.width > centerBox.x &&
          nose.x * canvasElement.width < centerBox.x + centerBox.width &&
          nose.y * canvasElement.height > centerBox.y &&
          nose.y * canvasElement.height < centerBox.y + centerBox.height
        ) {
          setStatus('User is inside the frame');
        } else {
          setStatus('User is outside the frame');
        }

        const eyeDiff = Math.abs(leftEye.x - rightEye.x); // Difference in X positions of eyes
        const calculatedNoseEyeDistance = Math.abs(nose.x - (leftEye.x + rightEye.x) / 2); // Distance between nose and eyes

        setNoseEyeDistance(calculatedNoseEyeDistance);

        if (eyeDiff < 0.050 || calculatedNoseEyeDistance < 0.0010) {
          lookAwayCountRef.current++;
          setLookAwayCount(lookAwayCountRef.current);
          setStatus('Focus on the lecture!');
        }
      }
        else {
        setStatus('User not detected');
      }
    });

    return () => {
      camera.stop();
      pose.close();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Video and Canvas Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '320px', // Small size for sidebar
          aspectRatio: '16 / 9',
          margin: '0 auto',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>

      {/* Text Output Section */}
      <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '14px' }}>
        <h4>Status: {status}</h4>
        <p>Look Away Count: {lookAwayCount} ms</p>
      </div>
    </div>
  );
};

export default FacePoseDetection;

import React, { useRef, useEffect, useState, createContext, useContext } from 'react';

interface WebcamProviderProps {
    children: ReactNode;
  }

// Define a context for sharing the webcam feed
const WebcamContext = createContext<MediaStream | null>(null);

// WebcamProvider Component
export const WebcamProvider: React.FC<WebcamProviderProps> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Access the webcam feed
    const getWebcamFeed = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    getWebcamFeed();

    return () => {
        // Cleanup: Stop all tracks in the MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
  }, [stream]);

  return <WebcamContext.Provider value={stream}>{children}</WebcamContext.Provider>;
};

// Hook to access the webcam feed from other components
export const useWebcam = (): MediaStream | null => {
  return useContext(WebcamContext);
};

// WebcamDisplay Component to display the webcam feed
export const WebcamDisplay: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useWebcam();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />;
};

// Example of usage
// App Component
// const App: React.FC = () => {
//   return (
//     <WebcamProvider>
//       <div>
//         <h1>Webcam Feed</h1>
//         <WebcamDisplay />
//       </div>
//     </WebcamProvider>
//   );
// };

// export default App;

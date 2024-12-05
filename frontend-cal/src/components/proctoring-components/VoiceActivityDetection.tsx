import React, { useEffect, useState } from "react";
import audio from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0";

const { AudioClassifier, FilesetResolver } = audio;

const VoiceActivityDetection: React.FC = () => {
  const [audioClassifier, setAudioClassifier] = useState<AudioClassifier | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    const createAudioClassifier = async () => {
      try {
        const resolver = await FilesetResolver.forAudioTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm"
        );

        const classifier = await AudioClassifier.createFromOptions(resolver, {
          baseOptions: {
            modelAssetPath: "src/models/yamnet.tflite",
          },
        });

        setAudioClassifier(classifier);

        // Start streaming classification automatically
        handleStreamClassification(classifier);
      } catch (error) {
        console.error("Error initializing AudioClassifier:", error);
      }
    };

    createAudioClassifier();
  }, []);

  const getOrCreateAudioContext = () => {
    if (!audioCtx) {
      const newAudioCtx = new AudioContext();
      setAudioCtx(newAudioCtx);
      return newAudioCtx;
    }
    return audioCtx;
  };

  const handleStreamClassification = async (classifier: AudioClassifier) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("getUserMedia is not supported on your browser.");
      return;
    }

    try {
      const localAudioCtx = getOrCreateAudioContext();

      // Ensure the AudioContext is running
      if (localAudioCtx.state === "suspended") {
        await localAudioCtx.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = localAudioCtx.createMediaStreamSource(stream);
      const scriptNode = localAudioCtx.createScriptProcessor(16384, 1, 1);

      scriptNode.onaudioprocess = (event) => {
        try {
          const inputData = event.inputBuffer.getChannelData(0);
          if (classifier) {
            const results = classifier.classify(inputData);

            if (results?.length > 0) {
              const categories = results[0]?.classifications[0]?.categories;

              if (categories && categories[0]?.categoryName === "Speech" && parseFloat(categories[0]?.score.toFixed(3)) > 0.5) {
                console.log("Speaking detected:", categories[0]?.score.toFixed(3));
              }
            } else {
              console.warn("No classifications found in results.");
            }
          } else {
            console.warn("AudioClassifier is null or undefined.");
          }
        } catch (error) {
          console.error("Error during classification:", error);
        }
      };

      source.connect(scriptNode);
      scriptNode.connect(localAudioCtx.destination);
    } catch (error) {
      console.error("Error accessing microphone or processing audio:", error);
    }
  };

  return (
    <div>
      <h1>Voice Activity Detection</h1>
      <p>Listening for voice activity...</p>
    </div>
  );
};

export default VoiceActivityDetection;

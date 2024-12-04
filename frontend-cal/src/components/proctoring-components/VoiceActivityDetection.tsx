import React, { useEffect, useRef, useState } from "react";
import audio from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0";
import { Alert } from 'react-alert'

const { AudioClassifier, FilesetResolver } = audio;

const VoiceActivityDetection: React.FC = () => {
  const [audioClassifier, setAudioClassifier] = useState<AudioClassifier | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const outputRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const createAudioClassifier = async () => {
      const resolver = await FilesetResolver.forAudioTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm"
      );

      const classifier = await AudioClassifier.createFromOptions(resolver, {
        baseOptions: {
          modelAssetPath:
            "src/models/yamnet.tflite",
        },
      });

      setAudioClassifier(classifier);
    };

    createAudioClassifier();
  }, []);

  const getOrCreateAudioContext = () => {
    let localAudioCtx = audioCtx;
    if (!localAudioCtx) {
      localAudioCtx = new AudioContext();
      setAudioCtx(localAudioCtx);
    }
    return localAudioCtx;
  };
  

  const handleStreamClassification = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("getUserMedia not supported on your browser.");
      return;
    }
  
    const localAudioCtx = getOrCreateAudioContext(); // Use the utility function
  
    if (localAudioCtx.state === "running") {
      await localAudioCtx.suspend();
      setIsPlaying(false);
      return;
    }
  
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
    await localAudioCtx.resume();
    setIsPlaying(true);
  
    const source = localAudioCtx.createMediaStreamSource(stream);
    const scriptNode = localAudioCtx.createScriptProcessor(16384, 1, 1);
  
    scriptNode.onaudioprocess = (event) => {
      let speechCount = 0;
      const inputData = event.inputBuffer.getChannelData(0);
      const results = audioClassifier?.classify(inputData) ?? [];
      const categories = results[0].classifications[0].categories;
      
      if(categories[0].categoryName == "Speech" && categories[0].score.toFixed(3) > 0.5){
        console.log("Speaking");
        console.log(categories[0].score.toFixed(3));
      }
    };
  
    source.connect(scriptNode);
    scriptNode.connect(localAudioCtx.destination);
  };
  

  return (
    <div>
      <button onClick={handleStreamClassification}>
        {isPlaying ? "Stop Streaming" : "Start Streaming"}
      </button>
    </div>
  );
};

export default VoiceActivityDetection;

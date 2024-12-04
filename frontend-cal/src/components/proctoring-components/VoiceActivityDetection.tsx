// Copyright 2023 The MediaPipe Authors.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useEffect, useRef, useState } from "react";
import audio from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0";
import { Alert } from 'react-alert'

const { AudioClassifier, AudioClassifierResult, FilesetResolver } = audio;

const AudioClassifierDemo: React.FC = () => {
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
            "https://storage.googleapis.com/mediapipe-models/audio_classifier/yamnet/float32/1/yamnet.tflite",
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
  

  const runAudioClassification = async (demoId: string, resultId: string) => {
    if (!audioClassifier) {
      alert("Audio Classifier still loading. Please try again.");
      return;
    }

    const audioClip = document.getElementById(demoId) as HTMLAudioElement;
    const output = document.getElementById(resultId) as HTMLTableElement;

    let localAudioCtx = audioCtx;
    if (!localAudioCtx) {
      localAudioCtx = new AudioContext();
      setAudioCtx(localAudioCtx); // Update state to ensure it's tracked
    }

    if (audioClip.paused) {
      const response = await fetch(audioClip.src);
      const sample = await response.arrayBuffer();
      const decodedAudio = await localAudioCtx.decodeAudioData(sample);
      const results = audioClassifier.classify(
        decodedAudio.getChannelData(0),
        decodedAudio.sampleRate
      );
  
      displayClassificationResults(results, output);
      audioClip.play();
    } else {
      audioClip.pause();
    }
  };

  const displayClassificationResults = (results: AudioClassifierResult[], output: HTMLTableElement) => {
    if (outputRef.current) {
      removeAllChildNodes(outputRef.current);
    }

    const tableHeader = (
      <tr>
        <th>Timestamp in MS</th>
        <th>Category</th>
        <th>Confidence</th>
      </tr>
    );

    const rows = results.map((result) => {
      const { classifications, timestampMs } = result;
      const topCategory = classifications[0].categories[0].categoryName;
      const topScore = classifications[0].categories[0].score.toFixed(3);

      return (
        <tr key={timestampMs}>
          <td style={{ textAlign: "right" }}>{timestampMs}</td>
          <td>{topCategory}</td>
          <td>{topScore}</td>
        </tr>
      );
    });

    output.innerHTML = "";
    outputRef.current?.appendChild(tableHeader as unknown as Node);
    rows.forEach((row) => outputRef.current?.appendChild(row as unknown as Node));
  };

  const removeAllChildNodes = (parent: HTMLElement) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
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
      <h1>Audio Classification Demo</h1>
      <button onClick={() => runAudioClassification("audioClip1", "audioResult1")}>
        Classify Audio 1
      </button>
      <button onClick={() => runAudioClassification("audioClip2", "audioResult2")}>
        Classify Audio 2
      </button>
      <button onClick={handleStreamClassification}>
        {isPlaying ? "Stop Streaming" : "Start Streaming"}
      </button>
      <audio id="audioClip1" src="path_to_audio1.mp3" />
      <audio id="audioClip2" src="path_to_audio2.mp3" />
      <table ref={outputRef} id="audioResult1"></table>
      <table ref={outputRef} id="audioResult2"></table>
    </div>
  );
};

export default AudioClassifierDemo;

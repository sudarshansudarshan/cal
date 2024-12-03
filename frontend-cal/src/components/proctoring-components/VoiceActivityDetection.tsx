import React, { useState, useEffect } from "react";
import {useMicVAD} from "@ricky0123/vad-react";

const VoiceActivityDetection = () => {
  const [isSpeech, setIsSpeech] = useState(0);

  useMicVAD({
    startOnLoad: true,
    onFrameProcessed: (prob) => {
      setIsSpeech(prob.isSpeech);
      },
  })

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Talking Detection</h1>
      <p>Is speech: { (isSpeech * 100).toFixed(0) }</p>
    </div>
  );
};

export default VoiceActivityDetection;

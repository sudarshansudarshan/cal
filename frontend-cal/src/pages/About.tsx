import React, { useState, useEffect } from "react";

const VerticalScrollFrames = () => {
  const [data] = useState([
    {
      video: "1z-E_KOC2L0",
      timestamps: {
        5: [
          {
            question_id: 1,
            question: "What is the capital of France?",
            options: ["Paris", "London", "Berlin"],
            correctAnswer: "Paris",
          },
          {
            question_id: 2,
            question: "What is 2 + 2?",
            options: ["3", "4", "5"],
            correctAnswer: "4",
          },
        ],
        10: [
          {
            question_id: 3,
            question: "What is the capital of India?",
            options: ["Paris", "London", "Berlin"],
            correctAnswer: "Berlin",
          },
          {
            question_id: 4,
            question: "What is 2 + 3?",
            options: ["3", "4", "5"],
            correctAnswer: "5",
          },
        ],
        15: [
          {
            question_id: 5,
            question: "What is the capital of France?",
            options: ["Paris", "London", "Berlin"],
            correctAnswer: "Paris",
          },
          {
            question_id: 6,
            question: "What is 2 + 2?",
            options: ["3", "4", "5"],
            correctAnswer: "4",
          },
        ],
      },
    },
  ]);

  const frames = data
    .flatMap((frameData, frameIndex) => {
      const videoUrl = `https://www.youtube.com/embed/${frameData.video}`;
      return Object.keys(frameData.timestamps).map((timeKey, partIndex) => [
        <div
          key={`video-${frameIndex}-${partIndex}`}
          className="h-screen bg-blue-500 text-white flex justify-center items-center"
        >
          <iframe
            width="800"
            height="450"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>,
        <div
          key={`assessment-${frameIndex}-${partIndex}`}
          className="h-screen bg-cyan-500 text-white flex flex-col justify-center items-center p-4"
        >
          <h2 className="mb-4">Questions at {timeKey} seconds</h2>
          {frameData.timestamps[timeKey].map((question) => (
            <div key={question.question_id} className="mb-4">
              <h3>{question.question}</h3>
              <ul>
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>,
      ]);
    })
    .flat();

  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentPart, setCurrentPart] = useState(0);

  useEffect(() => {
    setCurrentPart(0);
  }, [currentFrame]);

  const handleFrameScrollUp = () => {
    setCurrentFrame((prevFrame) =>
      prevFrame > 0 ? prevFrame - 1 : frames.length / 2 - 1
    );
  };

  const handleFrameScrollDown = () => {
    setCurrentFrame((prevFrame) =>
      prevFrame < frames.length / 2 - 1 ? prevFrame + 1 : 0
    );
  };

  const handlePartScrollUp = () => {
    setCurrentPart((prevPart) => (prevPart > 0 ? prevPart - 1 : 1));
  };

  const handlePartScrollDown = () => {
    setCurrentPart((prevPart) => (prevPart < 1 ? prevPart + 1 : 0));
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 80% VerticalScrollFrames Section */}
      <div className="w-full h-[80%] overflow-hidden relative">
        <div
          className="w-full h-full flex flex-col transition-transform duration-300"
          style={{ transform: `translateY(-${currentFrame * 160}vh)` }}
        >
          {frames.map((part, index) => (
            <div
              key={index}
              className="w-full h-full flex flex-col transition-transform duration-300"
              style={{ transform: `translateY(-${currentPart * 80}vh)` }}
            >
              {part}
            </div>
          ))}
        </div>

        {/* External Scroll Buttons */}
        <button
          onClick={handleFrameScrollUp}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          ↑ Frame
        </button>
        <button
          onClick={handleFrameScrollDown}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          ↓ Frame
        </button>

        {/* Internal Scroll Buttons */}
        <button
          onClick={handlePartScrollUp}
          className="absolute top-1/4 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          ↑ Part
        </button>
        <button
          onClick={handlePartScrollDown}
          className="absolute top-3/4 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          ↓ Part
        </button>
      </div>

      {/* 20% Additional Section */}
      <div className="w-full h-[20%] bg-gray-200 flex items-center justify-center">
        <h2 className="text-black text-xl">Additional Section</h2>
      </div>
    </div>
  );
};

export default VerticalScrollFrames;

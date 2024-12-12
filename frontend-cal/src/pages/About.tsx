import React, { useState, useEffect } from 'react';

const VerticalScrollFrames = () => {
  // Array of frames with internal parts (frame has multiple parts)
  const frames = [
    [
      <div className="h-screen bg-blue-500 text-white flex justify-center items-center">Part 1 of Frame 1</div>,
      <div className="h-screen bg-cyan-500 text-white flex justify-center items-center">Part 2 of Frame 1</div>
    ],
    [
      <div className="h-screen bg-green-500 text-white flex justify-center items-center">Part 1 of Frame 2</div>,
      <div className="h-screen bg-lime-500 text-white flex justify-center items-center">Part 2 of Frame 2</div>
    ],
    [
      <div className="h-screen bg-red-500 text-white flex justify-center items-center">Part 1 of Frame 3</div>,
      <div className="h-screen bg-pink-500 text-white flex justify-center items-center">Part 2 of Frame 3</div>
    ],
    // Add more frames as needed
  ];

  // State to manage the current frame and part
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentPart, setCurrentPart] = useState(0);

  // Reset currentPart to 0 whenever currentFrame changes
  useEffect(() => {
    setCurrentPart(0);
  }, [currentFrame]);

  // Scroll to the previous frame
  const handleFrameScrollUp = () => {
    setCurrentFrame((prevFrame) => {
      const newFrame = prevFrame > 0 ? prevFrame - 1 : frames.length - 1;
      return newFrame;
    });
  };

  // Scroll to the next frame
  const handleFrameScrollDown = () => {
    setCurrentFrame((prevFrame) => {
      const newFrame = prevFrame < frames.length - 1 ? prevFrame + 1 : 0;
      return newFrame;
    });
  };

  // Scroll to the previous part of the current frame
  const handlePartScrollUp = () => {
    setCurrentPart((prevPart) => (prevPart > 0 ? prevPart - 1 : frames[currentFrame].length - 1));
  };

  // Scroll to the next part of the current frame
  const handlePartScrollDown = () => {
    setCurrentPart((prevPart) => (prevPart < frames[currentFrame].length - 1 ? prevPart + 1 : 0));
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* External scrolling container */}
      <div
        className="w-full h-full flex flex-col transition-transform duration-300"
        style={{ transform: `translateY(-${currentFrame * 100}%)` }}
      >
        {/* Internal part scrolling within the current frame */}
        <div
          className="w-full h-full flex flex-col transition-transform duration-300"
          style={{ transform: `translateY(-${currentPart * 100}%)` }}
        >
          {frames[currentFrame].map((part, currentPartIndex) => (
            <div key={currentPartIndex} className="w-full h-full">
              <h1>{currentPartIndex}</h1>
              {part}
            </div>
          ))}
        </div>
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
  );
};

export default VerticalScrollFrames;

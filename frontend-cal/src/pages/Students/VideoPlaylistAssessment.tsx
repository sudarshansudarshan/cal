import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import React, { useState } from 'react'

const VideoPlaylistAssessment = () => {
  const [data] = useState([
    {
      sections: [
        {
          section: 'section1',
          video: '1z-E_KOC2L0',
          questions: [
            {
              question_id: 1,
              question: 'What is the capital of France?',
              options: ['Paris', 'London', 'Berlin'],
              correctAnswer: 'Paris',
            },
            {
              question_id: 2,
              question: 'What is 2 + 2?',
              options: ['3', '4', '5'],
              correctAnswer: '4',
            },
          ],
        },
        {
          section: 'section2',
          video: 'dQw4w9WgXcQ', // Changed video ID
          questions: [
            {
              question_id: 3,
              question: 'What is the capital of India?',
              options: ['New Delhi', 'Mumbai', 'Kolkata'],
              correctAnswer: 'New Delhi',
            },
            {
              question_id: 4,
              question: 'What is 3 + 3?',
              options: ['5', '6', '7'],
              correctAnswer: '6',
            },
          ],
        },
      ],
    },
  ])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [currentPart, setCurrentPart] = useState(0)

  const frames = data
    .flatMap((frameData, frameIndex) => {
      return frameData.sections.map((sectiond, partIndex) => [
        <div
          key={`video-${frameIndex}-${partIndex}`}
          className='flex h-screen items-center justify-center bg-blue-500 text-white'
        >
          <iframe
            id={`player-${partIndex}`}
            title={`YouTube video player ${partIndex}`}
            width='100%'
            height='100%'
            src={`https://www.youtube.com/embed/${sectiond.video}?enablejsapi=1&rel=0&controls=0&modestbranding=1&showinfo=0&fs=1&iv_load_policy=3&cc_load_policy=1&autohide=1`}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        </div>,
        <div
          key={`assessment-${frameIndex}-${partIndex}`}
          className='flex h-screen flex-col items-center justify-center bg-gray-100 p-4 text-gray-800'
        >
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>Questions</h2>
          {sectiond.questions.map((question) => (
            <div
              key={`question-${question.question_id}`}
              className='mb-4 w-full max-w-md rounded-lg bg-white p-5 shadow-lg'
            >
              <h3 className='mb-4 text-2xl font-semibold text-gray-800'>
                {question.question}
              </h3>
              <ul className='space-y-4'>
                {question.options.map((option: string, index: number) => (
                  <li key={index} className='flex items-center'>
                    <input
                      type='radio'
                      id={`question-${question.question_id}-option-${index}`}
                      name={`question-${question.question_id}`}
                      value={option}
                      className='mr-3 size-5'
                    />
                    <label
                      htmlFor={`question-${question.question_id}-option-${index}`}
                      className='text-lg text-gray-700'
                    >
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>,
      ])
    })
    .flat()

  const handleFrameScrollDown = () => {
    setCurrentFrame((prevFrame) => {
      if (prevFrame < frames.length / 2 - 1) {
        return prevFrame + 1
      } else {
        return 0 // Loop back to the first frame
      }
    })
    setCurrentPart(0) // Reset currentPart to 0
  }

  const handlePartScrollDown = () => {
    setCurrentPart((prevPart) => (prevPart < 1 ? prevPart + 1 : 0))
  }

  return (
    <ResizablePanelGroup direction='vertical' className='bg-gray-200 p-2'>
      <ResizablePanel defaultSize={95}>
        <div className='flex h-screen flex-col'>
          {/* 80% VerticalScrollFrames Section */}
          <div className='relative size-full overflow-hidden'>
            <div
              className='flex size-full flex-col transition-transform duration-300'
              style={{ transform: `translateY(-${currentFrame * 200}%)` }}
            >
              {frames.map((part, index) => (
                <div
                  key={index}
                  className='flex size-full flex-col transition-transform duration-300'
                  style={{ transform: `translateY(-${currentPart * 100}%)` }}
                >
                  {part}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleFrameScrollDown}
            className='absolute bottom-4 right-4 rounded bg-blue-500 px-4 py-2 text-white'
          >
            Scroll Down
          </button>
          <button
            onClick={handlePartScrollDown}
            className='absolute bottom-4 left-4 rounded bg-green-500 px-4 py-2 text-white'
          >
            Scroll Down
          </button>
        </div>
      </ResizablePanel>
      <ResizableHandle className='p-1' />
      <ResizablePanel defaultSize={5} className=''>
        Hello
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default VideoPlaylistAssessment

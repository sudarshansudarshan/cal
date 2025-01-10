import React, { useEffect, useRef, useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useSidebar } from '@/components/ui/sidebar'
import { content } from '../DummyDatas/VideoData'

const VideoMain = () => {
  const { setOpen } = useSidebar() // Access setOpen to control the sidebar state
  const hasSetOpen = useRef(false) // Ref to track if setOpen has been called

  useEffect(() => {
    if (!hasSetOpen.current) {
      setOpen(false) // Set the sidebar to closed by default
      hasSetOpen.current = true // Mark as called
    }
  }, [setOpen])

  const data = content

  const [currentFrame, setCurrentFrame] = useState(0)

  const handleNextFrame = () => {
    setCurrentFrame((prevFrame) => (prevFrame + 1) % data.length)
  }

  const handlePrevFrame = () => {
    setCurrentFrame((prevFrame) => (prevFrame - 1 + data.length) % data.length)
  }

  const renderdataByType = (frame, index) => {
    switch (frame.type) {
      case 'Video':
        return (
          <iframe
            id={`player-${index}`}
            title={frame.title}
            src={`https://www.youtube.com/embed/${frame.src}?enablejsapi=1&rel=0&controls=0&modestbranding=1&showinfo=0&fs=1&iv_load_policy=3&cc_load_policy=1&autohide=1`}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='size-full'
          ></iframe>
        )
      case 'Article':
        return <ScrollArea>{frame.content}</ScrollArea>
      case 'Assessment':
        return <p>{`Assessment details for ${frame.course}`}</p>
      default:
        return <p>No specific type assigned</p>
    }
  }

  return (
    <ResizablePanelGroup direction='vertical' className='bg-gray-200 p-2'>
      <ResizablePanel defaultSize={95}>
        <div className='flex h-full flex-col'>
          {/* Frame Display Section */}
          <div className='relative h-full overflow-hidden'>
            <div
              className='absolute size-full transition-transform duration-300'
              style={{ transform: `translateY(-${currentFrame * 100}%)` }}
            >
              {data.map((frame, index) => (
                <div
                  key={index}
                  className='flex size-full h-full flex-col items-center justify-center'
                >
                  {renderdataByType(frame, index)}
                </div>
              ))}
            </div>
          </div>
          {/* Scroll Buttons */}
          <div className='mt-4 flex justify-between'>
            <button
              onClick={handlePrevFrame}
              className='rounded bg-gray-300 p-2'
            >
              Previous
            </button>
            <button
              onClick={handleNextFrame}
              className='rounded bg-gray-300 p-2'
            >
              Next
            </button>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle className='p-1' />
      <ResizablePanel defaultSize={5} className=''></ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default VideoMain

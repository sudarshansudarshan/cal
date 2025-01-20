import React, { useEffect, useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useSidebar } from '@/components/ui/sidebar'
import { useLocation } from 'react-router-dom' 
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Cookie, Fullscreen, Pause, Play } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

//This the dummy Data used for testing the questions funtionality it provides all the questions according to the exact format
import { questions } from '../DummyDatas/Questions'


import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// These are the proctoring components comming form proctoring components folder which ensures the keyboard is disabled for this page as well as right rightclick is also disabled
import KeyboardLock from '@/components/proctoring-components/KeyboardLock'
import RightClickDisabler from '@/components/proctoring-components/RightClickDisable'


//These are the imports comming from redux using RTK for fetching and posting the data to the backend
import {
  useFetchItemsWithAuthQuery,
  useFetchSolutionWithAuthQuery,
  useStartAssessmentMutation,
  useSubmitAssessmentMutation,
  useUpdateSectionItemProgressMutation,
} from '@/store/apiService'
import { useFetchQuestionsWithAuthQuery } from '@/store/apiService'


import Cookies from 'js-cookie'

const VideoMain = () => {
  const location = useLocation() 
  const [responseData, setResponseData] = useState(null)


// This is the data which is stored in the local State when the user goes from one page to another using routing
  const assignment = location.state?.assignment 
  const sectionId = location.state?.sectionId 
  const courseId = location.state?.courseId 
  const moduleId = location.state?.moduleId 

  // This ensures that the sidebar is open or not
  const { setOpen } = useSidebar()

  const [currentFrame, setCurrentFrame] = useState(assignment.sequence - 1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [volume, setVolume] = useState(50) 
  const [playbackSpeed, setPlaybackSpeed] = useState(1) 
  const [assessmentId, setAssessmentId] = useState(1)
  const [startAssessment] = useStartAssessmentMutation()
  const [submitAssessment] = useSubmitAssessmentMutation()
  const [gradingData, setGradingData] = useState(null)

  //Responsible for fetching Items using RTK Query
  const {
    data: assignmentsData
  } = useFetchItemsWithAuthQuery(sectionId)
  const content = assignmentsData || []


  //Responsible for fetching the questions using RTK Query
  const { data: assessmentData } = useFetchQuestionsWithAuthQuery(assessmentId)
  const AssessmentData = assessmentData?.results

  // UseEffect to create player for each frame and to close the sidebar
  useEffect(() => {
    setOpen(false)
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    tag.onload = () => {
      // When the frame changes there is a sepeerate player for each frame with dynamic playerId and changes according to the current frame
      window.player = new window.YT.Player(`player-${currentFrame}`, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })
    }

    return () => {
      if (window.player) {
        window.player.destroy()
        window.player = null
      }
    }
  }, [currentFrame, setOpen])

  //Funtion to fetch the assessment prior to a frame
  const fetchAssessment = (currentFrame) => {
    console.log(content[currentFrame].item_type)
    // Only Fetches the assessment when the next frame is assessment
    if (content[currentFrame + 1].item_type === 'assessment') {
      setAssessmentId(content[currentFrame + 1].id)
      startAssessment({
        courseInstanceId: courseId,
        assessmentId: assessmentId.toString(),
      })
        .then((response) => {
          console.log('Response:', response.data.attemptId)
          if (response.data && response.data.attemptId) {
            setResponseData(response.data.attemptId)
            toast('Assessment started successfully!', { type: 'success' })
          } else {
            throw new Error('No attemptId received')
          }
        })
        .catch((error) => {
          console.error('Failed to start assessment:', error)
          toast('Failed to start assessment. Please try again.', {
            type: 'error',
          })
        })
    }
  }
  console.log('Response Data:', responseData)

  // When player Get ready this fucntion is called to make things happen in player
  const onPlayerReady = (event) => {
    setTotalDuration(event.target.getDuration())
    event.target.setVolume(volume)
    if (content[currentFrame + 1].item_type === 'video') {
      setCurrentTime(content[currentFrame].start_time)
      event.target.seekTo(content[currentFrame].start_time, true)
      console.log('Current Time:', content[currentFrame].start_time)
      setTotalDuration(content[currentFrame].end_time)
      console.log('Total Duration:', content[currentFrame].end_time)
    }
  }

  // This funtion is used to change the current time using slider of youtube video progress bar 
  const handleTimeChange = (value) => {
    setCurrentTime(value[0])
    window.player.seekTo(value[0], true)
  }

  // Funtion responsible in changing the volume of the video
  const handleVolumeChange = (value) => {
    setVolume(value[0])
    window.player.setVolume(value[0])
  }

  // Whenever the state of video changed like pause , play , ended this funtion is called
  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true)
      console.log('Playing', isPlaying)
    } else if (event.data === window.YT.PlayerState.ENDED) {
      handleNextFrame()
    } else {
      setIsPlaying(false)
      console.log('Not Playing', isPlaying)
    }
  }

  // This funtion is responsible in for working of play/pause toggle button
  const togglePlayPause = () => {
    console.log('lelelelel', window.player)
    if (!window.player) return
    if (isPlaying) {
      window.player.pauseVideo()
    } else {
      window.player.playVideo()
    }
  }

  // This funtion is to go forward to the next frame
  const handleNextFrame = async () => {
    setCurrentFrame((prevFrame) => (prevFrame + 1) % content.length)
    setSelectedOption(null)
    setSelectedOption(null)
    setCurrentQuestionIndex(0)
    setCurrentTime(0)
    setIsPlaying(false)
    fetchAssessment(currentFrame)
  }

  // This funtion is to move to the next question
  const handleNextQuestion = () => {
    if (selectedOption === null) return 

    setSelectedAnswer(selectedOption)
    console.log('Selected Answer:', selectedAnswer)
    const question = questions[0].results[currentQuestionIndex]
    const isCorrect = selectedOption === question.answer
    setIsAnswerCorrect(isCorrect)

    if (!isCorrect) {
      toast('Incorrect Answer! Please try again.', { type: 'error' })
      handlePrevFrame() 
    } else {
      setSelectedOption(null)
      setCurrentQuestionIndex(
        (prevIndex) => (prevIndex + 1) % AssessmentData.length
      )
    }
  }

  // This funtion called when user submits the assessment
  const handleSubmit = () => {
    setSelectedAnswer(selectedOption)
    const question = AssessmentData[currentQuestionIndex]

    submitAssessment({
      courseInstanceId: courseId,
      assessmentId: assessmentId.toString(),
      attemptId: responseData, 
      answers: {
        natAnswers: [],
        mcqAnswers: [
          {
            questionId: question.id.toString(),
            choiceId: selectedOption.toString(),
          },
        ], 
        msqAnswers: [], 
        descriptiveAnswers: [], 
      },
    })
      .then((response) => {
        if (response.data) {
          Cookies.set('gradingData', response.data.assessmentGradingStatus)
          setGradingData(response.data.assessmentGradingStatus) 
          toast('Assessment started successfully!', { type: 'success' })
        }
      })
      .catch((error) => {
        console.error('Failed to start assessment:', error)
        toast('Failed to start assessment. Please try again.', {
          type: 'error',
        })
      })

    if (Cookies.get('gradingData') === 'PASSED') {
      toast('Assessment Complete!', { type: 'success' })
      handleNextFrame() 
    } else if (Cookies.get('gradingData') === 'FAILED') {
      toast('Incorrect Answer! Please try again.', { type: 'error' })
      handlePrevFrame()
    }

  }

  // This funtion is responsible to set the selected option after click on any option of question by user
  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId) 
  }

  // This funtion is responsible to go backward to the previous question
  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(
      (prevIndex) =>
        (prevIndex - 1 + AssessmentData.length) % AssessmentData.length
    )
  }

  // This funtion is responsible to go backward to the last frame
  const handlePrevFrame = () => {
    const nextFrameIndex = (currentFrame - 1 + content.length) % content.length
    localStorage.setItem('nextFrame', nextFrameIndex)

    window.location.reload()
  }

  // This funtion is for changing the speed of Video
  const changePlaybackSpeed = (speed) => {
    window.player.setPlaybackRate(speed)
    setPlaybackSpeed(speed)
  }

  // This funtion is to chnage the player to full screen mode
  const toggleFullscreen = () => {
    const player = document.getElementById(`player-${currentFrame}`)
    if (!document.fullscreenElement) {
      if (player.requestFullscreen) {
        player.requestFullscreen()
      } else if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen()
      } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen()
      } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }

  // This useeffect ensures that whenever the page reloads the currentframe should not be change
  useEffect(() => {
    const savedFrame = localStorage.getItem('nextFrame')
    if (savedFrame !== null) {
      setCurrentFrame(parseInt(savedFrame)) 
      localStorage.removeItem('nextFrame') 
    }
  }, [])

  // This funtion create the interface of assessment that exactly how the assessment will look like
  const renderAssessment = (question) => {
    if (!AssessmentData || AssessmentData.length === 0) {
      return <div>No assessment data available.</div>
    }

    if (
      currentQuestionIndex < 0 ||
      currentQuestionIndex >= AssessmentData.length
    ) {
      return <div>Invalid question index.</div>
    }
    const isLastQuestion = currentQuestionIndex === AssessmentData.length - 1

    return (
      <div className='flex h-screen w-full flex-col justify-center bg-gray-50 p-8 text-gray-800 shadow-lg'>
        <h3 className='mb-6 w-full text-3xl font-bold text-gray-900'>
          {question.text}
        </h3>
        <ul className='mb-4'>
          {question.options.map((option) => (
            <li key={option.id} className='mb-2'>
              <button
                onClick={() => handleOptionClick(option.id)}
                className={`w-full rounded-lg border border-gray-300 px-4 py-2 text-left ${
                  selectedOption === option.id
                    ? 'bg-green-500 text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {option.option_text}
              </button>
            </li>
          ))}
        </ul>
        <small className='mb-6 text-gray-600'>{question.hint}</small>
        <div className='space-x-4'>
          <button
            onClick={() =>
              setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0))
            }
            disabled={currentQuestionIndex === 0}
            className='rounded-lg bg-blue-500 px-6 py-2 text-white shadow disabled:bg-gray-300'
          >
            Previous
          </button>
          {isLastQuestion ? (
            <button
              onClick={handleSubmit} 
              disabled={!selectedOption} 
              className='rounded-lg bg-green-500 px-6 py-2 text-white shadow'
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption} 
              className='rounded-lg bg-green-500 px-6 py-2 text-white shadow'
            >
              Next
            </button>
          )}
        </div>
      </div>
    )
  }

  // As we are getting url from the backend and need VideoId for the player so this funtion convert the url to videoId
  const getYouTubeVideoId = (url) => {
    console.log('URL:', url)
    try {
      const parsedUrl = new URL(url)
      console.log('Parsed URL:', parsedUrl)
      let videoId
      if (parsedUrl.hostname === 'youtu.be') {
        videoId = parsedUrl.pathname.slice(1)
      } else {
        videoId = parsedUrl.searchParams.get('v')
      }

      if (!videoId) {
        console.error('Invalid YouTube URL:', url)
        return null
      }
      return videoId
    } catch (error) {
      console.error('Error parsing URL:', url, error)
      return null
    }
  }

  // This funtion is used for switch case according to the data that whenever the data type is video , assessment or article it will display the frame according to the type
  const renderdataByType = (frame, index) => {
    const videoId = getYouTubeVideoId(frame.source)

    switch (frame.item_type) {
      case 'video':
        return (
          <iframe
            key={`player-${index}`}
            id={`player-${index}`}
            title={frame.title}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&controls=0&modestbranding=1&showinfo=0&fs=1&iv_load_policy=3&cc_load_policy=1&autohide=1`}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='size-full'
          ></iframe>
        )
      case 'article':
        return (
          <div>
            <ScrollArea>{frame.content}</ScrollArea>
            <div className='mt-4 flex justify-end'>
              <Button onClick={handleNextFrame}>Next Part</Button>
            </div>
          </div>
        )
      case 'assessment':
        if (AssessmentData && AssessmentData.length > 0) {
          return renderAssessment(AssessmentData[currentQuestionIndex])
        } else {
          return <div>No assessment data available.</div>
        }

      default:
        return <p>No specific type assigned</p>
    }
  }

  return (
    //These are the resizable panels with can be resized by dragging the resizable handle
    <ResizablePanelGroup direction='vertical' className='bg-gray-200 p-2'>
      <KeyboardLock />
      <RightClickDisabler />
      <ResizablePanel defaultSize={90}>
        <div className='flex h-full flex-col'>
          <div className='relative h-full overflow-hidden'>
            <div
              className='absolute size-full transition-transform duration-300'
              style={{ transform: `translateY(-${currentFrame * 100}%)` }}
            >
              {content.map((frame, index) => (
                <div
                  key={index}
                  className='flex size-full h-full flex-col items-center justify-center'
                >
                  {renderdataByType(frame, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle className='p-1' />
      <ResizablePanel defaultSize={10} className=''>
        <div className='controls-container flex w-full justify-center'>
          <div className='w-full border border-white bg-white shadow'>
            <div className='flex items-center justify-between'>
              <div className='flex w-1/2 items-center justify-between'>
                <button
                  onClick={togglePlayPause}
                  className='rounded-full p-2 text-2xl'
                >
                  {isPlaying ? <Pause /> : <Play />}
                </button>
                <button
                  onClick={handleNextFrame}
                  className='rounded-full p-2 text-2xl'
                >
                  Hello
                </button>
                <Slider
                  value={[currentTime]}
                  onValueChange={handleTimeChange}
                  min={0}
                  max={totalDuration}
                  step={1}
                  className='w-48'
                  disabled={true} 
                />
                <div className='ml-6 flex items-center'>
                  <label htmlFor='volume' className='mr-2 text-sm font-medium'>
                    Volume:
                  </label>
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    min={0}
                    max={100}
                    step={1}
                    className='w-24'
                  />
                </div>
              </div>
              <div className='flex items-center'>
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    className={`mx-1 rounded-full px-3 py-1 text-sm ${
                      playbackSpeed === speed ? 'bg-gray-500' : ''
                    }`}
                    onClick={() => {
                      setPlaybackSpeed(speed)
                      changePlaybackSpeed(speed)
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              <div>
                <button
                  onClick={toggleFullscreen}
                  className='rounded-full p-2 text-xl'
                >
                  <Fullscreen />
                </button>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default VideoMain

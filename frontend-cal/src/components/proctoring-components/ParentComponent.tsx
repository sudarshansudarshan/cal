import { useState, useEffect } from 'react'

// Define the WasmFileset type
type WasmFileset = any
import FacePoseDetector from './FacePoseDetector'
import VoiceActivityDetection from './VoiceActivityDetection'
import { FilesetResolver } from '@mediapipe/tasks-vision'
import HandsDetection from './HandsDetection'
import BlurDetection from './BlurDetection'
import SnapshotRecorder from './SnapshotRecorder'
// import VirtualBackgroundDetection from "./VirtualBackgroundDetection"

const ParentComponent = () => {
  const [filesetResolver, setFilesetResolver] = useState<WasmFileset>(null)
  const [audioFilesetResolver, setAudioFilesetResolver] =
    useState<WasmFileset>(null)

  // anomaly state related variables
  const [handCount, setHandCount] = useState(0) // for HandsDetection
  const [lookAwayCount, setLookAwayCount] = useState(0) // for FacePoseDetector
  const [numPeople, setNumPeople] = useState(0) // for FacePoseDetector
  const [isBlur, setIsBlur] = useState('No') // for BlurDetection
  const [status, setStatus] = useState('') // for FacePoseDetector

  useEffect(() => {
    const initializeFilesetResolver = async () => {
      const resolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
      )
      const audioResolver = await FilesetResolver.forAudioTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm'
      )
      setAudioFilesetResolver(audioResolver)
      setFilesetResolver(resolver)
    }

    initializeFilesetResolver()
  }, [])
  if (!(filesetResolver && audioFilesetResolver)) {
    return <div>Loading...</div> // Wait until the resolver is initialized.
  }

  return (
    <div>
      <FacePoseDetector
        filesetResolver={filesetResolver}
        lookAwayCount={lookAwayCount}
        setLookAwayCount={setLookAwayCount}
        numPeople={numPeople}
        setNumPeople={setNumPeople}
        status={status}
        setStatus={setStatus}
      />
      <HandsDetection
        filesetResolver={filesetResolver}
        handCount={handCount}
        setHandCount={setHandCount}
      />
      <VoiceActivityDetection filesetResolver={audioFilesetResolver} />
      <BlurDetection isBlur={isBlur} setIsBlur={setIsBlur} />
      <SnapshotRecorder
        anomalies={{ lookAwayCount, numPeople, handCount, isBlur, status }}
      />
      {/* <VirtualBackgroundDetection /> */}
    </div>
  )
}

// Explain what this component does
// This component serves as the parent component that orchestrates the different proctoring components.
// It initializes the FilesetResolver for vision and audio tasks using the Mediapipe library.
// The component manages the state and anomaly detection results from various proctoring components.
// It renders the FacePoseDetector, HandsDetection, VoiceActivityDetection, BlurDetection, and SnapshotRecorder components.
// The FacePoseDetector component detects face poses and updates the lookAwayCount, numPeople, and status.
// The HandsDetection component detects hand gestures and updates the handCount.
// The VoiceActivityDetection component detects voice activity using audio tasks.
// The BlurDetection component detects blur in the webcam feed and updates the isBlur state.
// The SnapshotRecorder component records snapshots of anomalies detected by other components.
// The VirtualBackgroundDetection component can be added to detect virtual backgrounds in the webcam feed.
// This parent component integrates multiple proctoring features to monitor user activity during online activities.
// It demonstrates how different components can work together to enhance proctoring capabilities.
// The component can be extended with additional features or customizations based on specific requirements.
// It leverages machine learning and computer vision technologies to analyze user behavior and engagement.
// The component provides real-time feedback and alerts for anomalies detected during online interactions.
// It showcases the integration of proctoring tools in web applications for monitoring user behavior.

export default ParentComponent

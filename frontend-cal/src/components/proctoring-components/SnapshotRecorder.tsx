import { handleSaveSnapshot } from '../../lib/snapUtils.ts'
import React, { useEffect, useRef } from 'react'
import { clearSnapshots } from '../../lib/dbUtils.ts'
import { upload } from '../../lib/cloudUtils.ts'

interface Anomalies {
  lookAwayCount: number
  numPeople: number
  handCount: number
  isBlur: string
  status: string
}

const SnapshotRecorder: React.FC<{ anomalies: Anomalies }> = ({
  anomalies,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentAnomaliesRef = useRef(anomalies) // Initialize with default array values
  const counterRef = useRef(0)

  const counterLimit = 5 // upload capacity = 2*counterLimit+1 should be the number of frames uploaded at a time. Ensure that this is less than the memory capacity defined in snapUtils.js

  // Helper function for computing anomalies
  const getActiveAnomalies = () => {
    let anomaliesList = []
    const { lookAwayCount, numPeople, handCount, isBlur, status } =
      currentAnomaliesRef.current

    if (lookAwayCount % 5000 === 0 && lookAwayCount > 0) {
      anomaliesList.push('looking away')
    }

    if (numPeople > 1) {
      anomaliesList.push('multiple people')
    }

    if (handCount > 2) {
      anomaliesList.push('more than two hands')
    }

    if (isBlur === 'Yes') {
      anomaliesList.push('blur video')
    }

    if (status === 'User not detected.' || status === 'User is not in box') {
      anomaliesList.push(status)
    }

    return anomaliesList.join(', ')
  }

  useEffect(() => {
    const startWebcam = async () => {
      const video = videoRef.current
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        if (video) {
          video.srcObject = stream
        }
        if (video) {
          video.play()
        }
      }
    }
    startWebcam()
    clearSnapshots()
    return () => {
      const video = videoRef.current
      if (video && video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      // if there is an anomaly, set a counter of 5, and after that counter ends upload the last 11 frames to cloud.
      // while the counter is running, do not reset the counter.

      const activeAnomalies = getActiveAnomalies()
      if (videoRef.current) {
        const id = await handleSaveSnapshot({
          anomalyType: activeAnomalies,
          video: videoRef.current,
        })
        if (id !== undefined) {
          if (activeAnomalies != '' && counterRef.current == 0) {
            counterRef.current = counterLimit + 1
          }
          if (counterRef.current > 0) {
            if (counterRef.current == 1) {
              upload(id, 2 * counterLimit)
            }
            counterRef.current--
          }
        } else {
          console.error('Snapshot ID is undefined')
        }
      } else {
        console.log('video not loaded')
      }
    }, 2000) // Capture every 2 seconds

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current) // Clear the interval on component unmount
      }
    }
  }, [])

  useEffect(() => {
    currentAnomaliesRef.current = anomalies
  }, [anomalies])

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
    </div>
  )
}

// Explain what this component does
// This component records snapshots from the webcam feed based on detected anomalies.
// It uses the `handleSaveSnapshot` function to save snapshots with anomaly information.
// The component uploads snapshots to the cloud storage after a certain number of frames.
// It checks for active anomalies based on the anomaly data received as props.
// The component initializes the webcam and starts capturing snapshots at regular intervals.
// It updates the counter to control the upload frequency of snapshots.
// The component clears snapshots from the local storage when it mounts.
// The recorded snapshots include information about the detected anomalies.
// The component is used to capture snapshots of anomalies detected during proctored activities.
// It helps in monitoring and recording user behavior during online activities.
// The snapshots can be used for further analysis or review of user activity.
// The component provides real-time feedback on detected anomalies in the webcam feed.
// It leverages cloud storage to store and manage the captured snapshots.
// The component can be customized to adjust the snapshot capture frequency and upload behavior.
// It demonstrates how to integrate snapshot recording functionality with anomaly detection.
// The component ensures that snapshots are captured and uploaded based on the specified criteria.

export default SnapshotRecorder

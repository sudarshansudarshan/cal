import React from 'react'
import ReactDOM from 'react-dom/client'
import PermissionModal from '../components/ui/PermissionModal'
import { saveSnapshot, deleteSnapshot } from './dbUtils.ts'

interface SaveSnapshotOptions {
  anomalyType: string
  video: HTMLVideoElement
}

interface Snapshot {
  image: string
  screenshot: string
  anomalyType: string
  timestamp: string
}

const checkPermissions = async (): Promise<boolean> => {
  try {
    const permissions = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    })
    if (permissions.state === 'denied') {
      return false
    }
    return true
  } catch (error) {
    console.error('Error checking permissions:', error)
    return false
  }
}

const showPermissionModal = () => {
  const modalRoot = document.createElement('div')
  document.body.appendChild(modalRoot)

  const root = ReactDOM.createRoot(modalRoot)

  const handleClose = () => {
    root.unmount()
    document.body.removeChild(modalRoot)
  }

  root.render(
    React.createElement(PermissionModal, { isOpen: true, onClose: handleClose })
  )
}

const captureFrame = async (
  video: HTMLVideoElement
): Promise<string | undefined> => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error capturing frame:', error)
    return undefined
  }
}

const captureScreenshot = async (): Promise<string | undefined> => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')
    // Capture the screenshot logic here
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error capturing screenshot:', error)
    return undefined
  }
}

export const handleSaveSnapshot = async ({
  anomalyType,
  video,
}: SaveSnapshotOptions): Promise<number | undefined> => {
  const hasPermissions = await checkPermissions()
  if (!hasPermissions) {
    showPermissionModal()
    return undefined
  }

  const base64Img = await captureFrame(video)
  const base64Screenshot = await captureScreenshot()
  if (base64Img && base64Screenshot) {
    const newSnapshot: Snapshot = {
      image: base64Img,
      screenshot: base64Screenshot,
      anomalyType: anomalyType,
      timestamp: new Date().toISOString(),
    }

    try {
      const id = await saveSnapshot(newSnapshot) // Save snapshot to database
      await deleteSnapshot(id)
      return id
    } catch (error) {
      console.error('Error saving snapshot to database:', error)
      return undefined
    }
  }
  return undefined
}

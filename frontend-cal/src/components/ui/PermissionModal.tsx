import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


interface PermissionModalProps {
  isOpen: boolean
  onClose: () => void
}

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Permissions Required</DialogTitle>
        <DialogDescription>
          Camera and microphone permissions are strictly necessary to proceed.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PermissionModal
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SkipAlertDialogProps {
  isOpen: boolean; // Whether the dialog is open
  onClose: () => void; // Function to close the dialog
  onConfirm: () => void; // Function to execute when "OK" is clicked
}

const SkipAlertDialog: React.FC<SkipAlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Skipping Not Allowed</AlertDialogTitle>
        <AlertDialogDescription>
          You cannot skip forward in this video.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default SkipAlertDialog;

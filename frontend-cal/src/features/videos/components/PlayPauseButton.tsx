import React from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  toggle: () => void;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ isPlaying, toggle }) => (
  <Button variant="outline" onClick={toggle}>
    {isPlaying ? <Pause /> : <Play />}
  </Button>
);

export default PlayPauseButton;

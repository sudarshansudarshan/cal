import React from "react";
import { Slider } from "@/components/ui/slider";

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, onVolumeChange }) => (
  <div className="flex items-center">
    <label htmlFor="volume" className="mr-2">Volume:</label>
    <Slider
      max={100}
      step={1}
      value={[volume]}
      onValueChange={(value) => onVolumeChange(value[0])}
      className="w-24"
    />
    <span className="ml-2">{volume}%</span>
  </div>
);

export default VolumeSlider;

import React from "react";

interface PlaybackSpeedSelectorProps {
  speed: number;
  onChange: (value: string) => void;
}

const PlaybackSpeedSelector: React.FC<PlaybackSpeedSelectorProps> = ({ speed, onChange }) => (
  <select
    value={speed}
    onChange={(e) => onChange(e.target.value)}
    className="border rounded px-2 py-1 ml-4"
  >
    {[0.5, 1, 1.5, 2].map((s) => (
      <option key={s} value={s}>
        {s}x
      </option>
    ))}
  </select>
);

export default PlaybackSpeedSelector;

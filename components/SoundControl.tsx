"use client";

import { useState, useEffect } from "react";
import { getSoundManager } from "@/lib/sounds";

export default function SoundControl() {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const sm = getSoundManager();
    setMuted(sm.muted);
    setVolume(sm.volume);
  }, []);

  const toggleMute = () => {
    const sm = getSoundManager();
    const newMuted = !muted;
    sm.setMuted(newMuted);
    setMuted(newMuted);
  };

  const handleVolume = (val: number) => {
    const sm = getSoundManager();
    sm.setVolume(val);
    setVolume(val);
    if (val > 0 && muted) {
      sm.setMuted(false);
      setMuted(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={toggleMute}
        onMouseEnter={() => setShowSlider(true)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#25254a] transition-all text-sm"
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? "🔇" : volume > 0.5 ? "🔊" : "🔉"}
      </button>
      {showSlider && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a2e] border border-[#25254a] rounded-lg p-3 shadow-xl"
          onMouseLeave={() => setShowSlider(false)}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => handleVolume(parseFloat(e.target.value))}
            className="w-24 accent-purple-500"
          />
        </div>
      )}
    </div>
  );
}

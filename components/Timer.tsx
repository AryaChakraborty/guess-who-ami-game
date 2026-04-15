"use client";

interface TimerProps {
  remaining: number;
  round: number;
  totalRounds: number;
}

export default function Timer({ remaining, round, totalRounds }: TimerProps) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining <= 30;
  const isCritical = remaining <= 10;

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-400">
        Round <span className="text-white font-bold">{round}</span>
        <span className="text-gray-500">/{totalRounds}</span>
      </div>
      <div
        className={`font-mono text-2xl font-bold tabular-nums ${
          isCritical
            ? "text-red-400 animate-pulse"
            : isLow
              ? "text-yellow-400"
              : "text-white"
        }`}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
}

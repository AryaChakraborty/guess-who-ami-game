"use client";

import { PlayerState } from "@/lib/types";

interface ScoreboardProps {
  players: PlayerState[];
  currentPlayerId: string;
}

export default function Scoreboard({
  players,
  currentPlayerId,
}: ScoreboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-[#25254a] p-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Scoreboard
      </h3>
      <div className="space-y-2">
        {sorted.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              player.id === currentPlayerId
                ? "bg-purple-500/10 border border-purple-500/30"
                : "bg-[#0f0f1a]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 w-5">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
              </span>
              <span className="text-sm text-white">
                {player.name}
                {player.id === currentPlayerId && (
                  <span className="text-purple-400 text-xs ml-1">(you)</span>
                )}
              </span>
              {player.hasGuessedCorrectly && (
                <span className="text-green-400 text-xs">✓</span>
              )}
            </div>
            <span className="text-sm font-bold text-purple-400">
              {player.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

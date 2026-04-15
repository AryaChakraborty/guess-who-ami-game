"use client";

import { PlayerState } from "@/lib/types";
import celebrities from "@/lib/celebrities";
import Image from "next/image";

interface GameGridProps {
  players: PlayerState[];
  currentPlayerId: string;
  gameState: "lobby" | "playing" | "round-end" | "game-end";
  revealedCelebrity?: { name: string; image: string } | null;
}

export default function GameGrid({
  players,
  currentPlayerId,
  gameState,
  revealedCelebrity,
}: GameGridProps) {
  const gridCols =
    players.length <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : players.length <= 4
        ? "grid-cols-2"
        : players.length <= 6
          ? "grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {players.map((player) => {
        const isMe = player.id === currentPlayerId;
        const celebrity = player.celebrityId
          ? celebrities.find((c) => c.id === player.celebrityId)
          : null;

        // In playing state: show celebrity to others, mystery to self
        // If self and guessed correctly, show the revealed celebrity
        const showCelebrity =
          gameState === "playing" || gameState === "round-end";
        const isMystery = isMe && !player.hasGuessedCorrectly && gameState === "playing";

        return (
          <div
            key={player.id}
            className={`celebrity-card rounded-2xl overflow-hidden border transition-all ${
              isMe
                ? "border-purple-500/50 ring-2 ring-purple-500/20"
                : player.hasGuessedCorrectly
                  ? "border-green-500/50"
                  : "border-[#25254a]"
            } bg-[#1a1a2e]`}
          >
            {/* Celebrity Image Area */}
            <div className="relative aspect-[3/4] bg-[#0f0f1a] overflow-hidden">
              {gameState === "lobby" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{player.avatar}</span>
                </div>
              ) : isMystery ? (
                // Self - mystery card
                <div className="mystery-card absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="text-6xl animate-pulse">❓</span>
                  <span className="text-gray-400 text-sm font-medium">
                    Who am I?
                  </span>
                  {isMe && revealedCelebrity && (
                    // This shouldn't show during mystery, but kept for safety
                    <></>
                  )}
                </div>
              ) : isMe && player.hasGuessedCorrectly && revealedCelebrity ? (
                // Self - guessed correctly, show revealed
                <div className="relative w-full h-full">
                  <Image
                    src={revealedCelebrity.image}
                    alt={revealedCelebrity.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-lg">
                      {revealedCelebrity.name}
                    </p>
                    <p className="text-green-400 text-xs font-semibold">
                      ✓ Guessed correctly!
                    </p>
                  </div>
                </div>
              ) : showCelebrity && celebrity ? (
                // Others - show their celebrity
                <div className="relative w-full h-full">
                  <Image
                    src={celebrity.image}
                    alt={isMe ? "Mystery celebrity" : celebrity.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm">
                      {celebrity.name}
                    </p>
                    <p className="text-gray-300 text-xs capitalize">
                      {celebrity.profession} · {celebrity.nationality}
                    </p>
                  </div>
                  {player.hasGuessedCorrectly && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      ✓ Guessed
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{player.avatar}</span>
                </div>
              )}
            </div>

            {/* Player Name Bar */}
            <div
              className={`px-3 py-2 flex items-center justify-between ${
                isMe ? "bg-purple-500/10" : "bg-[#1a1a2e]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{player.avatar}</span>
                <span className="text-sm font-medium text-white truncate">
                  {player.name}
                  {isMe && (
                    <span className="text-purple-400 text-xs ml-1">(you)</span>
                  )}
                </span>
              </div>
              {gameState !== "lobby" && (
                <span className="text-xs font-bold text-purple-400">
                  {player.score} pts
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

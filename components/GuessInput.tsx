"use client";

import { useState } from "react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  hasGuessed: boolean;
  isMyTurn: boolean;
  currentTurnPlayerName: string | null;
}

export default function GuessInput({
  onGuess,
  disabled,
  hasGuessed,
  isMyTurn,
  currentTurnPlayerName,
}: GuessInputProps) {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled && isMyTurn) {
      onGuess(guess.trim());
      setGuess("");
    }
  };

  if (hasGuessed) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
        <span className="text-green-400 font-semibold">
          ✓ You guessed correctly!
        </span>
      </div>
    );
  }

  const canGuess = !disabled && isMyTurn;

  return (
    <div className="space-y-2">
      {/* Turn indicator */}
      <div
        className={`text-center text-sm font-medium py-2 px-4 rounded-lg ${
          isMyTurn
            ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
            : "bg-[#1a1a2e] border border-[#25254a] text-gray-500"
        }`}
      >
        {isMyTurn
          ? "Your turn! Submit your guess below"
          : `Waiting for ${currentTurnPlayerName || "..."} to guess`}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder={
            isMyTurn ? "Type your guess..." : "Wait for your turn..."
          }
          disabled={!canGuess}
          className="flex-1 px-4 py-3 bg-[#0f0f1a] border border-[#25254a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!canGuess || !guess.trim()}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          Guess!
        </button>
      </form>
    </div>
  );
}

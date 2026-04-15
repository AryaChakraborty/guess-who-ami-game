"use client";

import { useState } from "react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  hasGuessed: boolean;
}

export default function GuessInput({
  onGuess,
  disabled,
  hasGuessed,
}: GuessInputProps) {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
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

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type your guess..."
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-[#0f0f1a] border border-[#25254a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !guess.trim()}
        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        Guess!
      </button>
    </form>
  );
}

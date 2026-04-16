"use client";

import { useState } from "react";
import { TurnState } from "@/lib/types";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  onSkip: () => void;
  disabled: boolean;
  hasGuessed: boolean;
  isMyTurn: boolean;
  currentTurnPlayerName: string | null;
  turn: TurnState | null;
}

export default function GuessInput({
  onGuess,
  onSkip,
  disabled,
  hasGuessed,
  isMyTurn,
  currentTurnPlayerName,
  turn,
}: GuessInputProps) {
  const [guess, setGuess] = useState("");

  // Rule 3: player can guess in asking OR guessing phase
  const canGuess =
    !disabled &&
    isMyTurn &&
    (turn?.phase === "asking" || turn?.phase === "guessing");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && canGuess) {
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

  const attemptsLeft = turn
    ? turn.maxGuessAttempts - turn.guessAttempts
    : 3;
  const usedAttempts = turn?.guessAttempts ?? 0;

  return (
    <div className="space-y-2">
      {/* FINAL TURN warning (Rule 1) */}
      {turn?.isFinalTurn && isMyTurn && !hasGuessed && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-lg px-4 py-2 text-center text-red-400 text-sm font-semibold animate-pulse">
          ⚠️ FINAL CHANCE — If you don&apos;t guess now, the round ends with 0 points!
        </div>
      )}

      {/* Turn indicator */}
      <div
        className={`text-center text-sm font-medium py-2 px-4 rounded-lg ${
          isMyTurn
            ? turn?.phase === "guessing"
              ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
              : turn?.phase === "asking"
                ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                : "bg-[#1a1a2e] border border-[#25254a] text-gray-500"
            : "bg-[#1a1a2e] border border-[#25254a] text-gray-500"
        }`}
      >
        {isMyTurn
          ? turn?.phase === "asking"
            ? "Your turn! Ask a question, or guess directly below"
            : turn?.phase === "voting"
              ? "Waiting for votes..."
              : turn?.phase === "results"
                ? "Reviewing poll results..."
                : "Guess or skip!"
          : `Waiting for ${currentTurnPlayerName || "..."}'s turn`}
      </div>

      {/* Guess input — available during asking OR guessing phase (Rule 3) */}
      {canGuess && (
        <div className="space-y-2">
          {/* Attempts indicator (only visible once you've used some) */}
          {usedAttempts > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs">
              <span className="text-gray-500">Close guesses:</span>
              {Array.from({ length: turn?.maxGuessAttempts ?? 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < usedAttempts ? "bg-orange-500" : "bg-gray-600"
                  }`}
                />
              ))}
              <span className="text-orange-400 ml-1">
                {attemptsLeft} {attemptsLeft === 1 ? "try" : "tries"} left
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder={
                turn?.phase === "asking"
                  ? "Or skip the question and guess here..."
                  : "Type your guess..."
              }
              className="flex-1 px-4 py-3 bg-[#0f0f1a] border border-[#25254a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
            <button
              type="submit"
              disabled={!guess.trim()}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Guess!
            </button>
          </form>

          {/* Skip only makes sense in the guessing phase (after asking) */}
          {turn?.phase === "guessing" && (
            <button
              onClick={onSkip}
              className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors border border-[#25254a] rounded-xl hover:border-gray-500"
            >
              Skip → Next player
            </button>
          )}
        </div>
      )}
    </div>
  );
}

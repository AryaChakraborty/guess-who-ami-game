"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, TurnState, Vote } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentPlayerId: string;
  disabled: boolean;
  turn: TurnState | null;
  onAskQuestion: (question: string) => void;
  onSubmitVote: (vote: "yes" | "no") => void;
}

export default function ChatPanel({
  messages,
  currentPlayerId,
  disabled,
  turn,
  onAskQuestion,
  onSubmitVote,
}: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMyTurn = turn?.askingPlayerId === currentPlayerId;
  const hasVoted = turn?.votes.some((v) => v.playerId === currentPlayerId) ?? false;

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && isMyTurn && turn?.phase === "asking") {
      onAskQuestion(question.trim());
      setQuestion("");
    }
  };

  // Vote breakdown
  const yesVotes = turn?.votes.filter((v) => v.vote === "yes") ?? [];
  const noVotes = turn?.votes.filter((v) => v.vote === "no") ?? [];
  const totalVoted = yesVotes.length + noVotes.length;
  const yesPercent = totalVoted > 0 ? Math.round((yesVotes.length / totalVoted) * 100) : 0;
  const noPercent = totalVoted > 0 ? 100 - yesPercent : 0;

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-[#25254a] flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#25254a]">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Q&A
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">
            Ask yes/no questions to figure out your celebrity!
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-slide-up ${
              msg.type === "system" || msg.type === "guess-correct" || msg.type === "guess-wrong"
                ? "text-center"
                : ""
            }`}
          >
            {msg.type === "system" && (
              <p className="text-gray-500 text-xs italic py-1">{msg.text}</p>
            )}
            {msg.type === "guess-correct" && (
              <p className="text-green-400 text-xs font-semibold py-1">{msg.text}</p>
            )}
            {msg.type === "guess-wrong" && (
              <p className="text-red-400 text-xs py-1">{msg.text}</p>
            )}
            {msg.type === "question" && (
              <div
                className={`rounded-lg px-3 py-2 max-w-[85%] ${
                  msg.playerId === currentPlayerId
                    ? "bg-purple-500/20 border border-purple-500/30 ml-auto"
                    : "bg-[#25254a]"
                }`}
              >
                <p className="text-[10px] text-gray-500 mb-0.5">
                  {msg.playerName}{" "}
                  <span className="text-purple-400">asks:</span>
                </p>
                <p className="text-sm text-white">{msg.text}</p>
              </div>
            )}
            {msg.type === "answer" && (
              <div
                className={`rounded-lg px-3 py-2 max-w-[85%] ${
                  msg.playerId === currentPlayerId
                    ? "bg-emerald-500/20 border border-emerald-500/30 ml-auto"
                    : "bg-emerald-900/30"
                }`}
              >
                <p className="text-[10px] text-gray-500 mb-0.5">
                  {msg.playerName}{" "}
                  <span className="text-emerald-400">answers:</span>
                </p>
                <p className="text-sm text-white">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Turn Action Area */}
      {!disabled && turn && (
        <div className="p-3 border-t border-[#25254a] space-y-3">
          {/* ASKING PHASE — current player types their question */}
          {turn.phase === "asking" && isMyTurn && (
            <div>
              <p className="text-yellow-400 text-xs font-medium mb-2">
                Your turn! Ask a yes/no question:
              </p>
              <form onSubmit={handleAsk} className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder='e.g. "Am I a musician?"'
                  className="flex-1 px-3 py-2 bg-[#0f0f1a] border border-[#25254a] rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ask
                </button>
              </form>
            </div>
          )}

          {/* ASKING PHASE — other players wait */}
          {turn.phase === "asking" && !isMyTurn && (
            <p className="text-gray-500 text-sm text-center py-2">
              Waiting for {turn.askingPlayerName} to ask a question...
            </p>
          )}

          {/* VOTING PHASE — other players vote */}
          {turn.phase === "voting" && !isMyTurn && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-cyan-400 text-xs font-medium">
                  {turn.askingPlayerName} asks: &quot;{turn.question}&quot;
                </p>
                <span className="text-xs text-gray-500 tabular-nums">
                  {turn.voteTimerRemaining}s
                </span>
              </div>
              {!hasVoted ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onSubmitVote("yes")}
                    className="flex-1 py-2.5 bg-green-600/20 border border-green-500/40 hover:bg-green-600/40 rounded-lg text-sm font-semibold text-green-400 transition-all"
                  >
                    ✅ Yes
                  </button>
                  <button
                    onClick={() => onSubmitVote("no")}
                    className="flex-1 py-2.5 bg-red-600/20 border border-red-500/40 hover:bg-red-600/40 rounded-lg text-sm font-semibold text-red-400 transition-all"
                  >
                    ❌ No
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-2">
                  Vote submitted! Waiting for others...
                </p>
              )}
              {/* Live vote count */}
              <p className="text-gray-600 text-xs text-center mt-2">
                {totalVoted} / {turn.totalVoters} voted
              </p>
            </div>
          )}

          {/* VOTING PHASE — asker waits for votes */}
          {turn.phase === "voting" && isMyTurn && (
            <div>
              <p className="text-cyan-400 text-xs font-medium mb-2">
                Waiting for votes on your question...
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-xs">
                  {totalVoted} / {turn.totalVoters} voted
                </p>
                <span className="text-xs text-gray-500 tabular-nums">
                  {turn.voteTimerRemaining}s
                </span>
              </div>
              {/* Live progress bar */}
              <div className="mt-2 h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500/50 transition-all duration-300"
                  style={{ width: `${turn.totalVoters > 0 ? (totalVoted / turn.totalVoters) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* RESULTS PHASE — show poll results to everyone */}
          {turn.phase === "results" && (
            <PollResults
              question={turn.question}
              askingPlayerName={turn.askingPlayerName}
              yesVotes={yesVotes}
              noVotes={noVotes}
              yesPercent={yesPercent}
              noPercent={noPercent}
              totalVoters={turn.totalVoters}
            />
          )}

          {/* GUESSING PHASE — asker sees results + guess/skip handled by GuessInput */}
          {turn.phase === "guessing" && isMyTurn && (
            <PollResults
              question={turn.question}
              askingPlayerName={turn.askingPlayerName}
              yesVotes={yesVotes}
              noVotes={noVotes}
              yesPercent={yesPercent}
              noPercent={noPercent}
              totalVoters={turn.totalVoters}
            />
          )}

          {turn.phase === "guessing" && !isMyTurn && (
            <div>
              <PollResults
                question={turn.question}
                askingPlayerName={turn.askingPlayerName}
                yesVotes={yesVotes}
                noVotes={noVotes}
                yesPercent={yesPercent}
                noPercent={noPercent}
                totalVoters={turn.totalVoters}
              />
              <p className="text-gray-500 text-xs text-center mt-2">
                Waiting for {turn.askingPlayerName} to guess or skip...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Poll Results Sub-component ──────────────────────────────────────────────

function PollResults({
  question,
  askingPlayerName,
  yesVotes,
  noVotes,
  yesPercent,
  noPercent,
  totalVoters,
}: {
  question: string | null;
  askingPlayerName: string;
  yesVotes: Vote[];
  noVotes: Vote[];
  yesPercent: number;
  noPercent: number;
  totalVoters: number;
}) {
  const totalVoted = yesVotes.length + noVotes.length;
  const nonVoters = totalVoters - totalVoted;

  return (
    <div className="bg-[#0f0f1a] rounded-lg p-3 space-y-2">
      <p className="text-xs text-gray-400">
        {askingPlayerName} asked: &quot;{question}&quot;
      </p>

      {/* Percentage bars */}
      <div className="space-y-1.5">
        {/* Yes bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="text-green-400 font-medium">✅ Yes</span>
            <span className="text-green-400 font-semibold">
              {yesPercent}% ({yesVotes.length})
            </span>
          </div>
          <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500/60 rounded-full transition-all duration-500"
              style={{ width: `${yesPercent}%` }}
            />
          </div>
        </div>
        {/* No bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="text-red-400 font-medium">❌ No</span>
            <span className="text-red-400 font-semibold">
              {noPercent}% ({noVotes.length})
            </span>
          </div>
          <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500/60 rounded-full transition-all duration-500"
              style={{ width: `${noPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Who voted what */}
      <div className="pt-1 border-t border-[#25254a]">
        {yesVotes.length > 0 && (
          <p className="text-[10px] text-green-400/70">
            ✅ {yesVotes.map((v) => v.playerName).join(", ")}
          </p>
        )}
        {noVotes.length > 0 && (
          <p className="text-[10px] text-red-400/70">
            ❌ {noVotes.map((v) => v.playerName).join(", ")}
          </p>
        )}
        {nonVoters > 0 && (
          <p className="text-[10px] text-gray-600">
            {nonVoters} didn&apos;t vote
          </p>
        )}
      </div>
    </div>
  );
}

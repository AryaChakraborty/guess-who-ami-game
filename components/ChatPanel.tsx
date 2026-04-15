"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, type: "question" | "answer") => void;
  currentPlayerId: string;
  disabled: boolean;
}

export default function ChatPanel({
  messages,
  onSendMessage,
  currentPlayerId,
  disabled,
}: ChatPanelProps) {
  const [text, setText] = useState("");
  const [messageType, setMessageType] = useState<"question" | "answer">(
    "question"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text.trim(), messageType);
      setText("");
    }
  };

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-[#25254a] flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#25254a]">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Chat - Q&A
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
              <p className="text-green-400 text-xs font-semibold py-1">
                {msg.text}
              </p>
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

      {/* Input */}
      <div className="p-3 border-t border-[#25254a]">
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setMessageType("question")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              messageType === "question"
                ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                : "bg-[#0f0f1a] text-gray-500 border border-transparent"
            }`}
          >
            ❓ Question
          </button>
          <button
            onClick={() => setMessageType("answer")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              messageType === "answer"
                ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                : "bg-[#0f0f1a] text-gray-500 border border-transparent"
            }`}
          >
            ✅ Answer
          </button>
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              messageType === "question"
                ? 'Ask a yes/no question... (e.g. "Am I a musician?")'
                : 'Answer... (e.g. "Yes!" or "No, not American")'
            }
            disabled={disabled}
            className="flex-1 px-3 py-2 bg-[#0f0f1a] border border-[#25254a] rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

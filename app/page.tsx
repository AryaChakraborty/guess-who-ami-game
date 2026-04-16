"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ensureConnected } from "@/lib/socket";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState<"home" | "join">("home");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCreateClick = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    setShowConfirm(true);
  };

  const handleCreate = async () => {
    setShowConfirm(false);
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const socket = await ensureConnected();

      // Add a timeout for the emit callback too
      const response = await new Promise<{
        success: boolean;
        roomId?: string;
        playerId?: string;
        error?: string;
      }>((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("Server did not respond in time")),
          5000
        );
        socket.emit(
          "create-room",
          { playerName: playerName.trim() },
          (res: {
            success: boolean;
            roomId?: string;
            playerId?: string;
            error?: string;
          }) => {
            clearTimeout(timer);
            resolve(res);
          }
        );
      });

      if (response.success && response.roomId && response.playerId) {
        sessionStorage.setItem("playerName", playerName.trim());
        sessionStorage.setItem("playerId", response.playerId);
        router.push(`/room/${response.roomId}`);
      } else {
        setError(response.error || "Failed to create room");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const socket = await ensureConnected();

      const response = await new Promise<{
        success: boolean;
        playerId?: string;
        error?: string;
      }>((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("Server did not respond in time")),
          5000
        );
        socket.emit(
          "join-room",
          {
            roomId: roomCode.trim().toUpperCase(),
            playerName: playerName.trim(),
          },
          (res: { success: boolean; playerId?: string; error?: string }) => {
            clearTimeout(timer);
            resolve(res);
          }
        );
      });

      if (response.success && response.playerId) {
        sessionStorage.setItem("playerName", playerName.trim());
        sessionStorage.setItem("playerId", response.playerId);
        router.push(`/room/${roomCode.trim().toUpperCase()}`);
      } else {
        setError(response.error || "Failed to join room");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-6xl mb-4 animate-float">🎭</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Celebrity Head
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Guess the celebrity on your head!
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a2e] rounded-2xl p-6 shadow-2xl border border-[#25254a] animate-slide-up">
          {mode === "home" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && playerName.trim() && handleCreateClick()
                }
                maxLength={20}
                className="w-full px-4 py-3 bg-[#0f0f1a] border border-[#25254a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />

              <button
                onClick={handleCreateClick}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Connecting..." : "Create Room"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#25254a]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-[#1a1a2e] text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!playerName.trim()) {
                    setError("Please enter your name");
                    return;
                  }
                  setMode("join");
                }}
                className="w-full py-3 bg-[#25254a] hover:bg-[#2f2f5a] rounded-xl font-semibold text-white transition-all duration-200 border border-[#35356a]"
              >
                Join Room
              </button>
            </div>
          )}

          {mode === "join" && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setMode("home");
                  setError("");
                }}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
              >
                &larr; Back
              </button>

              <h2 className="text-xl font-bold text-white">Join a Room</h2>
              <p className="text-gray-400 text-sm">
                Enter the 5-letter room code shared by your friend
              </p>

              <input
                type="text"
                placeholder="ABCDE"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                maxLength={5}
                className="w-full px-4 py-3 bg-[#0f0f1a] border border-[#25254a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-center text-2xl tracking-[0.3em] font-mono uppercase"
              />

              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Connecting..." : "Join Game"}
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}
        </div>

        {/* Game Rules */}
        <div className="mt-8 animate-slide-up">
          <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider text-center">
            Game Rules
          </h3>
          <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#25254a] space-y-3">
            <Rule
              icon="👥"
              title="Everyone sees each other's celebrity — except their own"
              body="Your celebrity floats above your name. Figure out who you are from what others can see."
            />
            <Rule
              icon="🔁"
              title="Take turns asking yes/no questions"
              body="On your turn, ask one yes/no question to narrow down your celebrity."
            />
            <Rule
              icon="🗳️"
              title="Everyone votes on your question"
              body="Players have 20 seconds to vote yes or no. Results show as a live poll."
            />
            <Rule
              icon="🎯"
              title="After the poll, guess — or skip"
              body="Guess right, score points. Wrong, or skip, and your turn passes to the next player."
            />
            <Rule
              icon="🔥"
              title="Close guesses get retries"
              body="If your guess is at least 70% similar to the real name, you get up to 3 tries."
            />
            <Rule
              icon="🚫"
              title="Guess once and you're done asking"
              body="You can also skip asking and guess straight away — but once you guess, no more questions this round."
            />
            <Rule
              icon="🏁"
              title="Last player standing has one final shot"
              body="If they fail the final guess, the round ends with 0 points for them."
            />
            <Rule
              icon="⏱️"
              title="60 seconds per round, 3 rounds total"
              body="Faster correct guesses earn bigger time bonuses."
            />
            <Rule
              icon="👑"
              title="Host controls the room"
              body="If the host leaves, the game ends and everyone is sent home."
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-[#25254a] w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎭</div>
              <h2 className="text-xl font-bold text-white">Create a Room?</h2>
              <p className="text-gray-400 text-sm mt-2">
                You&apos;ll be the host as <span className="text-purple-400 font-semibold">{playerName.trim()}</span>. Share the room code with friends so they can join.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-[#25254a] hover:bg-[#2f2f5a] rounded-xl font-medium text-gray-300 transition-all border border-[#35356a]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-white transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Rule({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-xl leading-none mt-0.5 select-none">{icon}</span>
      <div className="flex-1">
        <p className="text-white text-sm font-medium leading-snug">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

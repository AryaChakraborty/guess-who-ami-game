"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket, ensureConnected, disconnectSocket } from "@/lib/socket";
import { getSoundManager } from "@/lib/sounds";
import {
  RoomState,
  ChatMessage,
  CelebrityReveal,
  FinalScore,
  TurnState,
} from "@/lib/types";
import GameGrid from "@/components/GameGrid";
import ChatPanel from "@/components/ChatPanel";
import Scoreboard from "@/components/Scoreboard";
import Timer from "@/components/Timer";
import GuessInput from "@/components/GuessInput";
import SoundControl from "@/components/SoundControl";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [timerRemaining, setTimerRemaining] = useState(180);
  const [revealedCelebrity, setRevealedCelebrity] = useState<{
    name: string;
    image: string;
  } | null>(null);
  const [reveals, setReveals] = useState<CelebrityReveal[]>([]);
  const [finalScores, setFinalScores] = useState<FinalScore[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(null);
  const [turnState, setTurnState] = useState<TurnState | null>(null);
  const prevTimerRef = useRef(180);
  const tickToggleRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const storedPlayerId = sessionStorage.getItem("playerId") || "";
    setPlayerId(storedPlayerId);

    async function init() {
      try {
        const socket = await ensureConnected();

        // If cleanup ran while we were awaiting, don't register anything
        if (cancelled) return;

        setConnected(true);

        // Set up event listeners
        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

      socket.on("room-update", (roomState: RoomState) => {
        setRoom(roomState);
        setMessages(roomState.messages);
        setCurrentTurnPlayerId(roomState.currentTurnPlayerId);
        setTurnState(roomState.turn);
      });

      socket.on("game-started", (roomState: RoomState) => {
        setRoom(roomState);
        setMessages(roomState.messages);
        setRevealedCelebrity(null);
        setReveals([]);
        setCurrentTurnPlayerId(roomState.currentTurnPlayerId);
        setTurnState(roomState.turn);
        getSoundManager().stopLobbyMusic();
        getSoundManager().play("game-start");
      });

      socket.on(
        "turn-update",
        (data: { currentTurnPlayerId: string; turn: TurnState }) => {
          setCurrentTurnPlayerId((prev) => {
            if (prev !== data.currentTurnPlayerId) {
              // Turn changed to a new player
              if (data.currentTurnPlayerId === storedPlayerId) {
                getSoundManager().play("your-turn");
              }
            }
            return data.currentTurnPlayerId;
          });
          setTurnState((prev) => {
            // Phase transitions
            if (prev?.phase !== data.turn.phase) {
              if (data.turn.phase === "voting") {
                getSoundManager().play("question");
              }
            }
            return data.turn;
          });
        }
      );

      socket.on("vote-tick", (data: { remaining: number }) => {
        setTurnState((prev) => prev ? { ...prev, voteTimerRemaining: data.remaining } : prev);
      });

      socket.on("new-message", (msg: ChatMessage) => {
        setMessages((prev) => [...prev, msg]);
      });

      socket.on("timer-tick", (data: { remaining: number }) => {
        setTimerRemaining(data.remaining);
        // Tick-tock for last 10 seconds
        if (data.remaining <= 10 && data.remaining > 0) {
          getSoundManager().play("timer-warning");
        } else if (data.remaining > 10) {
          // Normal tick-tock alternation
          tickToggleRef.current = !tickToggleRef.current;
          getSoundManager().play(tickToggleRef.current ? "tick" : "tock");
        }
        prevTimerRef.current = data.remaining;
      });

      socket.on(
        "guess-result",
        (data: {
          playerId: string;
          correct: boolean;
          celebrity?: { name: string; image: string };
        }) => {
          if (data.correct) {
            getSoundManager().play("correct");
          } else {
            getSoundManager().play("wrong");
          }
          if (
            data.playerId === storedPlayerId &&
            data.correct &&
            data.celebrity
          ) {
            setRevealedCelebrity(data.celebrity);
          }
        }
      );

      socket.on(
        "round-end",
        (data: {
          round: number;
          reveals: CelebrityReveal[];
          roomState: RoomState;
        }) => {
          setRoom(data.roomState);
          setReveals(data.reveals);
          setMessages(data.roomState.messages);
          setTurnState(null);
          getSoundManager().play("round-end");
        }
      );

      socket.on(
        "game-end",
        (data: { finalScores: FinalScore[]; roomState: RoomState }) => {
          setRoom(data.roomState);
          setFinalScores(data.finalScores);
          setMessages(data.roomState.messages);
          setTurnState(null);
          getSoundManager().play("game-over");
        }
      );

      socket.on("error-message", (data: { message: string }) => {
        setError(data.message);
        setTimeout(() => setError(""), 3000);
      });

      // Now rejoin the room to re-associate this socket with our player
      socket.emit(
        "rejoin-room",
        { roomId, playerId: storedPlayerId },
        (response: {
          success: boolean;
          roomState?: RoomState;
          error?: string;
        }) => {
          if (response.success && response.roomState) {
            setRoom(response.roomState);
            setMessages(response.roomState.messages);
            setTimerRemaining(response.roomState.timerRemaining);
            setCurrentTurnPlayerId(response.roomState.currentTurnPlayerId);
            setTurnState(response.roomState.turn);
          } else {
            console.error("Rejoin failed:", response.error);
            setJoinError(
              response.error || "Failed to rejoin room. It may no longer exist."
            );
          }
        }
      );
    } catch (err) {
      console.error("Socket connection failed:", err);
      setJoinError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
    }
    }

    init();

    return () => {
      cancelled = true;
      const socket = getSocket();
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-update");
      socket.off("game-started");
      socket.off("new-message");
      socket.off("timer-tick");
      socket.off("guess-result");
      socket.off("turn-update");
      socket.off("vote-tick");
      socket.off("round-end");
      socket.off("game-end");
      socket.off("error-message");
    };
  }, [roomId]);

  const isHost = room?.hostId === playerId;
  const currentPlayer = room?.players.find((p) => p.id === playerId);

  const handleStartGame = () => {
    getSocket().emit("start-game", { roomId, playerId });
  };

  const handleNextRound = () => {
    getSocket().emit("next-round", { roomId, playerId });
    setReveals([]);
    setRevealedCelebrity(null);
  };

  const handlePlayAgain = () => {
    getSocket().emit("play-again", { roomId, playerId });
    setReveals([]);
    setRevealedCelebrity(null);
    setFinalScores([]);
  };

  const handleAskQuestion = (question: string) => {
    getSocket().emit("ask-question", { roomId, playerId, question });
  };

  const handleSubmitVote = (vote: "yes" | "no") => {
    getSoundManager().play("vote");
    getSocket().emit("submit-vote", { roomId, playerId, vote });
  };

  const handleGuess = (guess: string) => {
    getSocket().emit(
      "submit-guess",
      { roomId, playerId, guess },
      (res: {
        correct: boolean;
        closeGuess?: boolean;
        attemptsLeft?: number;
      }) => {
        // Correct/wrong sounds are played via the guess-result event which
        // fires for everyone. We only handle close-guess feedback here since
        // close-but-retry isn't broadcast via guess-result.
        if (!res.correct && res.closeGuess) {
          getSoundManager().play("wrong");
        }
      }
    );
  };

  const handleSkip = () => {
    getSoundManager().play("skip");
    getSocket().emit("skip-turn", { roomId, playerId });
  };

  const handleLeave = () => {
    getSoundManager().stopLobbyMusic();
    disconnectSocket();
    router.push("/");
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
  };

  // ── Error State (room not found / connection failed) ───────────────────
  if (joinError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-white mb-2">
            Couldn&apos;t join room
          </h2>
          <p className="text-gray-400 text-sm mb-4">{joinError}</p>
          <button
            onClick={() => {
              disconnectSocket();
              router.push("/");
            }}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Loading State ──────────────────────────────────────────────────────
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-float mb-4">🎭</div>
          <p className="text-gray-400">
            {connected ? "Loading room..." : "Connecting to server..."}
          </p>
          {!connected && (
            <p className="text-gray-600 text-sm mt-2">
              Make sure the game server is running on port 3001
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Lobby State ────────────────────────────────────────────────────────
  if (room.state === "lobby") {
    getSoundManager().startLobbyMusic();
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <div className="flex justify-end mb-2">
              <SoundControl />
            </div>
            <div className="text-4xl mb-2">🎭</div>
            <h1 className="text-2xl font-bold text-white">Game Lobby</h1>
          </div>

          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-[#25254a]">
            {/* Room Code */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-2">
                Share this code with friends:
              </p>
              <button
                onClick={copyRoomCode}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f0f1a] rounded-xl border border-[#25254a] hover:border-purple-500 transition-all group"
              >
                <span className="text-3xl font-mono font-bold text-white tracking-[0.2em]">
                  {roomId}
                </span>
                <span className="text-gray-500 group-hover:text-purple-400 text-sm transition-colors">
                  📋
                </span>
              </button>
            </div>

            {/* Players List */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Players ({room.players.length}/8)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      player.id === playerId
                        ? "bg-purple-500/10 border border-purple-500/30"
                        : "bg-[#0f0f1a]"
                    }`}
                  >
                    <span>{player.avatar}</span>
                    <span className="text-sm text-white truncate">
                      {player.name}
                    </span>
                    {player.id === room.hostId && (
                      <span className="text-yellow-400 text-xs">👑</span>
                    )}
                  </div>
                ))}
                {Array.from({
                  length: Math.max(0, 2 - room.players.length),
                }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#25254a]"
                  >
                    <span className="text-gray-600 text-sm">
                      Waiting for player...
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            {isHost ? (
              <button
                onClick={handleStartGame}
                disabled={room.players.length < 2}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {room.players.length < 2
                  ? "Need at least 2 players"
                  : `Start Game (${room.players.length} players)`}
              </button>
            ) : (
              <p className="text-center text-gray-400 text-sm">
                Waiting for host to start the game...
              </p>
            )}
          </div>

          <button
            onClick={handleLeave}
            className="w-full mt-4 py-2 text-gray-500 hover:text-red-400 text-sm transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>
    );
  }

  // ── Game End State ─────────────────────────────────────────────────────
  if (room.state === "game-end" && finalScores.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6 animate-slide-up">
            <div className="text-6xl mb-2">🏆</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Game Over!
            </h1>
          </div>

          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-[#25254a] animate-slide-up">
            <div className="space-y-3">
              {finalScores.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                    index === 0
                      ? "bg-yellow-500/10 border border-yellow-500/30"
                      : index === 1
                        ? "bg-gray-400/10 border border-gray-400/30"
                        : index === 2
                          ? "bg-orange-700/10 border border-orange-700/30"
                          : "bg-[#0f0f1a]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : `${index + 1}.`}
                    </span>
                    <div>
                      <p className="text-white font-semibold">{player.name}</p>
                      {player.id === playerId && (
                        <p className="text-purple-400 text-xs">
                          That&apos;s you!
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xl font-bold text-purple-400">
                    {player.score}
                  </span>
                </div>
              ))}
            </div>

            {isHost && (
              <button
                onClick={handlePlayAgain}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-white transition-all"
              >
                Play Again
              </button>
            )}
          </div>

          <button
            onClick={handleLeave}
            className="w-full mt-4 py-2 text-gray-500 hover:text-red-400 text-sm transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>
    );
  }

  // ── Round End State ────────────────────────────────────────────────────
  if (room.state === "round-end" && reveals.length > 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 animate-slide-up">
            <h1 className="text-2xl font-bold text-white">
              Round {room.round} Results
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Here&apos;s who everyone was!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {reveals.map((reveal) => (
              <div
                key={reveal.playerId}
                className={`bg-[#1a1a2e] rounded-xl border overflow-hidden animate-slide-up ${
                  reveal.guessedCorrectly
                    ? "border-green-500/50"
                    : "border-[#25254a]"
                }`}
              >
                {reveal.celebrity && (
                  <div className="relative aspect-square bg-[#0f0f1a]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reveal.celebrity.image}
                      alt={reveal.celebrity.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white font-bold text-sm">
                        {reveal.celebrity.name}
                      </p>
                    </div>
                  </div>
                )}
                <div className="px-3 py-2">
                  <p className="text-sm text-white">{reveal.playerName}</p>
                  {reveal.guessedCorrectly ? (
                    <p className="text-green-400 text-xs">
                      ✓ Guessed correctly
                    </p>
                  ) : (
                    <p className="text-red-400 text-xs">
                      ✗ Didn&apos;t guess
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Scoreboard players={room.players} currentPlayerId={playerId} />

          <div className="mt-4 flex gap-3 justify-center">
            {isHost && room.round < room.totalRounds && (
              <button
                onClick={handleNextRound}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-white transition-all"
              >
                Next Round →
              </button>
            )}
            {!isHost && room.round < room.totalRounds && (
              <p className="text-gray-400 text-sm py-3">
                Waiting for host to start next round...
              </p>
            )}
            <button
              onClick={handleLeave}
              className="px-6 py-3 text-gray-500 hover:text-red-400 text-sm transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing State ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#1a1a2e] border-b border-[#25254a] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎭</span>
            <span className="text-sm text-gray-400 font-mono">{roomId}</span>
          </div>
          <Timer
            remaining={timerRemaining}
            round={room.round}
            totalRounds={room.totalRounds}
          />
          <div className="flex items-center gap-2">
            <SoundControl />
            <button
              onClick={handleLeave}
              className="text-gray-500 hover:text-red-400 text-sm transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-4">
        {/* Left: Game Grid + Guess */}
        <div className="flex-1 flex flex-col gap-4">
          <GameGrid
            players={room.players}
            currentPlayerId={playerId}
            gameState={room.state}
            revealedCelebrity={revealedCelebrity}
          />
          <GuessInput
            onGuess={handleGuess}
            onSkip={handleSkip}
            disabled={room.state !== "playing"}
            hasGuessed={currentPlayer?.hasGuessedCorrectly || false}
            isMyTurn={currentTurnPlayerId === playerId}
            currentTurnPlayerName={
              room.players.find((p) => p.id === currentTurnPlayerId)?.name ||
              null
            }
            turn={turnState}
          />
        </div>

        {/* Right: Chat + Scoreboard */}
        <div className="w-full lg:w-80 flex flex-col gap-4 lg:max-h-[calc(100vh-8rem)]">
          <Scoreboard players={room.players} currentPlayerId={playerId} />
          <div className="flex-1 min-h-[300px] lg:min-h-0">
            <ChatPanel
              messages={messages}
              currentPlayerId={playerId}
              disabled={room.state !== "playing"}
              turn={turnState}
              onAskQuestion={handleAskQuestion}
              onSubmitVote={handleSubmitVote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

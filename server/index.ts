import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import celebrities, { checkGuess } from "../lib/celebrities";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
    methods: ["GET", "POST"],
  },
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface Player {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  score: number;
  celebrityId: number | null;
  hasGuessedCorrectly: boolean;
  guessedAt: number | null;
  disconnectedAt: number | null;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  type: "question" | "answer" | "system" | "guess-correct" | "guess-wrong";
  timestamp: number;
}

interface Vote {
  playerId: string;
  playerName: string;
  vote: "yes" | "no";
}

interface TurnPhaseState {
  phase: "asking" | "voting" | "results" | "guessing";
  question: string | null;
  votes: Map<string, Vote>; // playerId -> vote
  voteTimer: NodeJS.Timeout | null;
  voteTimerRemaining: number;
  resultsTimer: NodeJS.Timeout | null;
}

interface Room {
  id: string;
  hostId: string;
  players: Map<string, Player>;
  state: "lobby" | "playing" | "round-end" | "game-end";
  round: number;
  totalRounds: number;
  timerSeconds: number;
  timerRemaining: number;
  timerInterval: NodeJS.Timeout | null;
  messages: ChatMessage[];
  usedCelebrityIds: Set<number>;
  roundStartTime: number | null;
  disconnectTimers: Map<string, NodeJS.Timeout>;
  turnOrder: string[];
  currentTurnIndex: number;
  turnPhase: TurnPhaseState;
}

// ─── State ───────────────────────────────────────────────────────────────────

const rooms = new Map<string, Room>();
const playerRoomMap = new Map<string, string>();

const AVATARS = ["🧑", "👩", "🧔", "👱", "👲", "🧕", "👨‍🦱", "👩‍🦰"];
const ROUND_TIMER = 180;
const TOTAL_ROUNDS = 3;
const VOTE_TIMER = 20;
const RESULTS_DISPLAY_TIME = 4; // seconds to show results before moving to guessing
const DISCONNECT_GRACE_MS = 15000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  if (rooms.has(code)) return generateRoomCode();
  return code;
}

function freshTurnPhase(): TurnPhaseState {
  return {
    phase: "asking",
    question: null,
    votes: new Map(),
    voteTimer: null,
    voteTimerRemaining: VOTE_TIMER,
    resultsTimer: null,
  };
}

function clearTurnTimers(room: Room) {
  if (room.turnPhase.voteTimer) {
    clearInterval(room.turnPhase.voteTimer);
    room.turnPhase.voteTimer = null;
  }
  if (room.turnPhase.resultsTimer) {
    clearTimeout(room.turnPhase.resultsTimer);
    room.turnPhase.resultsTimer = null;
  }
}

function getTurnState(room: Room) {
  const currentPlayerId = room.turnOrder[room.currentTurnIndex] || null;
  const currentPlayer = currentPlayerId
    ? room.players.get(currentPlayerId)
    : null;
  if (!currentPlayer) return null;

  return {
    phase: room.turnPhase.phase,
    askingPlayerId: currentPlayer.id,
    askingPlayerName: currentPlayer.name,
    question: room.turnPhase.question,
    votes: Array.from(room.turnPhase.votes.values()),
    voteTimerRemaining: room.turnPhase.voteTimerRemaining,
    totalVoters: room.players.size - 1,
  };
}

function getRoomState(room: Room) {
  const players = Array.from(room.players.values()).map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    score: p.score,
    celebrityId: p.celebrityId,
    hasGuessedCorrectly: p.hasGuessedCorrectly,
  }));
  return {
    id: room.id,
    hostId: room.hostId,
    players,
    state: room.state,
    round: room.round,
    totalRounds: room.totalRounds,
    timerRemaining: room.timerRemaining,
    messages: room.messages.slice(-100),
    turnOrder: room.turnOrder,
    currentTurnPlayerId: room.turnOrder[room.currentTurnIndex] || null,
    turn: room.state === "playing" ? getTurnState(room) : null,
  };
}

function assignCelebrities(room: Room) {
  const playerCount = room.players.size;
  const available = celebrities.filter(
    (c) => !room.usedCelebrityIds.has(c.id)
  );
  const pool =
    available.length >= playerCount
      ? available
      : celebrities.filter(() => true);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, playerCount);

  let i = 0;
  for (const player of room.players.values()) {
    player.celebrityId = selected[i].id;
    player.hasGuessedCorrectly = false;
    player.guessedAt = null;
    room.usedCelebrityIds.add(selected[i].id);
    i++;
  }
}

function startTimer(room: Room) {
  room.timerRemaining = ROUND_TIMER;
  room.roundStartTime = Date.now();
  if (room.timerInterval) clearInterval(room.timerInterval);
  room.timerInterval = setInterval(() => {
    room.timerRemaining--;
    io.to(room.id).emit("timer-tick", { remaining: room.timerRemaining });
    if (room.timerRemaining <= 0) {
      endRound(room);
    }
  }, 1000);
}

function stopTimer(room: Room) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
}

function emitSystemMsg(room: Room, text: string, type: ChatMessage["type"] = "system") {
  const msg: ChatMessage = {
    id: uuidv4(),
    playerId: "system",
    playerName: "System",
    text,
    type,
    timestamp: Date.now(),
  };
  room.messages.push(msg);
  io.to(room.id).emit("new-message", msg);
  return msg;
}

// ─── Turn Flow ───────────────────────────────────────────────────────────────

function startTurn(room: Room) {
  if (room.state !== "playing") return;

  clearTurnTimers(room);
  room.turnPhase = freshTurnPhase();

  const currentPlayerId = room.turnOrder[room.currentTurnIndex];
  const currentPlayer = room.players.get(currentPlayerId);
  if (!currentPlayer) return;

  emitSystemMsg(room, `It's ${currentPlayer.name}'s turn! Ask a yes/no question.`);
  io.to(room.id).emit("turn-update", {
    currentTurnPlayerId: currentPlayerId,
    turn: getTurnState(room),
  });
}

function startVoting(room: Room) {
  room.turnPhase.phase = "voting";
  room.turnPhase.voteTimerRemaining = VOTE_TIMER;

  // Start vote countdown
  room.turnPhase.voteTimer = setInterval(() => {
    room.turnPhase.voteTimerRemaining--;
    io.to(room.id).emit("vote-tick", {
      remaining: room.turnPhase.voteTimerRemaining,
    });
    if (room.turnPhase.voteTimerRemaining <= 0) {
      finishVoting(room);
    }
  }, 1000);

  io.to(room.id).emit("turn-update", {
    currentTurnPlayerId: room.turnOrder[room.currentTurnIndex],
    turn: getTurnState(room),
  });
}

function finishVoting(room: Room) {
  clearTurnTimers(room);
  room.turnPhase.phase = "results";

  const votes = Array.from(room.turnPhase.votes.values());
  const yesCount = votes.filter((v) => v.vote === "yes").length;
  const noCount = votes.filter((v) => v.vote === "no").length;
  const total = yesCount + noCount;
  const yesPercent = total > 0 ? Math.round((yesCount / total) * 100) : 0;
  const noPercent = total > 0 ? 100 - yesPercent : 0;
  const nonVoters = room.players.size - 1 - total;

  let resultText = `Poll results: ✅ Yes ${yesPercent}% (${yesCount}) / ❌ No ${noPercent}% (${noCount})`;
  if (nonVoters > 0) {
    resultText += ` / ${nonVoters} didn't vote`;
  }
  emitSystemMsg(room, resultText);

  io.to(room.id).emit("turn-update", {
    currentTurnPlayerId: room.turnOrder[room.currentTurnIndex],
    turn: getTurnState(room),
  });

  // After a short display, move to guessing phase
  room.turnPhase.resultsTimer = setTimeout(() => {
    if (room.state !== "playing") return;
    room.turnPhase.phase = "guessing";
    io.to(room.id).emit("turn-update", {
      currentTurnPlayerId: room.turnOrder[room.currentTurnIndex],
      turn: getTurnState(room),
    });
  }, RESULTS_DISPLAY_TIME * 1000);
}

function advanceTurn(room: Room) {
  if (room.state !== "playing") return;

  clearTurnTimers(room);

  const totalPlayers = room.turnOrder.length;
  for (let i = 1; i <= totalPlayers; i++) {
    const nextIndex = (room.currentTurnIndex + i) % totalPlayers;
    const nextPlayerId = room.turnOrder[nextIndex];
    const nextPlayer = room.players.get(nextPlayerId);
    if (nextPlayer && !nextPlayer.hasGuessedCorrectly) {
      room.currentTurnIndex = nextIndex;
      startTurn(room);
      return;
    }
  }
  // Everyone guessed — checkAllGuessed handles it
}

function checkAllGuessed(room: Room) {
  const allGuessed = Array.from(room.players.values()).every(
    (p) => p.hasGuessedCorrectly
  );
  if (allGuessed && room.state === "playing") {
    emitSystemMsg(room, "Everyone guessed correctly! Round ending...");
    setTimeout(() => endRound(room), 2000);
  }
}

// ─── Round / Game lifecycle ──────────────────────────────────────────────────

function endRound(room: Room) {
  stopTimer(room);
  clearTurnTimers(room);
  room.state = "round-end";

  const reveals = Array.from(room.players.values()).map((p) => {
    const celeb = celebrities.find((c) => c.id === p.celebrityId);
    return {
      playerId: p.id,
      playerName: p.name,
      celebrity: celeb
        ? { name: celeb.name, image: celeb.image, profession: celeb.profession }
        : null,
      guessedCorrectly: p.hasGuessedCorrectly,
    };
  });

  emitSystemMsg(room, `Round ${room.round} ended!`);

  io.to(room.id).emit("round-end", {
    round: room.round,
    reveals,
    roomState: getRoomState(room),
  });

  if (room.round >= room.totalRounds) {
    setTimeout(() => endGame(room), 5000);
  }
}

function endGame(room: Room) {
  room.state = "game-end";
  const finalScores = Array.from(room.players.values())
    .map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, score: p.score }))
    .sort((a, b) => b.score - a.score);
  io.to(room.id).emit("game-end", {
    finalScores,
    roomState: getRoomState(room),
  });
}

function removePlayerFromRoom(room: Room, playerId: string) {
  const player = room.players.get(playerId);
  const wasCurrentTurn =
    room.turnOrder[room.currentTurnIndex] === playerId &&
    room.state === "playing";

  // If this player had a pending vote, remove it
  room.turnPhase.votes.delete(playerId);

  room.players.delete(playerId);

  // Remove from turn order and fix index
  const turnIdx = room.turnOrder.indexOf(playerId);
  if (turnIdx !== -1) {
    room.turnOrder.splice(turnIdx, 1);
    if (room.turnOrder.length > 0) {
      if (turnIdx < room.currentTurnIndex) {
        room.currentTurnIndex--;
      }
      room.currentTurnIndex = room.currentTurnIndex % room.turnOrder.length;
    }
  }

  if (room.players.size === 0) {
    stopTimer(room);
    clearTurnTimers(room);
    for (const timer of room.disconnectTimers.values()) {
      clearTimeout(timer);
    }
    rooms.delete(room.id);
    console.log(`Room ${room.id} deleted (empty)`);
    return;
  }

  // Transfer host if needed
  if (room.hostId === playerId) {
    const newHost = room.players.values().next().value;
    if (newHost) room.hostId = newHost.id;
  }

  if (player) {
    emitSystemMsg(room, `${player.name} left the room`);
  }

  // If it was their turn, start fresh for next player
  if (wasCurrentTurn && room.turnOrder.length > 0 && room.state === "playing") {
    const nextPlayerId = room.turnOrder[room.currentTurnIndex];
    const nextPlayer = room.players.get(nextPlayerId);
    if (nextPlayer && !nextPlayer.hasGuessedCorrectly) {
      startTurn(room);
    } else {
      advanceTurn(room);
    }
  }

  // Check if removing voter completes the vote
  if (
    room.state === "playing" &&
    room.turnPhase.phase === "voting" &&
    !wasCurrentTurn
  ) {
    const askerId = room.turnOrder[room.currentTurnIndex];
    const expectedVoters = Array.from(room.players.keys()).filter(
      (id) => id !== askerId
    );
    const allVoted = expectedVoters.every((id) =>
      room.turnPhase.votes.has(id)
    );
    if (allVoted) finishVoting(room);
  }

  io.to(room.id).emit("room-update", getRoomState(room));
}

// ─── Socket Handlers ─────────────────────────────────────────────────────────

io.on("connection", (socket: Socket) => {
  console.log(`Player connected: ${socket.id}`);

  // CREATE ROOM
  socket.on(
    "create-room",
    (
      data: { playerName: string },
      callback: (r: { success: boolean; roomId?: string; playerId?: string; error?: string }) => void
    ) => {
      const roomId = generateRoomCode();
      const playerId = uuidv4();
      const player: Player = {
        id: playerId, socketId: socket.id, name: data.playerName,
        avatar: AVATARS[0], score: 0, celebrityId: null,
        hasGuessedCorrectly: false, guessedAt: null, disconnectedAt: null,
      };
      const room: Room = {
        id: roomId, hostId: playerId,
        players: new Map([[playerId, player]]),
        state: "lobby", round: 0, totalRounds: TOTAL_ROUNDS,
        timerSeconds: ROUND_TIMER, timerRemaining: ROUND_TIMER,
        timerInterval: null, messages: [], usedCelebrityIds: new Set(),
        roundStartTime: null, disconnectTimers: new Map(),
        turnOrder: [], currentTurnIndex: 0, turnPhase: freshTurnPhase(),
      };
      rooms.set(roomId, room);
      playerRoomMap.set(socket.id, roomId);
      socket.join(roomId);
      console.log(`Room ${roomId} created by ${data.playerName}`);
      callback({ success: true, roomId, playerId });
      io.to(roomId).emit("room-update", getRoomState(room));
    }
  );

  // JOIN ROOM
  socket.on(
    "join-room",
    (
      data: { roomId: string; playerName: string },
      callback: (r: { success: boolean; playerId?: string; error?: string }) => void
    ) => {
      const room = rooms.get(data.roomId.toUpperCase());
      if (!room) { callback({ success: false, error: "Room not found" }); return; }
      if (room.state !== "lobby") { callback({ success: false, error: "Game already in progress" }); return; }
      if (room.players.size >= 8) { callback({ success: false, error: "Room is full (max 8 players)" }); return; }

      const playerId = uuidv4();
      const player: Player = {
        id: playerId, socketId: socket.id, name: data.playerName,
        avatar: AVATARS[room.players.size % AVATARS.length], score: 0,
        celebrityId: null, hasGuessedCorrectly: false, guessedAt: null,
        disconnectedAt: null,
      };
      room.players.set(playerId, player);
      playerRoomMap.set(socket.id, room.id);
      socket.join(room.id);
      emitSystemMsg(room, `${data.playerName} joined the room!`);
      console.log(`${data.playerName} joined room ${room.id}`);
      callback({ success: true, playerId });
      io.to(room.id).emit("room-update", getRoomState(room));
    }
  );

  // REJOIN ROOM
  socket.on(
    "rejoin-room",
    (
      data: { roomId: string; playerId: string },
      callback: (r: { success: boolean; roomState?: ReturnType<typeof getRoomState>; error?: string }) => void
    ) => {
      const room = rooms.get(data.roomId);
      if (!room) { callback({ success: false, error: "Room not found" }); return; }
      const player = room.players.get(data.playerId);
      if (!player) { callback({ success: false, error: "Player not found in room" }); return; }

      const pendingTimer = room.disconnectTimers.get(data.playerId);
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        room.disconnectTimers.delete(data.playerId);
      }
      playerRoomMap.delete(player.socketId);
      player.socketId = socket.id;
      player.disconnectedAt = null;
      playerRoomMap.set(socket.id, room.id);
      socket.join(room.id);
      console.log(`${player.name} rejoined room ${room.id}`);
      callback({ success: true, roomState: getRoomState(room) });
    }
  );

  // START GAME
  socket.on("start-game", (data: { roomId: string; playerId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room || room.hostId !== data.playerId) return;
    if (room.players.size < 2) {
      socket.emit("error-message", { message: "Need at least 2 players to start" });
      return;
    }
    room.state = "playing";
    room.round = 1;
    room.turnOrder = Array.from(room.players.keys());
    room.currentTurnIndex = 0;
    assignCelebrities(room);
    startTimer(room);

    const firstPlayer = room.players.get(room.turnOrder[0]);
    room.turnPhase = freshTurnPhase();

    emitSystemMsg(room, `Game started! Round 1 of ${room.totalRounds}. ${firstPlayer?.name} goes first!`);
    io.to(room.id).emit("game-started", getRoomState(room));
  });

  // NEXT ROUND
  socket.on("next-round", (data: { roomId: string; playerId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room || room.hostId !== data.playerId) return;
    if (room.state !== "round-end" || room.round >= room.totalRounds) return;

    room.round++;
    room.state = "playing";
    room.turnOrder = Array.from(room.players.keys());
    room.currentTurnIndex = 0;
    room.turnPhase = freshTurnPhase();
    assignCelebrities(room);
    startTimer(room);

    const firstPlayer = room.players.get(room.turnOrder[0]);
    emitSystemMsg(room, `Round ${room.round} of ${room.totalRounds} started! ${firstPlayer?.name} goes first!`);
    io.to(room.id).emit("game-started", getRoomState(room));
  });

  // ASK QUESTION — player submits their one question for this turn
  socket.on(
    "ask-question",
    (data: { roomId: string; playerId: string; question: string }) => {
      const room = rooms.get(data.roomId);
      if (!room || room.state !== "playing") return;
      if (room.turnOrder[room.currentTurnIndex] !== data.playerId) return;
      if (room.turnPhase.phase !== "asking") return;
      if (!data.question.trim()) return;

      const player = room.players.get(data.playerId);
      if (!player) return;

      room.turnPhase.question = data.question.trim();

      // Add as chat message
      const msg: ChatMessage = {
        id: uuidv4(),
        playerId: data.playerId,
        playerName: player.name,
        text: data.question.trim(),
        type: "question",
        timestamp: Date.now(),
      };
      room.messages.push(msg);
      io.to(room.id).emit("new-message", msg);

      startVoting(room);
    }
  );

  // SUBMIT VOTE — other players vote yes/no
  socket.on(
    "submit-vote",
    (data: { roomId: string; playerId: string; vote: "yes" | "no" }) => {
      const room = rooms.get(data.roomId);
      if (!room || room.state !== "playing") return;
      if (room.turnPhase.phase !== "voting") return;

      // Can't vote on your own question
      const askerId = room.turnOrder[room.currentTurnIndex];
      if (data.playerId === askerId) return;

      // Can't vote twice
      if (room.turnPhase.votes.has(data.playerId)) return;

      const player = room.players.get(data.playerId);
      if (!player) return;

      room.turnPhase.votes.set(data.playerId, {
        playerId: data.playerId,
        playerName: player.name,
        vote: data.vote,
      });

      // Broadcast vote update to everyone (live results)
      io.to(room.id).emit("turn-update", {
        currentTurnPlayerId: askerId,
        turn: getTurnState(room),
      });

      // Check if all non-asker players have voted
      const expectedVoters = Array.from(room.players.keys()).filter(
        (id) => id !== askerId
      );
      const allVoted = expectedVoters.every((id) =>
        room.turnPhase.votes.has(id)
      );
      if (allVoted) {
        finishVoting(room);
      }
    }
  );

  // SUBMIT GUESS — only during guessing phase of your turn
  socket.on(
    "submit-guess",
    (
      data: { roomId: string; playerId: string; guess: string },
      callback: (r: { correct: boolean; celebrityName?: string }) => void
    ) => {
      const room = rooms.get(data.roomId);
      if (!room || room.state !== "playing") return;

      const player = room.players.get(data.playerId);
      if (!player || player.hasGuessedCorrectly) return;
      if (room.turnOrder[room.currentTurnIndex] !== data.playerId) {
        callback({ correct: false });
        return;
      }
      if (room.turnPhase.phase !== "guessing") {
        callback({ correct: false });
        return;
      }

      const celebrity = celebrities.find((c) => c.id === player.celebrityId);
      if (!celebrity) return;

      const correct = checkGuess(data.guess, celebrity);

      if (correct) {
        player.hasGuessedCorrectly = true;
        player.guessedAt = Date.now();

        const elapsed = room.roundStartTime
          ? (Date.now() - room.roundStartTime) / 1000
          : ROUND_TIMER;
        const timeBonus = Math.max(0, Math.round(100 * (1 - elapsed / ROUND_TIMER)));
        player.score += 100 + timeBonus;

        emitSystemMsg(room, `🎉 ${player.name} guessed correctly! (+${100 + timeBonus} points)`, "guess-correct");
        io.to(room.id).emit("room-update", getRoomState(room));
        io.to(room.id).emit("guess-result", {
          playerId: data.playerId,
          correct: true,
          celebrity: { name: celebrity.name, image: celebrity.image },
        });

        callback({ correct: true, celebrityName: celebrity.name });
        checkAllGuessed(room);
        if (room.state === "playing") advanceTurn(room);
      } else {
        const wrongMsg: ChatMessage = {
          id: uuidv4(),
          playerId: data.playerId,
          playerName: player.name,
          text: `Guessed "${data.guess}" — Wrong!`,
          type: "guess-wrong",
          timestamp: Date.now(),
        };
        room.messages.push(wrongMsg);
        io.to(room.id).emit("new-message", wrongMsg);
        callback({ correct: false });

        // Wrong guess ends your turn
        advanceTurn(room);
      }
    }
  );

  // SKIP TURN — player chooses not to guess after seeing poll results
  socket.on("skip-turn", (data: { roomId: string; playerId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room || room.state !== "playing") return;
    if (room.turnOrder[room.currentTurnIndex] !== data.playerId) return;
    if (room.turnPhase.phase !== "guessing") return;

    const player = room.players.get(data.playerId);
    if (!player) return;

    emitSystemMsg(room, `${player.name} skipped their guess.`);
    advanceTurn(room);
  });

  // PLAY AGAIN
  socket.on("play-again", (data: { roomId: string; playerId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room || room.hostId !== data.playerId) return;

    clearTurnTimers(room);
    room.state = "lobby";
    room.round = 0;
    room.turnOrder = [];
    room.currentTurnIndex = 0;
    room.turnPhase = freshTurnPhase();
    room.usedCelebrityIds.clear();
    room.messages = [];
    for (const player of room.players.values()) {
      player.score = 0;
      player.celebrityId = null;
      player.hasGuessedCorrectly = false;
      player.guessedAt = null;
    }
    io.to(room.id).emit("room-update", getRoomState(room));
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const roomId = playerRoomMap.get(socket.id);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    let disconnectedPlayer: Player | null = null;
    let disconnectedPlayerId: string | null = null;
    for (const [id, player] of room.players) {
      if (player.socketId === socket.id) {
        disconnectedPlayer = player;
        disconnectedPlayerId = id;
        break;
      }
    }
    playerRoomMap.delete(socket.id);
    if (!disconnectedPlayer || !disconnectedPlayerId) return;

    disconnectedPlayer.disconnectedAt = Date.now();
    console.log(`${disconnectedPlayer.name} disconnected, grace period started`);

    const pid = disconnectedPlayerId;
    const timer = setTimeout(() => {
      if (disconnectedPlayer?.disconnectedAt) {
        console.log(`Grace period expired for ${disconnectedPlayer.name}`);
        room.disconnectTimers.delete(pid);
        removePlayerFromRoom(room, pid);
      }
    }, DISCONNECT_GRACE_MS);
    room.disconnectTimers.set(pid, timer);
  });
});

// ─── Health check & Start ────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎮 Game server running on http://localhost:${PORT}`);
});

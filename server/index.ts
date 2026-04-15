import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import celebrities, { checkGuess, Celebrity } from "../lib/celebrities";

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
  disconnectedAt: number | null; // grace period tracking
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  type: "question" | "answer" | "system" | "guess-correct" | "guess-wrong";
  timestamp: number;
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
  disconnectTimers: Map<string, NodeJS.Timeout>; // playerId -> cleanup timer
  turnOrder: string[]; // player IDs in turn order
  currentTurnIndex: number;
}

// ─── State ───────────────────────────────────────────────────────────────────

const rooms = new Map<string, Room>();
const playerRoomMap = new Map<string, string>(); // socketId -> roomId

const AVATARS = ["🧑", "👩", "🧔", "👱", "👲", "🧕", "👨‍🦱", "👩‍🦰"];
const ROUND_TIMER = 180; // 3 minutes
const TOTAL_ROUNDS = 3;
const DISCONNECT_GRACE_MS = 15000; // 15 seconds to reconnect

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

function endRound(room: Room) {
  stopTimer(room);
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

  const systemMsg: ChatMessage = {
    id: uuidv4(),
    playerId: "system",
    playerName: "System",
    text: `Round ${room.round} ended!`,
    type: "system",
    timestamp: Date.now(),
  };
  room.messages.push(systemMsg);

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
    .map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
    }))
    .sort((a, b) => b.score - a.score);

  io.to(room.id).emit("game-end", {
    finalScores,
    roomState: getRoomState(room),
  });
}

function checkAllGuessed(room: Room) {
  const allGuessed = Array.from(room.players.values()).every(
    (p) => p.hasGuessedCorrectly
  );
  if (allGuessed && room.state === "playing") {
    const systemMsg: ChatMessage = {
      id: uuidv4(),
      playerId: "system",
      playerName: "System",
      text: "Everyone guessed correctly! Round ending...",
      type: "system",
      timestamp: Date.now(),
    };
    room.messages.push(systemMsg);
    io.to(room.id).emit("new-message", systemMsg);
    setTimeout(() => endRound(room), 2000);
  }
}

function advanceTurn(room: Room) {
  if (room.state !== "playing") return;

  // Find next player who hasn't guessed correctly
  const totalPlayers = room.turnOrder.length;
  for (let i = 1; i <= totalPlayers; i++) {
    const nextIndex = (room.currentTurnIndex + i) % totalPlayers;
    const nextPlayerId = room.turnOrder[nextIndex];
    const nextPlayer = room.players.get(nextPlayerId);
    if (nextPlayer && !nextPlayer.hasGuessedCorrectly) {
      room.currentTurnIndex = nextIndex;
      const turnMsg: ChatMessage = {
        id: uuidv4(),
        playerId: "system",
        playerName: "System",
        text: `It's ${nextPlayer.name}'s turn to guess!`,
        type: "system",
        timestamp: Date.now(),
      };
      room.messages.push(turnMsg);
      io.to(room.id).emit("new-message", turnMsg);
      io.to(room.id).emit("turn-change", {
        currentTurnPlayerId: nextPlayerId,
      });
      return;
    }
  }
  // If we get here, everyone has guessed — checkAllGuessed will handle it
}

function removePlayerFromRoom(room: Room, playerId: string) {
  const player = room.players.get(playerId);

  // If it was this player's turn, advance before removing
  const wasCurrentTurn =
    room.turnOrder[room.currentTurnIndex] === playerId &&
    room.state === "playing";

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

  if (wasCurrentTurn && room.turnOrder.length > 0 && room.state === "playing") {
    // Announce new turn after removal
    const nextPlayerId = room.turnOrder[room.currentTurnIndex];
    const nextPlayer = room.players.get(nextPlayerId);
    if (nextPlayer && !nextPlayer.hasGuessedCorrectly) {
      io.to(room.id).emit("turn-change", { currentTurnPlayerId: nextPlayerId });
    } else {
      advanceTurn(room);
    }
  }

  if (room.players.size === 0) {
    stopTimer(room);
    // Clear any remaining disconnect timers
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
    if (newHost) {
      room.hostId = newHost.id;
    }
  }

  if (player) {
    const systemMsg: ChatMessage = {
      id: uuidv4(),
      playerId: "system",
      playerName: "System",
      text: `${player.name} left the room`,
      type: "system",
      timestamp: Date.now(),
    };
    room.messages.push(systemMsg);
    io.to(room.id).emit("new-message", systemMsg);
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
      callback: (response: {
        success: boolean;
        roomId?: string;
        playerId?: string;
        error?: string;
      }) => void
    ) => {
      const roomId = generateRoomCode();
      const playerId = uuidv4();

      const player: Player = {
        id: playerId,
        socketId: socket.id,
        name: data.playerName,
        avatar: AVATARS[0],
        score: 0,
        celebrityId: null,
        hasGuessedCorrectly: false,
        guessedAt: null,
        disconnectedAt: null,
      };

      const room: Room = {
        id: roomId,
        hostId: playerId,
        players: new Map([[playerId, player]]),
        state: "lobby",
        round: 0,
        totalRounds: TOTAL_ROUNDS,
        timerSeconds: ROUND_TIMER,
        timerRemaining: ROUND_TIMER,
        timerInterval: null,
        messages: [],
        usedCelebrityIds: new Set(),
        roundStartTime: null,
        disconnectTimers: new Map(),
        turnOrder: [],
        currentTurnIndex: 0,
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
      callback: (response: {
        success: boolean;
        playerId?: string;
        error?: string;
      }) => void
    ) => {
      const room = rooms.get(data.roomId.toUpperCase());

      if (!room) {
        callback({ success: false, error: "Room not found" });
        return;
      }
      if (room.state !== "lobby") {
        callback({ success: false, error: "Game already in progress" });
        return;
      }
      if (room.players.size >= 8) {
        callback({ success: false, error: "Room is full (max 8 players)" });
        return;
      }

      const playerId = uuidv4();
      const avatarIndex = room.players.size % AVATARS.length;

      const player: Player = {
        id: playerId,
        socketId: socket.id,
        name: data.playerName,
        avatar: AVATARS[avatarIndex],
        score: 0,
        celebrityId: null,
        hasGuessedCorrectly: false,
        guessedAt: null,
        disconnectedAt: null,
      };

      room.players.set(playerId, player);
      playerRoomMap.set(socket.id, room.id);
      socket.join(room.id);

      const systemMsg: ChatMessage = {
        id: uuidv4(),
        playerId: "system",
        playerName: "System",
        text: `${data.playerName} joined the room!`,
        type: "system",
        timestamp: Date.now(),
      };
      room.messages.push(systemMsg);

      console.log(`${data.playerName} joined room ${room.id}`);
      callback({ success: true, playerId });
      io.to(room.id).emit("room-update", getRoomState(room));
      io.to(room.id).emit("new-message", systemMsg);
    }
  );

  // REJOIN ROOM — reconnect an existing player after page navigation / reconnect
  socket.on(
    "rejoin-room",
    (
      data: { roomId: string; playerId: string },
      callback: (response: {
        success: boolean;
        roomState?: ReturnType<typeof getRoomState>;
        error?: string;
      }) => void
    ) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        callback({ success: false, error: "Room not found" });
        return;
      }

      const player = room.players.get(data.playerId);
      if (!player) {
        callback({ success: false, error: "Player not found in room" });
        return;
      }

      // Cancel any pending disconnect cleanup for this player
      const pendingTimer = room.disconnectTimers.get(data.playerId);
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        room.disconnectTimers.delete(data.playerId);
        console.log(`Cancelled disconnect timer for ${player.name}`);
      }

      // Update socket mapping
      const oldSocketId = player.socketId;
      playerRoomMap.delete(oldSocketId);
      player.socketId = socket.id;
      player.disconnectedAt = null;
      playerRoomMap.set(socket.id, room.id);
      socket.join(room.id);

      console.log(
        `${player.name} rejoined room ${room.id} (new socket: ${socket.id})`
      );
      callback({ success: true, roomState: getRoomState(room) });
    }
  );

  // START GAME
  socket.on("start-game", (data: { roomId: string; playerId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    if (room.hostId !== data.playerId) return;
    if (room.players.size < 2) {
      socket.emit("error-message", {
        message: "Need at least 2 players to start",
      });
      return;
    }

    room.state = "playing";
    room.round = 1;
    room.turnOrder = Array.from(room.players.keys());
    room.currentTurnIndex = 0;
    assignCelebrities(room);
    startTimer(room);

    const firstPlayer = room.players.get(room.turnOrder[0]);
    const systemMsg: ChatMessage = {
      id: uuidv4(),
      playerId: "system",
      playerName: "System",
      text: `Game started! Round 1 of ${room.totalRounds}. ${firstPlayer?.name} goes first!`,
      type: "system",
      timestamp: Date.now(),
    };
    room.messages.push(systemMsg);

    io.to(room.id).emit("game-started", getRoomState(room));
    io.to(room.id).emit("new-message", systemMsg);
  });

  // NEXT ROUND
  socket.on("next-round", (data: { roomId: string; playerId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    if (room.hostId !== data.playerId) return;
    if (room.state !== "round-end") return;
    if (room.round >= room.totalRounds) return;

    room.round++;
    room.state = "playing";
    room.turnOrder = Array.from(room.players.keys());
    room.currentTurnIndex = 0;
    assignCelebrities(room);
    startTimer(room);

    const firstPlayer = room.players.get(room.turnOrder[0]);
    const systemMsg: ChatMessage = {
      id: uuidv4(),
      playerId: "system",
      playerName: "System",
      text: `Round ${room.round} of ${room.totalRounds} started! ${firstPlayer?.name} goes first!`,
      type: "system",
      timestamp: Date.now(),
    };
    room.messages.push(systemMsg);

    io.to(room.id).emit("game-started", getRoomState(room));
    io.to(room.id).emit("new-message", systemMsg);
  });

  // SEND MESSAGE (chat for Q&A)
  socket.on(
    "send-message",
    (data: {
      roomId: string;
      playerId: string;
      text: string;
      type: "question" | "answer";
    }) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const player = room.players.get(data.playerId);
      if (!player) return;

      const message: ChatMessage = {
        id: uuidv4(),
        playerId: data.playerId,
        playerName: player.name,
        text: data.text,
        type: data.type,
        timestamp: Date.now(),
      };

      room.messages.push(message);
      io.to(room.id).emit("new-message", message);
    }
  );

  // SUBMIT GUESS
  socket.on(
    "submit-guess",
    (
      data: { roomId: string; playerId: string; guess: string },
      callback: (response: {
        correct: boolean;
        celebrityName?: string;
      }) => void
    ) => {
      const room = rooms.get(data.roomId);
      if (!room || room.state !== "playing") return;

      const player = room.players.get(data.playerId);
      if (!player || player.hasGuessedCorrectly) return;

      // Enforce turn order: only the current turn player can guess
      if (room.turnOrder[room.currentTurnIndex] !== data.playerId) {
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
        const timeBonus = Math.max(
          0,
          Math.round(100 * (1 - elapsed / ROUND_TIMER))
        );
        player.score += 100 + timeBonus;

        const systemMsg: ChatMessage = {
          id: uuidv4(),
          playerId: "system",
          playerName: "System",
          text: `🎉 ${player.name} guessed correctly! (+${100 + timeBonus} points)`,
          type: "guess-correct",
          timestamp: Date.now(),
        };
        room.messages.push(systemMsg);
        io.to(room.id).emit("new-message", systemMsg);
        io.to(room.id).emit("room-update", getRoomState(room));
        io.to(room.id).emit("guess-result", {
          playerId: data.playerId,
          correct: true,
          celebrity: {
            name: celebrity.name,
            image: celebrity.image,
          },
        });

        callback({ correct: true, celebrityName: celebrity.name });
        checkAllGuessed(room);

        // Advance turn (if round didn't end from checkAllGuessed)
        if (room.state === "playing") {
          advanceTurn(room);
        }
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

        // Wrong guess also ends your turn
        advanceTurn(room);
      }
    }
  );

  // PLAY AGAIN
  socket.on("play-again", (data: { roomId: string; playerId: string }) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    if (room.hostId !== data.playerId) return;

    room.state = "lobby";
    room.round = 0;
    room.turnOrder = [];
    room.currentTurnIndex = 0;
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

  // DISCONNECT — start grace period instead of immediately removing
  socket.on("disconnect", () => {
    const roomId = playerRoomMap.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Find the player by socketId
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

    // Mark as disconnected and start grace period
    disconnectedPlayer.disconnectedAt = Date.now();
    console.log(
      `${disconnectedPlayer.name} disconnected from room ${roomId}, grace period started (${DISCONNECT_GRACE_MS / 1000}s)`
    );

    const timer = setTimeout(() => {
      // If still disconnected after grace period, remove them
      if (disconnectedPlayerId && disconnectedPlayer?.disconnectedAt) {
        console.log(
          `Grace period expired for ${disconnectedPlayer.name}, removing from room ${roomId}`
        );
        room.disconnectTimers.delete(disconnectedPlayerId);
        removePlayerFromRoom(room, disconnectedPlayerId);
      }
    }, DISCONNECT_GRACE_MS);

    if (disconnectedPlayerId) {
      room.disconnectTimers.set(disconnectedPlayerId, timer);
    }
  });
});

// ─── Health check ────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎮 Game server running on http://localhost:${PORT}`);
});

export interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  score: number;
  celebrityId: number | null;
  hasGuessedCorrectly: boolean;
}

export interface RoomState {
  id: string;
  hostId: string;
  players: PlayerState[];
  state: "lobby" | "playing" | "round-end" | "game-end";
  round: number;
  totalRounds: number;
  timerRemaining: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  type: "question" | "answer" | "system" | "guess-correct" | "guess-wrong";
  timestamp: number;
}

export interface CelebrityReveal {
  playerId: string;
  playerName: string;
  celebrity: {
    name: string;
    image: string;
    profession: string;
  } | null;
  guessedCorrectly: boolean;
}

export interface FinalScore {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

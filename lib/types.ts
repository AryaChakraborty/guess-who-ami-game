export interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  score: number;
  celebrityId: number | null;
  hasGuessedCorrectly: boolean;
}

export interface Vote {
  playerId: string;
  playerName: string;
  vote: "yes" | "no";
}

export interface TurnState {
  phase: "asking" | "voting" | "results" | "guessing";
  askingPlayerId: string;
  askingPlayerName: string;
  question: string | null;
  votes: Vote[];
  voteTimerRemaining: number;
  totalVoters: number; // how many need to vote (everyone except asker)
  guessAttempts: number; // wrong-but-close guesses used so far this turn
  maxGuessAttempts: number; // hard limit (3)
  isFinalTurn: boolean; // only one player left who hasn't guessed; failing ends the round
  hasAsked: boolean; // whether the current player has already submitted their question
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
  turnOrder: string[];
  currentTurnPlayerId: string | null;
  turn: TurnState | null;
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

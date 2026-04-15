type SoundName =
  | "tick"
  | "tock"
  | "timer-warning"
  | "game-start"
  | "your-turn"
  | "question"
  | "vote"
  | "correct"
  | "wrong"
  | "round-end"
  | "game-over"
  | "skip"
  | "lobby";

const SOUND_FILES: Record<SoundName, string> = {
  tick: "/sounds/tick.mp3",
  tock: "/sounds/tock.mp3",
  "timer-warning": "/sounds/timer-warning.mp3",
  "game-start": "/sounds/game-start.mp3",
  "your-turn": "/sounds/your-turn.mp3",
  question: "/sounds/question.mp3",
  vote: "/sounds/vote.mp3",
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  "round-end": "/sounds/round-end.mp3",
  "game-over": "/sounds/game-over.mp3",
  skip: "/sounds/skip.mp3",
  lobby: "/sounds/lobby.mp3",
};

class SoundManager {
  private cache = new Map<SoundName, HTMLAudioElement>();
  private _muted = false;
  private _volume = 0.7;
  private lobbyAudio: HTMLAudioElement | null = null;

  get muted() {
    return this._muted;
  }

  get volume() {
    return this._volume;
  }

  private getAudio(name: SoundName): HTMLAudioElement {
    let audio = this.cache.get(name);
    if (!audio) {
      audio = new Audio(SOUND_FILES[name]);
      this.cache.set(name, audio);
    }
    return audio;
  }

  play(name: SoundName) {
    if (this._muted) return;
    try {
      const audio = this.getAudio(name);
      audio.volume = this._volume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Browser may block autoplay before user interaction — ignore
      });
    } catch {
      // Ignore audio errors
    }
  }

  startLobbyMusic() {
    if (this._muted) return;
    try {
      if (!this.lobbyAudio) {
        this.lobbyAudio = new Audio(SOUND_FILES.lobby);
        this.lobbyAudio.loop = true;
      }
      this.lobbyAudio.volume = this._volume * 0.4; // quieter background
      this.lobbyAudio.play().catch(() => {});
    } catch {
      // Ignore
    }
  }

  stopLobbyMusic() {
    if (this.lobbyAudio) {
      this.lobbyAudio.pause();
      this.lobbyAudio.currentTime = 0;
    }
  }

  setMuted(muted: boolean) {
    this._muted = muted;
    if (muted) {
      this.stopLobbyMusic();
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("sound-muted", muted ? "1" : "0");
    }
  }

  setVolume(volume: number) {
    this._volume = Math.max(0, Math.min(1, volume));
    if (this.lobbyAudio) {
      this.lobbyAudio.volume = this._volume * 0.4;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("sound-volume", String(this._volume));
    }
  }

  loadPreferences() {
    if (typeof window === "undefined") return;
    const muted = localStorage.getItem("sound-muted");
    if (muted === "1") this._muted = true;
    const vol = localStorage.getItem("sound-volume");
    if (vol) this._volume = parseFloat(vol);
  }
}

// Singleton
let instance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!instance) {
    instance = new SoundManager();
    instance.loadPreferences();
  }
  return instance;
}

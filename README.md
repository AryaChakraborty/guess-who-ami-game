# Celebrity Head

A real-time multiplayer party game where players see celebrity images on other players' heads but not their own. Ask yes/no questions to figure out who you are!

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Socket.io](https://img.shields.io/badge/Socket.io-4-white?logo=socket.io)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

## How It Works

1. **Create a room** and share the 5-character code with friends
2. Each player gets a random celebrity assigned to their "head"
3. You can see everyone else's celebrity, but yours shows as **"? Who am I?"**
4. Ask yes/no questions in the chat (e.g., "Am I a musician?", "Am I American?")
5. Other players answer your questions
6. When you think you know, **submit your guess** to score points
7. Faster guesses earn bonus points!

## Features

- **Real-time multiplayer** via Socket.io (2-8 players per room)
- **70 curated celebrities** across actors, musicians, athletes, and more
- **Room system** with lobby, room codes, and host controls
- **Live chat** with dedicated Question/Answer message types
- **Scoring** with time bonus (guess faster = more points)
- **3 rounds** per game, 3-minute timer per round
- **Round reveals** showing who everyone was
- **Reconnection support** with 15-second grace period
- **Mobile-responsive** dark-themed UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start both the Next.js frontend and Socket.io game server
npm run dev
```

This runs two servers concurrently:
- **Frontend** — `http://localhost:3000`
- **Game server** — `http://localhost:3001`

Open `http://localhost:3000` in your browser, enter your name, and create a room. Share the room code with a friend (they open the same URL and join with the code).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and game server |
| `npm run dev:next` | Start only the Next.js frontend |
| `npm run dev:server` | Start only the Socket.io server |
| `npm run build` | Build the Next.js app for production |
| `npm run lint` | Run ESLint |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS |
| Real-time | Socket.io |
| Game server | Express + Socket.io |
| Language | TypeScript |
| Celebrity data | Curated JSON with Wikimedia Commons images |

## Project Structure

```
app/
  page.tsx                    Landing page (create/join room)
  room/[roomId]/page.tsx      Game room (lobby, playing, results)
components/
  GameGrid.tsx                Player grid with celebrity images
  ChatPanel.tsx               Real-time Q&A chat
  Scoreboard.tsx              Live score rankings
  Timer.tsx                   Round countdown timer
  GuessInput.tsx              Celebrity guess submission
lib/
  socket.ts                   Socket.io client (singleton + reconnect)
  celebrities.ts              70 curated celebrities with metadata
  types.ts                    Shared TypeScript interfaces
server/
  index.ts                    Express + Socket.io game server
```

## Game Rules

- **Rounds:** 3 rounds per game
- **Timer:** 3 minutes per round
- **Scoring:** 100 base points + up to 100 time bonus for correct guesses
- **Celebrities:** Mix of actors (30%), musicians (25%), athletes (25%), and others (20%)
- No duplicate celebrities within the same game session
- If everyone guesses correctly, the round ends early

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `create-room` | Client -> Server | Create a new room |
| `join-room` | Client -> Server | Join an existing room |
| `rejoin-room` | Client -> Server | Reconnect after page navigation |
| `start-game` | Client -> Server | Host starts the game |
| `send-message` | Client -> Server | Send a chat message |
| `submit-guess` | Client -> Server | Guess your celebrity |
| `next-round` | Client -> Server | Host starts next round |
| `play-again` | Client -> Server | Host restarts the game |
| `room-update` | Server -> Client | Full room state sync |
| `game-started` | Server -> Client | Game/round began |
| `new-message` | Server -> Client | New chat message |
| `timer-tick` | Server -> Client | Timer countdown |
| `guess-result` | Server -> Client | Guess outcome + reveal |
| `round-end` | Server -> Client | Round results with reveals |
| `game-end` | Server -> Client | Final scores |

## License

MIT

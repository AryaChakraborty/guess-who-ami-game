#!/bin/bash
# Generate game sound effects using ffmpeg
# All sounds are short, game-appropriate, and royalty-free (synthesized)

OUT="$(dirname "$0")/../public/sounds"
mkdir -p "$OUT"

SR=44100  # sample rate

echo "Generating game sound effects..."

# ─── TICK (clock tick - short percussive click) ──────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=800:duration=0.05" \
  -af "afade=t=out:st=0.02:d=0.03,highpass=f=400,volume=0.6" \
  "$OUT/tick.mp3" 2>/dev/null
echo "  tick.mp3"

# ─── TOCK (slightly lower tick for alternation) ─────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=600:duration=0.05" \
  -af "afade=t=out:st=0.02:d=0.03,highpass=f=300,volume=0.6" \
  "$OUT/tock.mp3" 2>/dev/null
echo "  tock.mp3"

# ─── TIMER WARNING (urgent fast beep for last 10s) ──────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=1000:duration=0.08" \
  -af "afade=t=in:d=0.01,afade=t=out:st=0.04:d=0.04,volume=0.7" \
  "$OUT/timer-warning.mp3" 2>/dev/null
echo "  timer-warning.mp3"

# ─── GAME START (ascending arpeggio C-E-G-C) ────────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=523:duration=0.15" \
  -f lavfi -i "sine=frequency=659:duration=0.15" \
  -f lavfi -i "sine=frequency=784:duration=0.15" \
  -f lavfi -i "sine=frequency=1047:duration=0.3" \
  -filter_complex "\
    [0]afade=t=in:d=0.02,afade=t=out:st=0.1:d=0.05[a];\
    [1]afade=t=in:d=0.02,afade=t=out:st=0.1:d=0.05,adelay=150|150[b];\
    [2]afade=t=in:d=0.02,afade=t=out:st=0.1:d=0.05,adelay=300|300[c];\
    [3]afade=t=in:d=0.02,afade=t=out:st=0.2:d=0.1,adelay=450|450[d];\
    [a][b][c][d]amix=inputs=4:duration=longest,volume=2.5" \
  "$OUT/game-start.mp3" 2>/dev/null
echo "  game-start.mp3"

# ─── YOUR TURN (two-note doorbell chime) ────────────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=880:duration=0.2" \
  -f lavfi -i "sine=frequency=1175:duration=0.3" \
  -filter_complex "\
    [0]afade=t=in:d=0.01,afade=t=out:st=0.1:d=0.1[a];\
    [1]afade=t=in:d=0.01,afade=t=out:st=0.15:d=0.15,adelay=200|200[b];\
    [a][b]amix=inputs=2:duration=longest,volume=1.8" \
  "$OUT/your-turn.mp3" 2>/dev/null
echo "  your-turn.mp3"

# ─── QUESTION SUBMITTED (soft rising chime) ─────────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=660:duration=0.12" \
  -f lavfi -i "sine=frequency=880:duration=0.18" \
  -filter_complex "\
    [0]afade=t=out:st=0.06:d=0.06[a];\
    [1]afade=t=out:st=0.1:d=0.08,adelay=100|100[b];\
    [a][b]amix=inputs=2:duration=longest,volume=1.5" \
  "$OUT/question.mp3" 2>/dev/null
echo "  question.mp3"

# ─── VOTE CLICK (short pop/click) ───────────────────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=1200:duration=0.04" \
  -af "afade=t=out:st=0.01:d=0.03,volume=0.5" \
  "$OUT/vote.mp3" 2>/dev/null
echo "  vote.mp3"

# ─── CORRECT GUESS (happy ascending melody) ─────────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=523:duration=0.12" \
  -f lavfi -i "sine=frequency=659:duration=0.12" \
  -f lavfi -i "sine=frequency=784:duration=0.12" \
  -f lavfi -i "sine=frequency=1047:duration=0.12" \
  -f lavfi -i "sine=frequency=1319:duration=0.35" \
  -filter_complex "\
    [0]afade=t=out:st=0.08:d=0.04[a];\
    [1]afade=t=out:st=0.08:d=0.04,adelay=100|100[b];\
    [2]afade=t=out:st=0.08:d=0.04,adelay=200|200[c];\
    [3]afade=t=out:st=0.08:d=0.04,adelay=300|300[d];\
    [4]afade=t=in:d=0.02,afade=t=out:st=0.2:d=0.15,adelay=400|400[e];\
    [a][b][c][d][e]amix=inputs=5:duration=longest,volume=3.0" \
  "$OUT/correct.mp3" 2>/dev/null
echo "  correct.mp3"

# ─── WRONG GUESS (descending buzz) ──────────────────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=400:duration=0.15" \
  -f lavfi -i "sine=frequency=300:duration=0.3" \
  -filter_complex "\
    [0]afade=t=out:st=0.1:d=0.05[a];\
    [1]afade=t=in:d=0.02,afade=t=out:st=0.15:d=0.15,adelay=150|150[b];\
    [a][b]amix=inputs=2:duration=longest,volume=1.5" \
  "$OUT/wrong.mp3" 2>/dev/null
echo "  wrong.mp3"

# ─── ROUND END (dramatic resolve chord) ─────────────────────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=523:duration=0.6" \
  -f lavfi -i "sine=frequency=659:duration=0.6" \
  -f lavfi -i "sine=frequency=784:duration=0.6" \
  -filter_complex "\
    [0]afade=t=in:d=0.05,afade=t=out:st=0.3:d=0.3[a];\
    [1]afade=t=in:d=0.05,afade=t=out:st=0.3:d=0.3[b];\
    [2]afade=t=in:d=0.05,afade=t=out:st=0.3:d=0.3[c];\
    [a][b][c]amix=inputs=3:duration=longest,volume=2.0" \
  "$OUT/round-end.mp3" 2>/dev/null
echo "  round-end.mp3"

# ─── GAME OVER (grand fanfare - rising then resolving) ──────────────────────
ffmpeg -y -f lavfi -i "sine=frequency=392:duration=0.2" \
  -f lavfi -i "sine=frequency=494:duration=0.2" \
  -f lavfi -i "sine=frequency=587:duration=0.2" \
  -f lavfi -i "sine=frequency=784:duration=0.5" \
  -f lavfi -i "sine=frequency=988:duration=0.5" \
  -f lavfi -i "sine=frequency=1175:duration=0.5" \
  -filter_complex "\
    [0]afade=t=out:st=0.12:d=0.08[a];\
    [1]afade=t=out:st=0.12:d=0.08,adelay=200|200[b];\
    [2]afade=t=out:st=0.12:d=0.08,adelay=400|400[c];\
    [3]afade=t=in:d=0.03,afade=t=out:st=0.3:d=0.2,adelay=600|600[d];\
    [4]afade=t=in:d=0.03,afade=t=out:st=0.3:d=0.2,adelay=600|600[e];\
    [5]afade=t=in:d=0.03,afade=t=out:st=0.3:d=0.2,adelay=600|600[f];\
    [a][b][c][d][e][f]amix=inputs=6:duration=longest,volume=3.0" \
  "$OUT/game-over.mp3" 2>/dev/null
echo "  game-over.mp3"

# ─── SKIP TURN (quick descending whoosh) ────────────────────────────────────
ffmpeg -y -f lavfi -i "anoisesrc=d=0.25:c=pink:s=$SR" \
  -af "afade=t=in:d=0.02,afade=t=out:st=0.1:d=0.15,highpass=f=500,lowpass=f=3000,volume=0.3" \
  "$OUT/skip.mp3" 2>/dev/null
echo "  skip.mp3"

# ─── LOBBY MUSIC (gentle ambient loop - layered sine pads) ──────────────────
ffmpeg -y -f lavfi -i "sine=frequency=262:duration=8" \
  -f lavfi -i "sine=frequency=330:duration=8" \
  -f lavfi -i "sine=frequency=392:duration=8" \
  -f lavfi -i "sine=frequency=523:duration=8" \
  -filter_complex "\
    [0]volume=0.15,atremolo=f=0.3:d=0.4[a];\
    [1]volume=0.12,atremolo=f=0.25:d=0.3[b];\
    [2]volume=0.10,atremolo=f=0.2:d=0.3[c];\
    [3]volume=0.08,atremolo=f=0.35:d=0.2[d];\
    [a][b][c][d]amix=inputs=4:duration=longest,\
    afade=t=in:d=1,afade=t=out:st=6.5:d=1.5,volume=2.0" \
  "$OUT/lobby.mp3" 2>/dev/null
echo "  lobby.mp3"

echo "Done! All sounds generated in $OUT/"
ls -la "$OUT/"

# 🎵 Booze Groove

A music-based drinking game web app built with React + Vite. Play with friends at a party — guess songs, earn points, and dish out drinks!

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm 8+

### Install & Run

```bash
npm install
npm run dev
```

The app opens at **http://localhost:3000**

---

## 🎮 Game Modes

| Mode | Description |
|------|-------------|
| 🎵 Classic | Everyone plays individually, take turns |
| 🏆 Competitive | Points based, loser drinks each round |
| ⚔️ Team Battle | Teams compete, losing team drinks |
| ⚡ Speed Round | Beat the timer or drink double |
| 🎲 Party Chaos | Random rules every round, expect chaos |

---

## 🎧 Spotify Integration

Spotify is not connected yet — the app runs in **demo mode** with mock song data.

### To connect Spotify:

1. Create a Spotify Developer App at [developer.spotify.com](https://developer.spotify.com/dashboard)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your credentials:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```
4. Implement the stub functions in `src/services/spotify.js`:
   - `getTrackPreview(trackId)` — returns a preview URL
   - `searchTracks(genre, decade, difficulty)` — returns filtered tracks
   - `getPlaylistTracks(playlistId)` — returns tracks from a playlist
5. In `src/context/GameContext.jsx`, replace the `// TODO: Replace with Spotify API call` comment with a call to `searchTracks()`

---

## 📁 Folder Structure

```
booze-groove/
├── index.html                  # App entry point
├── vite.config.js              # Vite configuration (port 3000)
├── tailwind.config.js          # Tailwind theme (brand colours, animations)
├── .env.example                # Environment variable template
│
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Router setup + page transitions
    ├── index.css               # Global styles + custom animations
    │
    ├── constants/
    │   └── gameConstants.js    # Game modes, difficulties, chaos cards, etc.
    │
    ├── context/
    │   └── GameContext.jsx     # Global state (players, scores, settings)
    │
    ├── data/
    │   └── mockSongs.js        # 20+ placeholder songs (used until Spotify connected)
    │
    ├── services/
    │   └── spotify.js          # Spotify API stubs (ready to implement)
    │
    ├── hooks/
    │   └── useTimer.js         # Countdown timer hook
    │
    ├── components/             # Reusable UI components
    │   ├── Button.jsx
    │   ├── PillSelect.jsx
    │   ├── WaveformAnimation.jsx
    │   ├── GameModeCard.jsx
    │   ├── PlayerChip.jsx
    │   ├── TeamSection.jsx
    │   ├── HostModal.jsx
    │   ├── Scoreboard.jsx
    │   ├── Timer.jsx
    │   ├── RoundResultOverlay.jsx
    │   ├── RoundSummaryScreen.jsx
    │   ├── ChaosCard.jsx
    │   ├── AudioPlayer.jsx
    │   ├── ConfirmDialog.jsx
    │   └── MusicDecor.jsx
    │
    └── pages/                  # Page-level components
        ├── MainPage.jsx        # / — Mode select + player setup
        ├── SetupPage.jsx       # /setup — Game configuration
        ├── GamePage.jsx        # /game — Main gameplay
        └── EndPage.jsx         # /end — Results + awards
```

---

## 🛠 Tech Stack

- **React 18** + **Vite 5** — fast dev server & bundler
- **React Router 6** — client-side routing
- **TailwindCSS 3** — utility-first styling
- **canvas-confetti** — end-screen celebration

---

## 📱 Mobile First

Designed for phones (375px+). Best played on mobile with players passing the phone around. Works on tablets too.

---

## 🎨 Brand Colours

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#080810` | Page background |
| Card | `#12122a` | Cards & panels |
| Orange | `#f97316` | Primary accent, CTA buttons |
| Pink | `#ec4899` | Secondary accent, highlights |
| Gold | `#f59e0b` | Awards, competitive scores |

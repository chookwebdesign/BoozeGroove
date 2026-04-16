import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { DEFAULT_SETTINGS, GAME_MODES, CHAOS_CARDS, CHAOS_CARDS_BY_INTENSITY } from '../constants/gameConstants.js'
import { pickRandomSong } from '../data/mockSongs.js'

// ─── Initial State ──────────────────────────────────────────────────────────────
const initialState = {
  gameMode: null,
  players: [],           // [{ id, name, score, drinksReceived, correctAnswers, wrongAnswers }]
  teams: [],             // [{ id, name, color, playerIds, score }]
  teamsEnabled: false,
  gameSettings: { ...DEFAULT_SETTINGS },
  currentRound: 1,
  currentPlayerIndex: 0,
  currentTeamIndex: 0,
  skipsRemaining: {},   // { [playerId | teamId]: count }
  hintsRemaining: {},   // { [playerId | teamId]: count }
  chaosCard: null,
  roundHistory: [],      // [{ round, playerIndex, result, songId }]
  currentSong: null,
  usedSongIds: [],
  songPool: [],          // Pre-fetched songs from Spotify (or empty = use mock data)
  spotifyConnected: false,
  gamePhase: 'menu',     // 'menu' | 'setup' | 'playing' | 'ended'
}

// ─── Actions ────────────────────────────────────────────────────────────────────
export const ACTIONS = {
  SET_GAME_MODE: 'SET_GAME_MODE',
  ADD_PLAYER: 'ADD_PLAYER',
  REMOVE_PLAYER: 'REMOVE_PLAYER',
  REORDER_PLAYERS: 'REORDER_PLAYERS',
  SET_TEAMS_ENABLED: 'SET_TEAMS_ENABLED',
  ADD_TEAM: 'ADD_TEAM',
  REMOVE_TEAM: 'REMOVE_TEAM',
  UPDATE_TEAM_NAME: 'UPDATE_TEAM_NAME',
  MOVE_PLAYER_TO_TEAM: 'MOVE_PLAYER_TO_TEAM',
  SET_GAME_SETTINGS: 'SET_GAME_SETTINGS',
  START_GAME: 'START_GAME',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_WRONG: 'ANSWER_WRONG',
  ANSWER_ARTIST_ONLY: 'ANSWER_ARTIST_ONLY',
  SPEED_TIMEOUT: 'SPEED_TIMEOUT',
  SKIP_SONG: 'SKIP_SONG',
  USE_HINT: 'USE_HINT',
  NEXT_TURN: 'NEXT_TURN',
  DRAW_CHAOS_CARD: 'DRAW_CHAOS_CARD',
  END_GAME: 'END_GAME',
  RESET_ALL: 'RESET_ALL',
  RESET_ROUNDS: 'RESET_ROUNDS',
  LOAD_STATE: 'LOAD_STATE',
  SET_SONG_POOL: 'SET_SONG_POOL',
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
function makePlayer(name) {
  return {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    score: 0,
    drinksReceived: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  }
}

function drawChaosCard(state) {
  const { chaosIntensity, enabledChaosCards } = state.gameSettings
  const pool = CHAOS_CARDS_BY_INTENSITY[chaosIntensity] || CHAOS_CARDS
  const enabled = pool.filter(c => enabledChaosCards.includes(c.id))
  if (enabled.length === 0) return pool[Math.floor(Math.random() * pool.length)]
  return enabled[Math.floor(Math.random() * enabled.length)]
}

function getNextSong(state) {
  // If a Spotify song pool has been loaded, pick from it
  if (state.songPool && state.songPool.length > 0) {
    const available = state.songPool.filter(s => !state.usedSongIds.includes(s.id))
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)]
    }
    // Pool exhausted — wrap around
    return state.songPool[Math.floor(Math.random() * state.songPool.length)]
  }
  // Fallback: use mock data when Spotify is not connected
  return pickRandomSong(state.gameSettings, state.usedSongIds)
}

function advanceTurn(state) {
  const isTeamMode = state.gameMode === GAME_MODES.TEAM_BATTLE

  if (isTeamMode) {
    const nextTeamIndex = (state.currentTeamIndex + 1) % state.teams.length
    const completedRound = nextTeamIndex === 0
    const nextRound = completedRound ? state.currentRound + 1 : state.currentRound
    const gameOver = nextRound > state.gameSettings.rounds

    const newSong = getNextSong(state)
    const newChaos = state.gameMode === GAME_MODES.PARTY_CHAOS ? drawChaosCard(state) : state.chaosCard

    return {
      ...state,
      currentTeamIndex: gameOver ? state.currentTeamIndex : nextTeamIndex,
      currentRound: gameOver ? state.currentRound : nextRound,
      currentSong: newSong,
      usedSongIds: [...state.usedSongIds, state.currentSong?.id].filter(Boolean),
      chaosCard: newChaos,
      gamePhase: gameOver ? 'ended' : 'playing',
    }
  } else {
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
    const completedRound = nextPlayerIndex === 0
    const nextRound = completedRound ? state.currentRound + 1 : state.currentRound
    const gameOver = nextRound > state.gameSettings.rounds

    const newSong = getNextSong(state)
    const newChaos = state.gameMode === GAME_MODES.PARTY_CHAOS ? drawChaosCard(state) : state.chaosCard

    return {
      ...state,
      currentPlayerIndex: gameOver ? state.currentPlayerIndex : nextPlayerIndex,
      currentRound: gameOver ? state.currentRound : nextRound,
      currentSong: newSong,
      usedSongIds: [...state.usedSongIds, state.currentSong?.id].filter(Boolean),
      chaosCard: newChaos,
      gamePhase: gameOver ? 'ended' : 'playing',
    }
  }
}

// ─── Reducer ────────────────────────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_GAME_MODE:
      return { ...state, gameMode: action.payload }

    case ACTIONS.ADD_PLAYER: {
      if (state.players.length >= 10) return state
      const player = makePlayer(action.payload)
      const newPlayers = [...state.players, player]

      // If teams are enabled, assign player to team with fewest players
      let newTeams = state.teams
      if (state.teamsEnabled && state.teams.length > 0) {
        const smallestTeam = [...state.teams].sort(
          (a, b) => a.playerIds.length - b.playerIds.length
        )[0]
        newTeams = state.teams.map(t =>
          t.id === smallestTeam.id
            ? { ...t, playerIds: [...t.playerIds, player.id] }
            : t
        )
      }

      return { ...state, players: newPlayers, teams: newTeams }
    }

    case ACTIONS.REMOVE_PLAYER: {
      const newPlayers = state.players.filter(p => p.id !== action.payload)
      const newTeams = state.teams.map(t => ({
        ...t,
        playerIds: t.playerIds.filter(id => id !== action.payload),
      }))
      return { ...state, players: newPlayers, teams: newTeams }
    }

    case ACTIONS.REORDER_PLAYERS:
      return { ...state, players: action.payload }

    case ACTIONS.SET_TEAMS_ENABLED: {
      const enabled = action.payload
      if (!enabled) {
        return { ...state, teamsEnabled: false }
      }
      // Build default 2 teams and distribute existing players
      const defaultTeams = [
        { id: 't1', name: 'Team A', colorIndex: 0, playerIds: [], score: 0 },
        { id: 't2', name: 'Team B', colorIndex: 1, playerIds: [], score: 0 },
      ]
      state.players.forEach((p, i) => {
        defaultTeams[i % 2].playerIds.push(p.id)
      })
      return { ...state, teamsEnabled: true, teams: defaultTeams }
    }

    case ACTIONS.ADD_TEAM: {
      if (state.teams.length >= 4) return state
      const newTeam = {
        id: `t_${Date.now()}`,
        name: `Team ${String.fromCharCode(65 + state.teams.length)}`,
        colorIndex: state.teams.length,
        playerIds: [],
        score: 0,
      }
      return { ...state, teams: [...state.teams, newTeam] }
    }

    case ACTIONS.REMOVE_TEAM: {
      if (state.teams.length <= 2) return state
      const removed = state.teams.find(t => t.id === action.payload)
      const remaining = state.teams.filter(t => t.id !== action.payload)
      // Move removed players to first team
      const newTeams = remaining.map((t, i) =>
        i === 0 ? { ...t, playerIds: [...t.playerIds, ...(removed?.playerIds || [])] } : t
      )
      return { ...state, teams: newTeams }
    }

    case ACTIONS.UPDATE_TEAM_NAME:
      return {
        ...state,
        teams: state.teams.map(t =>
          t.id === action.payload.teamId ? { ...t, name: action.payload.name } : t
        ),
      }

    case ACTIONS.MOVE_PLAYER_TO_TEAM: {
      const { playerId, toTeamId } = action.payload
      const newTeams = state.teams.map(t => {
        if (t.playerIds.includes(playerId)) {
          return { ...t, playerIds: t.playerIds.filter(id => id !== playerId) }
        }
        if (t.id === toTeamId) {
          return { ...t, playerIds: [...t.playerIds, playerId] }
        }
        return t
      })
      return { ...state, teams: newTeams }
    }

    case ACTIONS.SET_GAME_SETTINGS:
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.payload },
      }

    case ACTIONS.START_GAME: {
      const firstSong = getNextSong(state)
      const firstChaos = state.gameMode === GAME_MODES.PARTY_CHAOS ? drawChaosCard(state) : null
      const isTeam = state.gameMode === GAME_MODES.TEAM_BATTLE
      const entities = isTeam ? state.teams : state.players
      const skipsMap = Object.fromEntries(entities.map(e => [e.id, state.gameSettings.skipLimit]))
      const hintsMap = Object.fromEntries(entities.map(e => [e.id, state.gameSettings.hintLimit]))
      return {
        ...state,
        currentRound: 1,
        currentPlayerIndex: 0,
        currentTeamIndex: 0,
        skipsRemaining: skipsMap,
        hintsRemaining: hintsMap,
        roundHistory: [],
        currentSong: firstSong,
        usedSongIds: firstSong ? [firstSong.id] : [],
        chaosCard: firstChaos,
        gamePhase: 'playing',
      }
    }

    case ACTIONS.ANSWER_CORRECT: {
      const { playerIndex, teamIndex } = action.payload ?? {}
      const idx = playerIndex ?? state.currentPlayerIndex
      const tIdx = teamIndex ?? state.currentTeamIndex

      const isIndividual = state.gameMode === GAME_MODES.CLASSIC || state.gameMode === GAME_MODES.NO_HOST
      const newPlayers = state.players.map((p, i) =>
        i === idx
          ? { ...p, correctAnswers: p.correctAnswers + 1, score: p.score + (isIndividual ? 2 : 0) }
          : p
      )
      const newTeams = state.teams.map((t, i) =>
        i === tIdx && state.gameMode === GAME_MODES.TEAM_BATTLE
          ? { ...t, score: t.score + 2 }
          : t
      )
      const newHistory = [...state.roundHistory, {
        round: state.currentRound,
        playerIndex: idx,
        result: 'correct',
        songId: state.currentSong?.id,
      }]

      return { ...state, players: newPlayers, teams: newTeams, roundHistory: newHistory }
    }

    case ACTIONS.ANSWER_WRONG: {
      const { playerIndex, drinks = 1 } = action.payload ?? {}
      const idx = playerIndex ?? state.currentPlayerIndex

      const newPlayers = state.players.map((p, i) =>
        i === idx
          ? { ...p, wrongAnswers: p.wrongAnswers + 1, drinksReceived: p.drinksReceived + drinks }
          : p
      )
      const newHistory = [...state.roundHistory, {
        round: state.currentRound,
        playerIndex: idx,
        result: 'wrong',
        drinks,
        songId: state.currentSong?.id,
      }]
      return { ...state, players: newPlayers, roundHistory: newHistory }
    }

    case ACTIONS.ANSWER_ARTIST_ONLY: {
      const { playerIndex, teamIndex } = action.payload ?? {}
      const idx  = playerIndex ?? state.currentPlayerIndex
      const tIdx = teamIndex  ?? state.currentTeamIndex

      const isIndividual = state.gameMode === GAME_MODES.CLASSIC || state.gameMode === GAME_MODES.NO_HOST
      const newPlayers = state.players.map((p, i) =>
        i === idx
          ? { ...p, score: p.score + (isIndividual ? 1 : 0) }
          : p
      )
      const newTeams = state.teams.map((t, i) =>
        i === tIdx && state.gameMode === GAME_MODES.TEAM_BATTLE
          ? { ...t, score: t.score + 1 }
          : t
      )
      const newHistory = [...state.roundHistory, {
        round: state.currentRound,
        playerIndex: idx,
        result: 'artistOnly',
        songId: state.currentSong?.id,
      }]
      return { ...state, players: newPlayers, teams: newTeams, roundHistory: newHistory }
    }

    case ACTIONS.SPEED_TIMEOUT: {
      // Out of time = drink double
      const idx = state.currentPlayerIndex
      const newPlayers = state.players.map((p, i) =>
        i === idx ? { ...p, drinksReceived: p.drinksReceived + 2, wrongAnswers: p.wrongAnswers + 1 } : p
      )
      return { ...state, players: newPlayers }
    }

    case ACTIONS.USE_HINT: {
      const { entityId } = action.payload ?? {}
      if (!entityId || (state.hintsRemaining[entityId] ?? 0) <= 0) return state
      return {
        ...state,
        hintsRemaining: { ...state.hintsRemaining, [entityId]: state.hintsRemaining[entityId] - 1 },
      }
    }

    case ACTIONS.SKIP_SONG: {
      const { entityId } = action.payload ?? {}
      if (!entityId || (state.skipsRemaining[entityId] ?? 0) <= 0) return state
      const newSong = getNextSong({
        ...state,
        usedSongIds: [...state.usedSongIds, state.currentSong?.id].filter(Boolean),
      })
      return {
        ...state,
        skipsRemaining: { ...state.skipsRemaining, [entityId]: state.skipsRemaining[entityId] - 1 },
        currentSong: newSong,
        usedSongIds: [...state.usedSongIds, state.currentSong?.id, newSong?.id].filter(Boolean),
      }
    }

    case ACTIONS.NEXT_TURN:
      return advanceTurn(state)

    case ACTIONS.DRAW_CHAOS_CARD:
      return { ...state, chaosCard: drawChaosCard(state) }

    case ACTIONS.END_GAME:
      return { ...state, gamePhase: 'ended' }

    case ACTIONS.RESET_ALL:
      return { ...initialState }

    case ACTIONS.RESET_ROUNDS: {
      // Keep players and settings, reset round data
      const firstSong = getNextSong({ ...state, usedSongIds: [] })
      const firstChaos = state.gameMode === GAME_MODES.PARTY_CHAOS ? drawChaosCard(state) : null
      return {
        ...state,
        currentRound: 1,
        currentPlayerIndex: 0,
        currentTeamIndex: 0,
        skipsRemaining: Object.fromEntries(
          (state.gameMode === GAME_MODES.TEAM_BATTLE ? state.teams : state.players)
            .map(e => [e.id, state.gameSettings.skipLimit])
        ),
        hintsRemaining: Object.fromEntries(
          (state.gameMode === GAME_MODES.TEAM_BATTLE ? state.teams : state.players)
            .map(e => [e.id, state.gameSettings.hintLimit])
        ),
        roundHistory: [],
        currentSong: firstSong,
        usedSongIds: firstSong ? [firstSong.id] : [],
        chaosCard: firstChaos,
        gamePhase: 'playing',
        players: state.players.map(p => ({ ...p, score: 0, drinksReceived: 0, correctAnswers: 0, wrongAnswers: 0 })),
        teams: state.teams.map(t => ({ ...t, score: 0 })),
      }
    }

    case ACTIONS.LOAD_STATE:
      return { ...initialState, ...action.payload }

    case ACTIONS.SET_SONG_POOL:
      return {
        ...state,
        songPool: action.payload.songs,
        spotifyConnected: action.payload.spotifyConnected ?? true,
      }

    default:
      return state
  }
}

// ─── Context ────────────────────────────────────────────────────────────────────
const GameContext = createContext(null)

const SESSION_KEY = 'boozeGroove_gameState'

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...init, ...parsed }
      }
    } catch {}
    return init
  })

  // Persist to sessionStorage on every state change
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

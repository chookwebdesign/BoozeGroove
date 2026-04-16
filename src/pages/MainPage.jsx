import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { ACTIONS } from '../context/GameContext.jsx'
import { GAME_MODES, MAX_PLAYERS } from '../constants/gameConstants.js'
import GameModeCard from '../components/GameModeCard.jsx'
import PlayerChip from '../components/PlayerChip.jsx'
import TeamSection from '../components/TeamSection.jsx'
import { PrimaryButton } from '../components/Button.jsx'
import { VinylRecord, FloatingNotes } from '../components/MusicDecor.jsx'

export default function MainPage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [playerInput, setPlayerInput] = useState('')
  const [errors, setErrors] = useState([])
  const inputRef = useRef(null)

  const { gameMode, players, teamsEnabled, teams } = state

  const handleSelectMode = (mode) => {
    dispatch({ type: ACTIONS.SET_GAME_MODE, payload: mode })
    // Automatically enable/disable teams based on mode
    dispatch({
      type: ACTIONS.SET_TEAMS_ENABLED,
      payload: mode === GAME_MODES.TEAM_BATTLE,
    })
    setErrors(e => e.filter(err => !err.includes('mode')))
  }

  const handleAddPlayer = () => {
    const name = playerInput.trim()
    if (!name) return
    if (players.length >= MAX_PLAYERS) {
      setErrors(['Maximum 10 players reached!'])
      return
    }
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setErrors([`"${name}" is already in the game`])
      return
    }
    dispatch({ type: ACTIONS.ADD_PLAYER, payload: name })
    setPlayerInput('')
    setErrors([])
    inputRef.current?.focus()
  }

  const handleQuickAdd = () => {
    const existing = players.map(p => p.name)
    let added = 0
    for (let i = 1; players.length + added < MAX_PLAYERS && added < 4; i++) {
      const name = `Player ${players.length + added + 1}`
      if (!existing.includes(name)) {
        dispatch({ type: ACTIONS.ADD_PLAYER, payload: name })
        added++
      }
    }
  }

  const handleRemovePlayer = (id) => {
    dispatch({ type: ACTIONS.REMOVE_PLAYER, payload: id })
  }

  const handleToggleTeams = () => {
    dispatch({ type: ACTIONS.SET_TEAMS_ENABLED, payload: !teamsEnabled })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddPlayer()
  }

  const handleNext = () => {
    const newErrors = []
    if (!gameMode) newErrors.push('Please select a game mode')
    if (players.length < 2) newErrors.push('Add at least 2 players')

    if (teamsEnabled) {
      const emptyTeams = teams.filter(t => t.playerIds.length === 0)
      if (emptyTeams.length > 0) {
        newErrors.push(`${emptyTeams.map(t => t.name).join(', ')} need at least 1 player`)
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    navigate('/setup')
  }

  return (
    <div className="min-h-screen bg-groove-bg page-container relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-16 -right-16 opacity-10">
          <VinylRecord size={180} spinning />
        </div>
        <div className="absolute -bottom-20 -left-16 opacity-10">
          <VinylRecord size={160} />
        </div>
      </div>

      {/* Hero header */}
      <header className="relative text-center py-6 mb-6">
        <FloatingNotes className="absolute inset-0" />
        <div className="relative z-10">
          <div className="font-display text-5xl text-white mb-1" style={{ textShadow: '0 0 40px rgba(249,115,22,0.7)' }}>
            Booze Groove
          </div>
          <div className="text-groove-orange font-medium">🎵 The Music Drinking Game</div>
        </div>
      </header>

      {/* ─── Game Mode Selection ─────────────────────────────────── */}
      <section className="mb-6">
        <div className="section-label">Choose Your Mode</div>
        <div className="space-y-2">
          {Object.values(GAME_MODES).map(mode => (
            <GameModeCard
              key={mode}
              mode={mode}
              selected={gameMode === mode}
              onSelect={handleSelectMode}
            />
          ))}
        </div>
      </section>

      {/* ─── Add Players ─────────────────────────────────────────── */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="section-label">Add Players</div>
          <span className="text-xs text-gray-500">{players.length}/{MAX_PLAYERS}</span>
        </div>

        {/* Input row */}
        <div className="flex gap-2 mb-3">
          <input
            ref={inputRef}
            type="text"
            value={playerInput}
            onChange={e => setPlayerInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter player name..."
            maxLength={20}
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={handleAddPlayer}
            disabled={!playerInput.trim() || players.length >= MAX_PLAYERS}
            className="px-5 py-3 rounded-xl bg-groove-orange text-white font-display font-bold
                       active:scale-95 transition-all duration-150 disabled:opacity-40
                       disabled:cursor-not-allowed flex-shrink-0"
            style={{ minHeight: 52 }}
          >
            Add
          </button>
        </div>

        {/* Player chips */}
        {players.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
            {players.map(p => (
              <PlayerChip key={p.id} player={p} onRemove={handleRemovePlayer} />
            ))}
          </div>
        )}

        {players.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-2">
            No players yet — add some above!
          </p>
        )}
      </section>

      {/* ─── Team Management (only shown for Team Battle mode) ───── */}
      {gameMode === GAME_MODES.TEAM_BATTLE && (
        <section className="mb-6 card animate-fade-in">
          <div className="section-label mb-3">⚔️ Team Setup</div>
          <TeamSection />
        </section>
      )}

      {/* ─── Error Messages ───────────────────────────────────────── */}
      {errors.length > 0 && (
        <div className="mb-4 space-y-1 animate-slide-up">
          {errors.map((err, i) => (
            <div
              key={i}
              className="bg-red-900/30 border border-red-500/50 rounded-xl px-4 py-3
                         text-red-300 text-sm text-center"
            >
              ⚠️ {err}
            </div>
          ))}
        </div>
      )}

      {/* ─── Next Button ─────────────────────────────────────────── */}
      <PrimaryButton onClick={handleNext}>
        NEXT →
      </PrimaryButton>

      <p className="text-center text-xs text-gray-600 mt-4">
        🔞 Drink responsibly. For ages 18+ only.
      </p>
    </div>
  )
}

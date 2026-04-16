import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { ACTIONS } from '../context/GameContext.jsx'
import { fetchSongsByGenre } from '../services/itunes.js'
import {
  GAME_MODES,
  GENRES,
  ROUND_OPTIONS, CLIP_LENGTHS,
  TIMER_OPTIONS_CLASSIC,
  SKIP_OPTIONS, HINT_OPTIONS,
} from '../constants/gameConstants.js'
import { PrimaryButton, GhostButton } from '../components/Button.jsx'
import { PillSingle, PillMulti } from '../components/PillSelect.jsx'
import HostModal from '../components/HostModal.jsx'

export default function SetupPage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [showHostModal, setShowHostModal] = useState(false)
  const [fetchingTracks, setFetchingTracks] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const { gameMode, gameSettings } = state

  // Redirect if no game mode selected
  useEffect(() => {
    if (!gameMode) navigate('/')
  }, [gameMode])

  const update = (key, val) => dispatch({ type: ACTIONS.SET_GAME_SETTINGS, payload: { [key]: val } })

  const handleRoundsSelect = (val) => update('rounds', val)
  const handleSkipSelect = (val) => update('skipLimit', val)

  const handleStartClick = () => {
    setShowHostModal(true)
  }

  const handleHostReady = async () => {
    setShowHostModal(false)
    await handleStart()
  }

  const handleStart = async () => {
    setFetchError(null)
    setFetchingTracks(true)

    try {
      const { songs, fallback } = await fetchSongsByGenre(gameSettings.genres)

      if (fallback) {
        setFetchError('Showing all songs — no exact matches found for your selection.')
      }

      dispatch({
        type: ACTIONS.SET_SONG_POOL,
        payload: { songs, spotifyConnected: true },
      })
    } catch (err) {
      // Silent fallback to mock data if Spotify fails
      console.warn('[SetupPage] Spotify fetch failed, using demo songs:', err.message)
      dispatch({ type: ACTIONS.SET_SONG_POOL, payload: { songs: [], spotifyConnected: false } })
    } finally {
      setFetchingTracks(false)
    }

    dispatch({ type: ACTIONS.START_GAME })
    navigate('/game')
  }

  const clipOptions = CLIP_LENGTHS
  const skipOptions = SKIP_OPTIONS


  return (
    <div className="min-h-screen bg-groove-bg page-container page-enter">
      <HostModal open={showHostModal} onReady={handleHostReady} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <GhostButton onClick={() => navigate('/')}>← Back</GhostButton>
        <h1 className="font-display text-2xl text-white">Game Setup</h1>
        <div className="ml-auto text-sm text-groove-orange font-medium">
          {gameMode && `${GAME_MODES[Object.keys(GAME_MODES).find(k => GAME_MODES[k] === gameMode)]?.replace(/_/g,' ') ?? gameMode}`}
        </div>
      </div>

      {/* ─── Music Settings ─────────────────────────────────────── */}
      <section className="card mb-4">
        <h2 className="section-label">🎵 Music Settings</h2>

        {/* Genre */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Genre</label>
          <PillMulti
            options={GENRES}
            value={gameSettings.genres}
            onChange={val => update('genres', val)}
          />
        </div>
      </section>

      {/* ─── Game Settings ──────────────────────────────────────── */}
      <section className="card mb-4">
        <h2 className="section-label">⚙️ Game Settings</h2>

        {/* Number of Songs */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Number of Songs</label>
          <PillSingle
            options={ROUND_OPTIONS}
            value={gameSettings.rounds}
            onChange={handleRoundsSelect}
          />
        </div>

        {/* Song Length */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Song Length</label>
          <PillSingle
            options={clipOptions}
            value={gameSettings.clipLength}
            onChange={val => update('clipLength', val)}
            labelFn={v => v === 15 ? 'Easy (15s)' : v === 10 ? 'Medium (10s)' : 'Hard (5s)'}
          />
        </div>

        {/* Skip Limit */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Skip Limit (per game)</label>
          <PillSingle
            options={skipOptions}
            value={gameSettings.skipLimit}
            onChange={handleSkipSelect}
          />
        </div>

        {/* Hints */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Hints (per game)</label>
          <PillSingle
            options={HINT_OPTIONS}
            value={gameSettings.hintLimit}
            onChange={val => update('hintLimit', val)}
          />
        </div>

        {/* Guess Timer */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Guess Timer</label>
          <PillSingle
            options={TIMER_OPTIONS_CLASSIC}
            value={gameSettings.guessTimer}
            onChange={val => update('guessTimer', val)}
            labelFn={v => v === 'Unlimited' ? 'Unlimited/Off' : `${v}s`}
          />
        </div>

        {/* Artist Only */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Artist Only</label>
          <PillSingle
            options={['Off', 'On']}
            value={gameSettings.artistOnly}
            onChange={val => update('artistOnly', val)}
          />
        </div>
      </section>

      {/* ─── Mode-Specific Settings ──────────────────────────────── */}

      {/* SUFFER MODE */}
      {gameMode === GAME_MODES.SUFFER && (
        <section className="card mb-4 animate-fade-in">
          <h2 className="section-label">How to Play:</h2>
          <div className="rules-card">
            <p>💀 No scores — this is purely about suffering</p>
            <p>✅ Correct answer = gives a penalty to someone</p>
            <p>❌ Wrong answer = face a random penalty</p>
            <p>🎲 Penalties range from drinking dares to social challenges</p>
            <p>🏁 Last player standing wins the respect of the group</p>
          </div>
        </section>
      )}

      {/* NO HOST MODE */}
      {gameMode === GAME_MODES.NO_HOST && (
        <section className="card mb-4 animate-fade-in">
          <h2 className="section-label">How to Play:</h2>
          <div className="rules-card">
            <p>📱 Pass the device to the player whose turn it is</p>
            <p>🎵 They press play and listen to the clip</p>
            <p>👀 After the clip, tap <strong>Reveal Answer</strong> to see the song</p>
            <p>✅ Correct answer = give a drink to someone</p>
            <p>❌ Wrong answer = you drink</p>
            <p>🏁 Loser of the round must down their FULL drink</p>
          </div>
        </section>
      )}

      {/* CLASSIC MODE */}
      {gameMode === GAME_MODES.CLASSIC && (
        <section className="card mb-4 animate-fade-in">
          <h2 className="section-label">How to Play:</h2>
          <div className="rules-card">
            <p>✅ Correct answer = give a drink to someone</p>
            <p>❌ Wrong answer = you drink</p>
            <p>🏁 Loser of the round must down their FULL drink</p>
          </div>
        </section>
      )}

      {/* TEAM BATTLE MODE */}
      {gameMode === GAME_MODES.TEAM_BATTLE && (
        <section className="card mb-4 animate-fade-in">
          <h2 className="section-label">⚔️ Team Battle Settings</h2>
          <div className="rules-card">
            <p className="font-medium text-white mb-1">Team Rules:</p>
            <p>✅ Correct = <span className="text-groove-gold font-bold">+2 points</span> & pick someone from the other team to drink</p>
            <p>❌ Wrong = Team drinks</p>
            <p>🏁 Losing team must down their FULL drink</p>
            <p>🤝 Tie = everyone drinks</p>
            <p className="mt-2 text-gray-400">Teams take turns — discuss before answering!</p>
          </div>
        </section>
      )}

      {/* ─── Fallback notice ─────────────────────────────────────── */}
      {fetchError && (
        <div className="mb-3 bg-yellow-900/30 border border-yellow-500/40 rounded-xl px-4 py-3 text-yellow-300 text-sm animate-slide-up">
          ⚠️ {fetchError}
        </div>
      )}

      {/* ─── Start Button ────────────────────────────────────────── */}
      <div className="sticky bottom-4 pt-4">
        <PrimaryButton onClick={handleStartClick} disabled={fetchingTracks}>
          {fetchingTracks ? '🎵 Loading songs...' : 'START GAME →'}
        </PrimaryButton>
        {fetchingTracks && (
          <p className="text-center text-xs text-gray-500 mt-2">
            Fetching tracks from Spotify...
          </p>
        )}
      </div>
    </div>
  )
}

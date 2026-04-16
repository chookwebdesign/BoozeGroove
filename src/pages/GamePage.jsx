import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { ACTIONS } from '../context/GameContext.jsx'
import { GAME_MODES, TEAM_COLOURS, SUFFER_PENALTIES } from '../constants/gameConstants.js'
import AudioPlayer from '../components/AudioPlayer.jsx'
import Scoreboard from '../components/Scoreboard.jsx'
import Timer from '../components/Timer.jsx'
import RoundResultOverlay from '../components/RoundResultOverlay.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { JudgeButton } from '../components/Button.jsx'

// ─── Local phase state ──────────────────────────────────────────────────────────
// 'waiting'  → clip not yet played
// 'played'   → clip finished, waiting for host judgment (timer may run)
// 'result'   → showing RoundResultOverlay
// 'roundEnd' → showing RoundSummaryScreen (competitive/team after full round)

export default function GamePage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()

  const {
    gameMode, players, teams, gameSettings, currentRound,
    currentPlayerIndex, currentTeamIndex, skipsRemaining, hintsRemaining,
    currentSong, gamePhase,
  } = state

  const [clipPhase, setClipPhase] = useState('waiting') // waiting | playing | played
  const [revealed, setRevealed] = useState(false)
  const [resultData, setResultData] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(30)

  const isTeamMode = gameMode === GAME_MODES.TEAM_BATTLE
  const isNoHost = gameMode === GAME_MODES.NO_HOST
  const isSuffer = gameMode === GAME_MODES.SUFFER

  const currentPlayer = players[currentPlayerIndex]
  const currentTeam = teams[currentTeamIndex]
  const entityId = isTeamMode ? currentTeam?.id : currentPlayer?.id
  const mySkips = entityId ? (skipsRemaining[entityId] ?? 0) : 0
  const myHints = entityId ? (hintsRemaining[entityId] ?? 0) : 0
  const hasTimer = gameSettings.guessTimer !== 'Off' && gameSettings.guessTimer !== 'Unlimited'
  const guessTimerSecs = hasTimer ? Number(gameSettings.guessTimer) : 30

  // Redirect if game not in progress
  useEffect(() => {
    if (!gameMode || players.length === 0) navigate('/')
  }, [gameMode, players])

  // Go to end screen when game phase becomes 'ended'
  useEffect(() => {
    if (gamePhase === 'ended') {
      navigate('/end')
    }
  }, [gamePhase])

  const handleClipStart = useCallback(() => {
    setClipPhase('playing')
  }, [])

  const handleClipEnd = useCallback(() => {
    setClipPhase('played')
    if (hasTimer) {
      setTimerSeconds(guessTimerSecs)
      setTimerActive(true)
    }
  }, [hasTimer, guessTimerSecs])

  const handleTimerComplete = useCallback(() => {
    setTimerActive(false)
    // Play a "ring ring" bell tone to alert everyone the time is up
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()

      const playBell = (startTime) => {
        const osc  = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1046, startTime)         // C6 — clear bell tone
        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(0.5, startTime + 0.01) // sharp attack
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5) // bell decay
        osc.start(startTime)
        osc.stop(startTime + 0.5)
      }

      playBell(ctx.currentTime)          // first ring
      playBell(ctx.currentTime + 0.6)    // second ring

      setTimeout(() => ctx.close(), 1300)
    } catch (_) { /* audio not available */ }
  }, [])

  function triggerResult({ result, playerName, drinks = 0, points = 0, sufferMessage = null, sufferTarget = null }) {
    setTimerActive(false)
    setResultData({ result, playerName, drinks, points, sufferMessage, sufferTarget })
    setShowResult(true)
    setClipPhase('waiting')
  }

  const handleCorrect = () => {
    dispatch({ type: ACTIONS.ANSWER_CORRECT })
    if (isSuffer) {
      const opponents = players.filter((_, i) => i !== currentPlayerIndex)
      const opponent = opponents.length > 0
        ? opponents[Math.floor(Math.random() * opponents.length)]
        : null
      const penalty = SUFFER_PENALTIES[Math.floor(Math.random() * SUFFER_PENALTIES.length)]
      triggerResult({
        result: 'correct',
        playerName: currentPlayer?.name ?? 'Player',
        points: 0,
        drinks: 0,
        sufferTarget: opponent?.name ?? null,
        sufferMessage: penalty,
      })
    } else {
      triggerResult({
        result: 'correct',
        playerName: isTeamMode ? (currentTeam?.name ?? 'Team') : (currentPlayer?.name ?? 'Player'),
        points: isTeamMode ? 2 : 2,
        drinks: isTeamMode ? 1 : 2,
      })
    }
  }

  const handleArtistOnly = () => {
    dispatch({ type: ACTIONS.ANSWER_ARTIST_ONLY })
    triggerResult({
      result: 'artistOnly',
      playerName: isTeamMode ? (currentTeam?.name ?? 'Team') : (currentPlayer?.name ?? 'Player'),
      points: 1,
      drinks: 1,
    })
  }

  const handleWrong = () => {
    dispatch({ type: ACTIONS.ANSWER_WRONG, payload: { drinks: 1 } })
    const sufferMessage = isSuffer
      ? SUFFER_PENALTIES[Math.floor(Math.random() * SUFFER_PENALTIES.length)]
      : null
    triggerResult({
      result: 'wrong',
      playerName: currentPlayer?.name ?? 'Player',
      drinks: 1,
      points: 0,
      sufferMessage,
    })
  }

  const handleNextTurn = () => {
    setShowResult(false)
    setResultData(null)
    setRevealed(false)

    dispatch({ type: ACTIONS.NEXT_TURN })
  }

  const handleSkip = () => {
    setShowSkipConfirm(false)
    dispatch({ type: ACTIONS.SKIP_SONG, payload: { entityId } })
    setClipPhase('waiting')
    setTimerActive(false)
  }

  // Resolve clip length
  const effectiveClipLength = Number(gameSettings.clipLength)

  const getCurrentLabel = () => {
    if (isTeamMode) return `⚔️ ${currentTeam?.name ?? 'Team'}'s Turn`
    return `🎤 ${currentPlayer?.name ?? 'Player'}'s Turn`
  }

  const teamColour = isTeamMode && currentTeam
    ? TEAM_COLOURS[currentTeam.colorIndex ?? currentTeamIndex]?.hex ?? '#f97316'
    : null

  return (
    <div className="min-h-screen bg-groove-bg page-container page-enter pb-8 relative">

      {/* ─── Top Bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="text-sm font-medium text-gray-400">
          Round <span className="text-white font-display text-base">{currentRound}</span>
          <span className="text-gray-600"> / {gameSettings.rounds}</span>
        </div>
        <div className="text-xs text-groove-orange font-medium uppercase tracking-wide">
          {gameMode?.replace(/([A-Z])/g, ' $1').trim()}
        </div>
        <div className="text-sm text-gray-400">
          ⏭️ <span className={mySkips === 0 ? 'text-red-400' : 'text-white'}>{mySkips}</span> skips
        </div>
      </div>

      {/* ─── Scoreboard ───────────────────────────────────────────── */}
      <Scoreboard gameMode={gameMode} players={players} teams={teams} />

      {/* ─── Current Player / Team ────────────────────────────────── */}
      <div
        className="text-center py-4 mb-4 rounded-2xl border-2"
        style={{
          borderColor: teamColour ?? 'rgba(249,115,22,0.4)',
          background: teamColour
            ? `${teamColour}15`
            : 'rgba(249,115,22,0.08)',
        }}
      >
        <div
          className="font-display text-3xl text-white"
          style={{ textShadow: `0 0 20px ${teamColour ?? 'rgba(249,115,22,0.6)'}` }}
        >
          {getCurrentLabel()}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {isTeamMode && currentTeam
            ? `Players: ${players.filter(p => currentTeam.playerIds.includes(p.id)).map(p => p.name).join(', ')}`
            : isSuffer && currentPlayer
            ? `Drinks: ${currentPlayer.drinksReceived}`
            : currentPlayer
            ? `Score: ${currentPlayer.score} pts · Drinks: ${currentPlayer.drinksReceived}`
            : ''
          }
        </div>
      </div>

      {/* ─── Song Player ──────────────────────────────────────────── */}
      <div className="card mb-4 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">
          {clipPhase === 'waiting' ? 'Tap Play to reveal the clip' : clipPhase === 'playing' ? 'Listening...' : 'How did they do?'}
        </div>

        <AudioPlayer
          song={currentSong}
          clipLength={effectiveClipLength}
          onClipStart={handleClipStart}
          onClipEnd={handleClipEnd}
          hideAlbumArt={isNoHost}
        />
      </div>

      {/* ─── Timer ────────────────────────────────────────────────── */}
      {clipPhase === 'played' && hasTimer && (
        <div className="mb-4 animate-bounce-in">
          <div className="text-center text-sm text-gray-400 mb-2">
            ⏱️ Guess Timer
          </div>
          <Timer
            seconds={guessTimerSecs}
            active={timerActive}
            paused={showHint}
            onComplete={handleTimerComplete}
          />
        </div>
      )}

      {/* ─── Host Controls / No Host Reveal ──────────────────────── */}
      {(clipPhase === 'played' || clipPhase === 'playing') && (
        <div className="card mb-4 animate-slide-up">

          {isNoHost ? (
            /* ── No Host flow: reveal button first, then judge buttons ── */
            !revealed ? (
              <>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 text-center">
                  📢 Say your answer out loud, then reveal
                </div>
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="w-full py-4 rounded-xl font-display text-white text-lg font-bold
                             bg-gradient-to-br from-purple-500 to-purple-700
                             active:scale-95 transition-all duration-150 select-none
                             shadow-lg"
                >
                  Reveal Answer
                </button>
              </>
            ) : (
              <>
                <div className="bg-groove-cardLight rounded-xl px-4 py-3 mb-3 text-center border border-groove-border">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">The Answer</div>
                  <div className="font-display text-white text-lg leading-tight">
                    {currentSong?.title ?? '—'}
                  </div>
                  <div className="text-groove-orange text-sm mt-0.5">
                    {currentSong?.artist ?? '—'}
                  </div>
                </div>
                <div className="flex gap-3">
                  <JudgeButton variant="green" onClick={handleCorrect}>
                    ✅ Correct<br />
                    <span className="text-xs font-normal opacity-80">(+2 pts)</span>
                  </JudgeButton>
                  {gameSettings.artistOnly === 'On' && (
                    <JudgeButton variant="yellow" onClick={handleArtistOnly}>
                      🎤 Artist<br />
                      <span className="text-xs font-normal opacity-80">(+1 pt)</span>
                    </JudgeButton>
                  )}
                  <JudgeButton variant="red" onClick={handleWrong}>
                    ❌ Wrong
                  </JudgeButton>
                </div>
              </>
            )
          ) : (
            /* ── Classic / Team Battle flow: host sees answer immediately ── */
            <>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 text-center">
                👑 Host Only
              </div>

              <div className="bg-groove-cardLight rounded-xl px-4 py-3 mb-3 text-center border border-groove-border">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">The Answer</div>
                <div className="font-display text-white text-lg leading-tight">
                  {currentSong?.title ?? '—'}
                </div>
                <div className="text-groove-orange text-sm mt-0.5">
                  {currentSong?.artist ?? '—'}
                </div>
              </div>

              {isTeamMode ? (
                <div className="flex gap-3">
                  <JudgeButton variant="green" onClick={handleCorrect}>
                    ✅ Correct<br />
                    <span className="text-xs font-normal opacity-80">(+2 team pts)</span>
                  </JudgeButton>
                  {gameSettings.artistOnly === 'On' && (
                    <JudgeButton variant="yellow" onClick={handleArtistOnly}>
                      🎤 Artist<br />
                      <span className="text-xs font-normal opacity-80">(+1 pt)</span>
                    </JudgeButton>
                  )}
                  <JudgeButton variant="red" onClick={handleWrong}>
                    ❌ Wrong<br />
                    <span className="text-xs font-normal opacity-80">(team drinks)</span>
                  </JudgeButton>
                </div>
              ) : (
                <div className="flex gap-3">
                  <JudgeButton variant="green" onClick={handleCorrect}>
                    ✅ Correct
                    {!isSuffer && <><br /><span className="text-xs font-normal opacity-80">(+2 pts)</span></>}
                  </JudgeButton>
                  {gameSettings.artistOnly === 'On' && (
                    <JudgeButton variant="yellow" onClick={handleArtistOnly}>
                      🎤 Artist
                      {!isSuffer && <><br /><span className="text-xs font-normal opacity-80">(+1 pt)</span></>}
                    </JudgeButton>
                  )}
                  <JudgeButton variant="red" onClick={handleWrong}>
                    ❌ Wrong
                  </JudgeButton>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── Skip + Hint Buttons ──────────────────────────────────── */}
      <div className={`flex gap-2 ${(gameSettings.skipLimit > 0 || gameSettings.hintLimit > 0) ? 'mb-2' : ''}`}>
        {gameSettings.skipLimit > 0 && (
          <button
            type="button"
            onClick={() => setShowSkipConfirm(true)}
            disabled={mySkips <= 0}
            className={`
              flex-1 py-3 rounded-xl border font-medium text-base
              transition-all duration-150 active:scale-95 select-none
              ${mySkips > 0
                ? 'border-groove-border text-gray-300 hover:border-groove-orange hover:text-groove-orange'
                : 'border-groove-border text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
          >
            ⏭️ Skip ({mySkips} left)
          </button>
        )}
        {gameSettings.hintLimit > 0 && (
          <button
            type="button"
            onClick={() => { dispatch({ type: ACTIONS.USE_HINT, payload: { entityId } }); setShowHint(true) }}
            disabled={myHints <= 0}
            className={`
              flex-1 py-3 rounded-xl border font-medium text-base
              transition-all duration-150 active:scale-95 select-none
              ${myHints > 0
                ? 'border-groove-border text-gray-300 hover:border-blue-400 hover:text-blue-400'
                : 'border-groove-border text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
          >
            💡 Hint ({myHints} left)
          </button>
        )}
      </div>

      {/* ─── Album Art Hint Overlay ───────────────────────────────── */}
      {showHint && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
          style={{ background: 'rgba(8,8,16,0.96)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowHint(false)}
        >
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Album Art Hint — tap to close</div>
          {currentSong?.albumArt ? (
            <img
              src={currentSong.albumArt}
              alt="Album art hint"
              className="w-full max-w-sm rounded-2xl shadow-2xl border-2 border-groove-orange/40"
              style={{ boxShadow: '0 0 60px rgba(249,115,22,0.3)' }}
            />
          ) : (
            <div className="w-64 h-64 rounded-2xl bg-groove-card border border-groove-border flex items-center justify-center">
              <span className="text-gray-500 text-sm">No album art available</span>
            </div>
          )}
          <button
            onClick={() => setShowHint(false)}
            className="mt-8 px-8 py-3 rounded-xl bg-groove-card border border-groove-border text-gray-300 font-medium active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      )}

      {/* ─── Overlays ─────────────────────────────────────────────── */}
      <RoundResultOverlay
        open={showResult}
        song={currentSong}
        result={resultData?.result}
        playerName={resultData?.playerName}
        points={isSuffer ? 0 : resultData?.points}
        drinks={resultData?.drinks}
        sufferMessage={resultData?.sufferMessage}
        sufferTarget={resultData?.sufferTarget}
        onNext={handleNextTurn}
      />


      <ConfirmDialog
        open={showSkipConfirm}
        title="Skip this song?"
        message={`You have ${mySkips} skip${mySkips !== 1 ? 's' : ''} remaining. This cannot be undone.`}
        confirmLabel="⏭️ Skip"
        cancelLabel="Cancel"
        onConfirm={handleSkip}
        onCancel={() => setShowSkipConfirm(false)}
      />
    </div>
  )
}

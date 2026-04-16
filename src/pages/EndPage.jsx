import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { ACTIONS } from '../context/GameContext.jsx'
import { GAME_MODES, TEAM_COLOURS } from '../constants/gameConstants.js'
import { PrimaryButton, SecondaryButton } from '../components/Button.jsx'
import { VinylRecord } from '../components/MusicDecor.jsx'

export default function EndPage() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const confettiRef = useRef(false)

  const { gameMode, players, teams } = state

  // Redirect if no game data
  useEffect(() => {
    if (!gameMode || players.length === 0) navigate('/')
  }, [gameMode, players])

  // Fire confetti on mount
  useEffect(() => {
    if (confettiRef.current) return
    confettiRef.current = true

    import('canvas-confetti').then(({ default: confetti }) => {
      const shoot = () => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { x: 0.3, y: 0.6 },
          colors: ['#f97316', '#ec4899', '#f59e0b', '#ffffff'],
        })
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { x: 0.7, y: 0.6 },
          colors: ['#f97316', '#ec4899', '#f59e0b', '#ffffff'],
        })
      }
      shoot()
      setTimeout(shoot, 600)
      setTimeout(shoot, 1400)
    }).catch(() => {})
  }, [])

  // Derive leaderboard
  const isTeamMode = gameMode === GAME_MODES.TEAM_BATTLE

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

  // Winner
  const winner = isTeamMode ? sortedTeams[0] : sortedPlayers[0]
  const winnerName = isTeamMode ? winner?.name : winner?.name

  // ─── Fun Awards ─────────────────────────────────────────────────────────────
  // In team mode aggregate stats per team; in classic use individual players.
  const awardEntities = isTeamMode
    ? sortedTeams.map(team => ({
        id: team.id,
        name: team.name,
        correctAnswers: players.filter(p => team.playerIds.includes(p.id)).reduce((s, p) => s + p.correctAnswers, 0),
        wrongAnswers:   players.filter(p => team.playerIds.includes(p.id)).reduce((s, p) => s + p.wrongAnswers, 0),
        drinksReceived: players.filter(p => team.playerIds.includes(p.id)).reduce((s, p) => s + p.drinksReceived, 0),
      }))
    : players

  const getAward = (key, label) => {
    const max = Math.max(...awardEntities.map(e => e[key]))
    const winners = awardEntities.filter(e => e[key] === max)
    return { names: winners.map(e => e.name), stat: max, label }
  }

  const songGod   = getAward('correctAnswers', 'correct answers')
  const worstEar  = getAward('wrongAnswers',   'wrong answers')
  const mostDrunk = getAward('drinksReceived', 'drinks received')

  const formatNames = (names) => names.join(' & ')

  const handlePlayAgain = () => {
    dispatch({ type: ACTIONS.RESET_ROUNDS })
    navigate('/game')
  }

  const handleChangeSettings = () => {
    navigate('/setup')
  }

  const handleMainMenu = () => {
    dispatch({ type: ACTIONS.RESET_ALL })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-groove-bg page-container page-enter pb-10">

      {/* ─── Winner Announcement ──────────────────────────────────── */}
      <div className="text-center py-8 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
            <VinylRecord size={200} spinning />
          </div>
        </div>

        <div className="relative z-10 animate-bounce-in">
          <div className="text-6xl mb-3">🏆</div>
          <h1
            className="font-display text-4xl text-white mb-1"
            style={{ textShadow: '0 0 40px rgba(249,115,22,0.7)' }}
          >
            Game Over!
          </h1>
          {winnerName && (
            <div className="font-display text-2xl text-groove-orange mt-2 text-glow-orange">
              {isTeamMode ? '⚔️' : '🎵'} {winnerName} wins!
            </div>
          )}
        </div>
      </div>

      {/* ─── Leaderboard ─────────────────────────────────────────── */}
      <section className="card mb-4">
        <h2 className="section-label mb-3">
          {isTeamMode ? '⚔️ Final Team Scores' : '🏅 Final Standings'}
        </h2>

        {isTeamMode ? (
          <div className="space-y-2">
            {sortedTeams.map((team, rank) => {
              const colour = TEAM_COLOURS[team.colorIndex ?? rank] ?? TEAM_COLOURS[0]
              return (
                <div
                  key={team.id}
                  className="flex items-center gap-3 py-3 px-3 rounded-xl"
                  style={{ backgroundColor: `${colour.hex}18`, border: `1px solid ${colour.hex}40` }}
                >
                  <span className="text-2xl">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉'}
                  </span>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colour.hex }} />
                  <div className="flex-1">
                    <div className="text-white font-display text-lg">{team.name}</div>
                    <div className="text-xs text-gray-400">
                      {players.filter(p => team.playerIds.includes(p.id)).map(p => p.name).join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-groove-gold text-xl">{team.score}</div>
                    <div className="text-xs text-gray-500">pts</div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPlayers.map((player, rank) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-all
                  ${rank === 0 ? 'bg-groove-orange-glow border border-groove-orange/30' : 'bg-groove-cardLight'}`}
              >
                <span className="text-2xl w-8 text-center">
                  {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}`}
                </span>
                <div className="flex-1">
                  <div className={`font-display text-lg ${rank === 0 ? 'text-groove-orange' : 'text-white'}`}>
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    ✅ {player.correctAnswers} correct · ❌ {player.wrongAnswers} wrong · 🍺 {player.drinksReceived} drinks
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-groove-gold text-xl">{player.score}</div>
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Team Battle: Losing Team Drinks ─────────────────────── */}
      {isTeamMode && sortedTeams.length >= 2 && (() => {
        const loser = sortedTeams[sortedTeams.length - 1]
        const isTie = sortedTeams[0].score === loser.score
        const loserPlayers = players.filter(p => loser.playerIds.includes(p.id))
        return (
          <section className="mb-4">
            <div
              className="font-display text-xl text-white py-5 px-5 rounded-2xl text-center"
              style={{
                background: isTie
                  ? 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(236,72,153,0.1))'
                  : 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.05))',
                border: isTie ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(239,68,68,0.4)',
              }}
            >
              {isTie ? (
                <>🤝 It's a tie — <span className="text-groove-orange">EVERYONE DRINKS!</span></>
              ) : (
                <>
                  🍺 <span className="text-red-400">{loser.name} loses!</span>
                  <div className="text-base font-sans font-normal text-gray-300 mt-1">
                    {loserPlayers.map(p => p.name).join(', ')} — down your FULL drink!
                  </div>
                </>
              )}
            </div>
          </section>
        )
      })()}

      {/* ─── Fun Awards ──────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="section-label mb-3">🎖️ Awards</h2>

        <div className="space-y-3">
          {/* Song God */}
          <div className="card border-groove-gold/30 bg-groove-gold/5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="font-display text-groove-gold text-lg">Song God</div>
                <div className="text-white font-medium">
                  {formatNames(songGod.names)}
                  {songGod.names.length > 1 && ' (Shared)'}
                </div>
                <div className="text-xs text-gray-400">
                  {songGod.stat} {songGod.label}
                </div>
              </div>
            </div>
          </div>

          {/* Worst Ear */}
          <div className="card border-red-500/30 bg-red-900/5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">👂</span>
              <div>
                <div className="font-display text-red-400 text-lg">Worst Ear</div>
                <div className="text-white font-medium">
                  {formatNames(worstEar.names)}
                  {worstEar.names.length > 1 && ' (Shared)'}
                </div>
                <div className="text-xs text-gray-400">
                  {worstEar.stat} {worstEar.label}
                </div>
              </div>
            </div>
          </div>

          {/* Most Drunk */}
          <div className="card border-groove-orange/30 bg-groove-orange/5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🍺</span>
              <div>
                <div className="font-display text-groove-orange text-lg">Most Drunk</div>
                <div className="text-white font-medium">
                  {formatNames(mostDrunk.names)}
                  {mostDrunk.names.length > 1 && ' (Shared)'}
                </div>
                <div className="text-xs text-gray-400">
                  {mostDrunk.stat} {mostDrunk.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Action Buttons ───────────────────────────────────────── */}
      <div className="space-y-3">
        <PrimaryButton onClick={handlePlayAgain}>
          🔁 Play Again
        </PrimaryButton>
        <SecondaryButton onClick={handleChangeSettings}>
          ⚙️ Change Settings
        </SecondaryButton>
        <SecondaryButton onClick={handleMainMenu}>
          🏠 Main Menu
        </SecondaryButton>
      </div>

      <p className="text-center text-xs text-gray-700 mt-6">
        🔞 Thanks for playing Booze Groove — drink responsibly!
      </p>
    </div>
  )
}

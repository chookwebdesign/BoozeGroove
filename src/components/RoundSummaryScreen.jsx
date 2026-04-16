import React from 'react'
import { GAME_MODES, TEAM_COLOURS } from '../constants/gameConstants.js'

/**
 * Full-screen round summary shown after a complete round
 * in Competitive or Team Battle modes.
 */
export default function RoundSummaryScreen({ open, round, gameMode, players, teams, onContinue }) {
  if (!open) return null

  const isTeam = gameMode === GAME_MODES.TEAM_BATTLE

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

  // Who drinks? In competitive, last place drinks. In team battle, losing team drinks.
  const getDrinkingInstructions = () => {
    if (isTeam) {
      if (sortedTeams.length < 2) return null
      const loser = sortedTeams[sortedTeams.length - 1]
      const isTie = sortedTeams[0].score === loser.score
      if (isTie) return '🤝 It\'s a tie — EVERYONE DRINKS!'
      const loserPlayers = players.filter(p => loser.playerIds.includes(p.id))
      return `🍺 ${loser.name} loses! ${loserPlayers.map(p => p.name).join(', ')} all drink!`
    } else {
      if (sortedPlayers.length < 2) return null
      const loser = sortedPlayers[sortedPlayers.length - 1]
      return `🍺 ${loser.name} is last — they drink!`
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center p-6 overflow-y-auto"
      style={{ background: 'rgba(8,8,16,0.97)', backdropFilter: 'blur(8px)' }}>

      <div className="max-w-sm w-full space-y-5 animate-slide-up py-6">
        <div className="text-center">
          <div className="text-4xl mb-1">📊</div>
          <h2 className="font-display text-3xl text-white">Round {round} Done!</h2>
          <p className="text-gray-400 text-sm mt-1">Here's where everyone stands</p>
        </div>

        {/* Scores */}
        <div className="card space-y-2">
          <div className="section-label">Scores</div>
          {isTeam
            ? sortedTeams.map((team, rank) => {
                const colour = TEAM_COLOURS[team.colorIndex ?? rank] ?? TEAM_COLOURS[0]
                return (
                  <div key={team.id} className="flex items-center gap-3 py-2 border-b border-groove-border last:border-0">
                    <span className="text-lg">
                      {rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉'}
                    </span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colour.hex }} />
                    <span className="flex-1 text-white font-medium">{team.name}</span>
                    <span className="font-display text-groove-gold text-lg">{team.score}</span>
                  </div>
                )
              })
            : sortedPlayers.map((player, rank) => (
                <div key={player.id} className="flex items-center gap-3 py-2 border-b border-groove-border last:border-0">
                  <span className="text-lg">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}
                  </span>
                  <span className="flex-1 text-white font-medium">{player.name}</span>
                  <div className="text-right">
                    <div className="font-display text-groove-gold">{player.score} pts</div>
                    <div className="text-xs text-gray-500">{player.drinksReceived} drinks</div>
                  </div>
                </div>
              ))
          }
        </div>

        {/* Drinking instructions */}
        {getDrinkingInstructions() && (
          <div
            className="animate-drink-in font-display text-lg text-white py-4 px-5 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(236,72,153,0.1))',
              border: '1px solid rgba(249,115,22,0.3)',
            }}
          >
            {getDrinkingInstructions()}
          </div>
        )}

        <button
          onClick={onContinue}
          className="btn-primary"
        >
          Continue to Round {round + 1} →
        </button>
      </div>
    </div>
  )
}

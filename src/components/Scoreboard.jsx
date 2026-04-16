import React, { useState } from 'react'
import { GAME_MODES, TEAM_COLOURS } from '../constants/gameConstants.js'

/**
 * Compact collapsible scoreboard shown at the top of the game page.
 */
export default function Scoreboard({ gameMode, players, teams }) {
  const [collapsed, setCollapsed] = useState(false)

  const isTeam = gameMode === GAME_MODES.TEAM_BATTLE

  if (gameMode === GAME_MODES.SUFFER) return null

  const sorted = isTeam
    ? [...teams].sort((a, b) => b.score - a.score)
    : [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="card mb-3">
      <button
        type="button"
        className="w-full flex items-center justify-between text-sm font-medium text-gray-400"
        onClick={() => setCollapsed(c => !c)}
      >
        <span className="font-display text-base text-white">
          {isTeam ? '⚔️ Team Scores' : '🏆 Leaderboard'}
        </span>
        <span className="text-xs">{collapsed ? '▼ Show' : '▲ Hide'}</span>
      </button>

      {!collapsed && (
        <div className="mt-2 space-y-1 animate-fade-in">
          {isTeam
            ? sorted.map((team, rank) => {
                const colour = TEAM_COLOURS[team.colorIndex ?? rank] ?? TEAM_COLOURS[0]
                return (
                  <div
                    key={team.id}
                    className="flex items-center gap-2 py-1 px-2 rounded-lg"
                    style={{ backgroundColor: `${colour.hex}15` }}
                  >
                    <span className="text-xs text-gray-500 w-4">{rank + 1}</span>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colour.hex }}
                    />
                    <span className="flex-1 text-white text-sm font-medium">{team.name}</span>
                    <span className="font-display text-groove-gold">{team.score} pts</span>
                  </div>
                )
              })
            : sorted.map((player, rank) => (
                <div key={player.id} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-groove-cardLight">
                  <span className="text-xs text-gray-500 w-4">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : rank + 1}
                  </span>
                  <span className="flex-1 text-white text-sm font-medium">{player.name}</span>
                  <span className="font-display text-groove-gold">{player.score} pts</span>
                </div>
              ))
          }
        </div>
      )}
    </div>
  )
}

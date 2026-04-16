import React, { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { ACTIONS } from '../context/GameContext.jsx'
import { TEAM_COLOURS } from '../constants/gameConstants.js'
import PlayerChip from './PlayerChip.jsx'

/**
 * Team management section with drag-and-drop (desktop) and tap-to-move (mobile).
 */
export default function TeamSection() {
  const { state, dispatch } = useGame()
  const { teams, players } = state
  const [draggedPlayerId, setDraggedPlayerId] = useState(null)
  const [dragOverTeamId, setDragOverTeamId] = useState(null)
  const [movingPlayerId, setMovingPlayerId] = useState(null) // for mobile tap-to-move

  const handleDragStart = (e, playerId) => {
    setDraggedPlayerId(playerId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, teamId) => {
    e.preventDefault()
    setDragOverTeamId(teamId)
  }

  const handleDrop = (e, teamId) => {
    e.preventDefault()
    if (draggedPlayerId) {
      dispatch({ type: ACTIONS.MOVE_PLAYER_TO_TEAM, payload: { playerId: draggedPlayerId, toTeamId: teamId } })
    }
    setDraggedPlayerId(null)
    setDragOverTeamId(null)
  }

  const handleDragEnd = () => {
    setDraggedPlayerId(null)
    setDragOverTeamId(null)
  }

  // Mobile: tap player chip to select, then tap team to move
  const handlePlayerTap = (playerId) => {
    if (movingPlayerId === playerId) {
      setMovingPlayerId(null)
    } else {
      setMovingPlayerId(playerId)
    }
  }

  const handleTeamTapMove = (teamId) => {
    if (movingPlayerId) {
      dispatch({ type: ACTIONS.MOVE_PLAYER_TO_TEAM, payload: { playerId: movingPlayerId, toTeamId: teamId } })
      setMovingPlayerId(null)
    }
  }

  const handleUpdateTeamName = (teamId, name) => {
    dispatch({ type: ACTIONS.UPDATE_TEAM_NAME, payload: { teamId, name } })
  }

  const handleAddTeam = () => {
    dispatch({ type: ACTIONS.ADD_TEAM })
  }

  const handleRemoveTeam = (teamId) => {
    dispatch({ type: ACTIONS.REMOVE_TEAM, payload: teamId })
  }

  const unassigned = players.filter(p => !teams.some(t => t.playerIds.includes(p.id)))

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Instruction hint for mobile */}
      {movingPlayerId && (
        <div className="text-center text-sm text-groove-orange animate-pulse">
          Tap a team below to move{' '}
          <strong>{players.find(p => p.id === movingPlayerId)?.name}</strong>
        </div>
      )}
      {!movingPlayerId && (
        <p className="text-xs text-gray-500 text-center">
          Drag players between teams, or tap a player then tap a team to move them.
        </p>
      )}

      {/* Team cards */}
      {teams.map((team, idx) => {
        const colour = TEAM_COLOURS[team.colorIndex ?? idx] ?? TEAM_COLOURS[0]
        const teamPlayers = players.filter(p => team.playerIds.includes(p.id))
        const isDropTarget = dragOverTeamId === team.id
        const isMoveTarget = !!movingPlayerId

        return (
          <div
            key={team.id}
            onDragOver={(e) => handleDragOver(e, team.id)}
            onDrop={(e) => handleDrop(e, team.id)}
            onDragLeave={() => setDragOverTeamId(null)}
            onClick={() => isMoveTarget && handleTeamTapMove(team.id)}
            className={`
              rounded-xl border-2 p-3 transition-all duration-150
              ${isDropTarget ? 'drag-over' : `border-groove-border`}
              ${isMoveTarget ? 'cursor-pointer hover:border-groove-orange' : ''}
              bg-groove-card
            `}
          >
            {/* Team header */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: colour.hex }}
              />
              <input
                type="text"
                value={team.name}
                onChange={(e) => handleUpdateTeamName(team.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent font-display text-white text-base outline-none
                           border-b border-transparent hover:border-groove-border focus:border-groove-orange
                           transition-colors flex-1 min-w-0"
                maxLength={20}
              />
              <span className="text-xs text-gray-500">{teamPlayers.length} players</span>
              {teams.length > 2 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveTeam(team.id) }}
                  className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Players in team */}
            <div className="flex flex-wrap gap-2 min-h-8">
              {teamPlayers.length === 0 && (
                <span className="text-xs text-gray-600 italic">Drop players here</span>
              )}
              {teamPlayers.map(p => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, p.id)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => { e.stopPropagation(); handlePlayerTap(p.id) }}
                  className={`
                    inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                    cursor-grab active:cursor-grabbing transition-all duration-150
                    ${movingPlayerId === p.id ? 'ring-2 ring-groove-orange scale-105' : ''}
                    border
                  `}
                  style={{
                    borderColor: colour.hex,
                    backgroundColor: `${colour.hex}22`,
                    color: colour.hex,
                  }}
                >
                  👤 {p.name}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Unassigned players */}
      {unassigned.length > 0 && (
        <div className="rounded-xl border-2 border-dashed border-groove-border p-3">
          <div className="text-xs text-gray-500 mb-2">Unassigned players:</div>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(p => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handlePlayerTap(p.id)}
                className={`
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                  bg-groove-card border border-groove-border text-gray-300
                  cursor-grab active:cursor-grabbing transition-all duration-150
                  ${movingPlayerId === p.id ? 'ring-2 ring-groove-orange scale-105' : ''}
                `}
              >
                👤 {p.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add team button */}
      {teams.length < 4 && (
        <button
          type="button"
          onClick={handleAddTeam}
          className="w-full py-2 rounded-xl border border-dashed border-groove-border
                     text-gray-400 hover:text-groove-orange hover:border-groove-orange
                     transition-colors text-sm font-medium"
        >
          + Add Team
        </button>
      )}
    </div>
  )
}

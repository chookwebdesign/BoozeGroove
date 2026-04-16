import React from 'react'

/**
 * Small removable chip showing a player's name.
 */
export default function PlayerChip({ player, onRemove, draggable = false, onDragStart, compact = false }) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`
        inline-flex items-center gap-2 rounded-full border border-groove-border
        bg-groove-cardLight text-white font-medium select-none
        ${compact ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base'}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        transition-all duration-150
      `}
    >
      <span className="text-groove-orange">👤</span>
      <span>{player.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(player.id)}
          className="w-5 h-5 rounded-full bg-groove-border hover:bg-red-600 flex items-center justify-center
                     text-gray-400 hover:text-white transition-colors duration-150 flex-shrink-0"
          aria-label={`Remove ${player.name}`}
        >
          <span className="text-xs">×</span>
        </button>
      )}
    </div>
  )
}

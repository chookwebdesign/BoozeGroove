import React from 'react'
import { GAME_MODE_META } from '../constants/gameConstants.js'

/**
 * Tappable card for selecting a game mode on the main page.
 */
export default function GameModeCard({ mode, selected, onSelect }) {
  const meta = GAME_MODE_META[mode]
  if (!meta) return null

  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      className={`
        w-full text-left rounded-2xl p-4 border-2 transition-all duration-200
        active:scale-95 select-none cursor-pointer
        flex items-center gap-4
        ${selected
          ? 'border-groove-orange bg-groove-orange-glow'
          : 'border-groove-border bg-groove-card hover:border-gray-500'
        }
      `}
      style={selected ? { boxShadow: '0 0 20px rgba(249,115,22,0.3)' } : {}}
    >
      {/* Icon */}
      <div
        className={`
          w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
          bg-gradient-to-br ${meta.color}
          ${selected ? 'scale-110' : ''}
          transition-transform duration-200
        `}
      >
        {meta.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className={`font-display text-lg ${selected ? 'text-groove-orange' : 'text-white'}`}>
          {meta.label}
        </div>
        <div className="text-sm text-gray-400 leading-tight">{meta.description}</div>
      </div>

      {/* Checkmark */}
      <div
        className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${selected ? 'border-groove-orange bg-groove-orange' : 'border-groove-border bg-transparent'}
        `}
      >
        {selected && <span className="text-white text-xs">✓</span>}
      </div>
    </button>
  )
}

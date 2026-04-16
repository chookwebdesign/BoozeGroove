import React from 'react'

const CHAOS_COLOURS = [
  { bg: 'from-purple-600 to-pink-600', border: 'border-purple-500' },
  { bg: 'from-orange-500 to-red-600', border: 'border-orange-400' },
  { bg: 'from-pink-500 to-purple-700', border: 'border-pink-400' },
  { bg: 'from-yellow-500 to-orange-600', border: 'border-yellow-400' },
  { bg: 'from-blue-500 to-purple-600', border: 'border-blue-400' },
  { bg: 'from-green-500 to-teal-600', border: 'border-green-400' },
]

/**
 * Displays the current Party Chaos rule card.
 */
export default function ChaosCard({ chaosCard }) {
  if (!chaosCard) return null

  // Pick a deterministic colour based on the card id
  const colourIdx = chaosCard.id
    ? chaosCard.id.replace(/\D/g, '') % CHAOS_COLOURS.length
    : 0
  const colour = CHAOS_COLOURS[Number(colourIdx) % CHAOS_COLOURS.length]

  return (
    <div
      className={`
        w-full rounded-2xl p-4 border-2 ${colour.border}
        bg-gradient-to-br ${colour.bg}
        animate-bounce-in text-center
      `}
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
    >
      <div className="text-xs font-medium text-white/70 uppercase tracking-widest mb-1">
        🎲 Chaos Rule
      </div>
      <div className="font-display text-white text-lg leading-snug">
        {chaosCard.text}
      </div>
      <div className="text-xs text-white/60 mt-1">Intensity: {chaosCard.intensity}</div>
    </div>
  )
}

import React from 'react'

/**
 * Decorative floating music notes and vinyl records
 * Used on the main page header and as background decoration.
 */
export function FloatingNotes({ className = '' }) {
  const notes = ['♪', '♫', '♩', '♬', '🎵']
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      {notes.map((n, i) => (
        <span
          key={i}
          className="absolute text-groove-orange opacity-30 float-note"
          style={{
            left: `${10 + i * 18}%`,
            top: `${20 + (i % 3) * 25}%`,
            fontSize: `${1 + (i % 2) * 0.5}rem`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${2.5 + (i % 3) * 0.8}s`,
          }}
        >
          {n}
        </span>
      ))}
    </div>
  )
}

/**
 * Vinyl record SVG decoration
 */
export function VinylRecord({ size = 80, spinning = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${spinning ? 'vinyl-spin' : ''} ${className}`}
      aria-hidden
    >
      {/* Outer record */}
      <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke="#2a2a50" strokeWidth="1" />
      {/* Grooves */}
      {[38, 30, 22].map(r => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#2a2a50" strokeWidth="0.5" />
      ))}
      {/* Label */}
      <circle cx="50" cy="50" r="14" fill="#f97316" />
      <circle cx="50" cy="50" r="10" fill="#fb923c" />
      {/* Centre hole */}
      <circle cx="50" cy="50" r="3" fill="#080810" />
      {/* Highlight */}
      <ellipse cx="35" cy="30" rx="6" ry="4" fill="white" opacity="0.08" transform="rotate(-30 35 30)" />
    </svg>
  )
}

/**
 * Waveform bar decoration (static, not animated)
 */
export function WaveformDecor({ bars = 12, className = '' }) {
  return (
    <div className={`flex items-end gap-1 ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const h = [40, 70, 90, 60, 80, 50, 95, 45, 75, 55, 85, 35][i % 12]
        return (
          <div
            key={i}
            className="waveform-bar opacity-20"
            style={{ height: `${h}%`, minHeight: 4, flex: 1 }}
          />
        )
      })}
    </div>
  )
}

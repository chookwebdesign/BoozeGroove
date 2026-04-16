import React, { useEffect } from 'react'
import { useTimer } from '../hooks/useTimer.js'

/**
 * Large countdown timer display.
 * Shows pulsing animation when under 5 seconds.
 */
export default function Timer({ seconds, active, paused = false, onComplete, onReset }) {
  const { timeLeft, start, pause, reset } = useTimer(seconds, onComplete)

  // Start fresh whenever active goes true
  useEffect(() => {
    if (active) {
      reset(seconds)
      start()
    } else {
      pause()
    }
  }, [active, seconds])

  // Pause/resume without resetting (e.g. hint overlay open)
  useEffect(() => {
    if (!active) return
    if (paused) {
      pause()
    } else {
      start()
    }
  }, [paused])

  const isLow = timeLeft <= 5 && timeLeft > 0
  const isDone = timeLeft === 0

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        w-28 h-28 rounded-full border-4 mx-auto
        font-display select-none
        transition-all duration-300
        ${isDone
          ? 'border-red-500 bg-red-900/20'
          : isLow
          ? 'border-red-400 bg-red-900/10 animate-timer-pulse'
          : 'border-groove-orange bg-groove-orange-glow'
        }
      `}
    >
      {/* Circular progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 112 112"
      >
        <circle
          cx="56"
          cy="56"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-groove-border"
        />
        <circle
          cx="56"
          cy="56"
          r="50"
          fill="none"
          strokeWidth="4"
          stroke={isDone ? '#ef4444' : isLow ? '#f97316' : '#f97316'}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 50}`}
          strokeDashoffset={`${2 * Math.PI * 50 * (1 - timeLeft / seconds)}`}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>

      <span
        className={`text-4xl z-10 ${isDone ? 'text-red-400' : isLow ? 'text-orange-300 animate-timer-pulse' : 'text-white'}`}
      >
        {timeLeft}
      </span>
      <span className="text-xs text-gray-400 z-10">secs</span>
    </div>
  )
}

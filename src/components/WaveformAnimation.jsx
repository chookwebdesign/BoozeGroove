import React, { useEffect, useState, useRef } from 'react'

const BAR_COUNT = 24

/**
 * Animated waveform progress bar.
 * Always calls onComplete after clipLength seconds when active — this is the
 * fallback timer that advances the game even if audio playback fails.
 * playKey should change on each fresh play (not on pause/resume) to reset progress.
 */
export default function WaveformAnimation({ active = false, clipLength = 5, onComplete, hasPreview = false, playKey = 0 }) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const savedProgressRef = useRef(0)

  // Reset only when a genuinely new clip starts
  useEffect(() => {
    savedProgressRef.current = 0
    setProgress(0)
  }, [playKey])

  useEffect(() => {
    if (active) {
      // Resume from where we paused
      startTimeRef.current = Date.now() - savedProgressRef.current * clipLength * 1000

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const pct = Math.min(elapsed / clipLength, 1)
        setProgress(pct)
        savedProgressRef.current = pct

        if (pct >= 1) {
          clearInterval(intervalRef.current)
          onComplete?.()
        }
      }, 50)
    } else {
      // Pause — save progress in ref, leave visual state as-is
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [active, clipLength])

  return (
    <div className="w-full space-y-3">
      {/* Waveform bars */}
      <div className="flex items-center justify-center gap-1 h-16">
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const delays = [0, 0.15, 0.3, 0.45, 0.1, 0.25, 0.4, 0.05, 0.2, 0.35, 0.15, 0.3]
          const durations = [1.0, 1.4, 0.9, 1.2, 1.1, 0.95, 1.3, 1.05, 0.85, 1.25, 1.15, 0.9]
          const delay = delays[i % delays.length]
          const duration = durations[i % durations.length]

          return (
            <div
              key={i}
              className="waveform-bar flex-1"
              style={{
                height: active ? '100%' : '25%',
                minHeight: 4,
                animation: active
                  ? `waveform ${duration}s ease-in-out ${delay}s infinite`
                  : 'none',
                opacity: active ? 0.9 : 0.3,
                transition: 'opacity 0.3s',
              }}
            />
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-groove-border rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #f97316, #ec4899)',
            transition: active ? 'width 0.05s linear' : 'none',
          }}
        />
      </div>

      {/* Countdown label */}
      <div className="text-center text-xs text-gray-500">
        {progress > 0
          ? `${Math.max(0, Math.round(clipLength - progress * clipLength))}s remaining`
          : `${clipLength}s clip`}
      </div>
    </div>
  )
}

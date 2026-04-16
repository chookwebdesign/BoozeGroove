import React, { useState, useCallback, useRef, useEffect } from 'react'
import WaveformAnimation from './WaveformAnimation.jsx'

/**
 * Audio player component.
 * - If song.previewUrl is set: plays the real Spotify 30s preview, clipped to clipLength.
 * - WaveformAnimation ALWAYS drives the clip timer as a fallback — if audio fails for
 *   any reason (autoplay blocked, CORS, null URL) the game still advances normally.
 */
export default function AudioPlayer({ song, clipLength = 5, onClipStart, onClipEnd, hideAlbumArt = false, stopped = false }) {
  const [phase, setPhase] = useState('idle') // idle | playing | paused | finished
  const [playCount, setPlayCount] = useState(0)
  const [audioError, setAudioError] = useState(null)
  const audioRef = useRef(null)
  const stopTimerRef = useRef(null)
  const clipEndFiredRef = useRef(false) // prevent double-firing onClipEnd

  // Reset player when the song changes
  useEffect(() => {
    stopAudio()
    setPhase('idle')
    setPlayCount(0)
    setAudioError(null)
    clipEndFiredRef.current = false

    console.log('[AudioPlayer] Song loaded:', {
      id: song?.id,
      title: song?.title,
      artist: song?.artist,
      previewUrl: song?.previewUrl ?? 'NULL — no preview available',
      albumArt: song?.albumArt ? '✅' : '❌',
    })
  }, [song?.id])

  useEffect(() => {
    return () => stopAudio()
  }, [])

  // Stop audio immediately when parent signals an answer was given
  useEffect(() => {
    if (stopped) {
      stopAudio()
      clipEndFiredRef.current = true // prevent onClipEnd firing after answer
      setPhase('idle')
    }
  }, [stopped])

  // Track remaining time so pause/resume works correctly
  const pausedAtRef    = useRef(null) // timestamp when paused
  const remainingMsRef = useRef(null) // ms left on clip timer when paused

  function stopAudio() {
    clearTimeout(stopTimerRef.current)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    pausedAtRef.current    = null
    remainingMsRef.current = null
  }

  // Single source of truth for clip ending — guards against double-fire
  const fireClipEnd = useCallback(() => {
    if (clipEndFiredRef.current) return
    clipEndFiredRef.current = true
    setPhase('finished')
    onClipEnd?.()
  }, [onClipEnd])

  const handlePlay = useCallback(() => {
    if (phase === 'playing') return
    if (playCount >= 2) return

    console.log('[AudioPlayer] ▶ Play tapped —', song?.previewUrl ? 'real audio' : 'mock mode')

    clipEndFiredRef.current = false
    setAudioError(null)
    setPhase('playing')
    setPlayCount(prev => prev + 1)
    onClipStart?.()

    if (song?.previewUrl) {
      const audio = new Audio()
      audio.volume = 1
      audioRef.current = audio

      audio.addEventListener('error', () => {
        setAudioError(null) // suppress error message — timer still runs
      })

      audio.addEventListener('ended', () => {
        console.log('[AudioPlayer] Audio ended naturally')
        clearTimeout(stopTimerRef.current)
        fireClipEnd()
      })

      const duration = clipLength * 1000
      stopTimerRef.current = setTimeout(() => {
        audio.pause()
        console.log('[AudioPlayer] Clip timer fired — stopping audio')
        fireClipEnd()
      }, duration)

      pausedAtRef.current    = Date.now()
      remainingMsRef.current = duration

      audio.src = song.previewUrl
      audio.play().catch(err => {
        console.warn('[AudioPlayer] play() rejected:', err.message)
      })
    }
  }, [phase, playCount, song, clipLength, fireClipEnd])

  const handlePause = useCallback(() => {
    if (phase !== 'playing') return
    setPhase('paused')

    // Pause audio
    if (audioRef.current) audioRef.current.pause()

    // Save remaining clip time
    clearTimeout(stopTimerRef.current)
    if (pausedAtRef.current !== null && remainingMsRef.current !== null) {
      const elapsed = Date.now() - pausedAtRef.current
      remainingMsRef.current = Math.max(remainingMsRef.current - elapsed, 0)
    }
  }, [phase])

  const handleResume = useCallback(() => {
    if (phase !== 'paused') return
    setPhase('playing')

    if (audioRef.current) audioRef.current.play().catch(() => {})

    pausedAtRef.current = Date.now()
    stopTimerRef.current = setTimeout(() => {
      if (audioRef.current) audioRef.current.pause()
      console.log('[AudioPlayer] Clip timer fired — stopping audio')
      fireClipEnd()
    }, remainingMsRef.current)
  }, [phase, fireClipEnd])

  const hasPreview = !!song?.previewUrl

  return (
    <div className="flex flex-col items-center gap-6 w-full">

      {/* Album art */}
      {!hideAlbumArt && song?.albumArt && (
        <div
          className={`w-24 h-24 rounded-xl overflow-hidden border-2 border-groove-border
            ${phase === 'playing' ? 'border-groove-orange shadow-neon-orange' : ''}
            transition-all duration-300`}
        >
          <img src={song.albumArt} alt="Album art" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Play / Pause / Resume / Replay button */}
      <button
        onClick={
          phase === 'playing' ? handlePause :
          phase === 'paused'  ? handleResume :
          handlePlay
        }
        disabled={playCount >= 2 && phase === 'finished'}
        className={`
          w-28 h-28 rounded-full font-display text-white text-lg font-bold
          transition-all duration-150 active:scale-90 select-none
          flex flex-col items-center justify-center gap-1
          disabled:cursor-not-allowed
          ${phase === 'idle'
            ? 'bg-gradient-to-br from-groove-orange to-orange-400 shadow-neon-orange-lg animate-glow-pulse'
            : phase === 'playing'
            ? 'bg-gradient-to-br from-groove-orange to-orange-400 shadow-neon-orange-lg'
            : phase === 'paused'
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'
            : playCount < 2
            ? 'bg-gradient-to-br from-groove-pink to-pink-400 shadow-neon-pink'
            : 'bg-groove-card border border-groove-border opacity-50'
          }
        `}
      >
        {phase === 'idle'    && (<><span className="text-3xl">▶</span><span className="text-xs">PLAY</span></>)}
        {phase === 'playing' && (<><span className="text-3xl">⏸</span><span className="text-xs">PAUSE</span></>)}
        {phase === 'paused'  && (<><span className="text-3xl">▶</span><span className="text-xs">RESUME</span></>)}
        {phase === 'finished' && playCount < 2 && (<><span className="text-3xl">🔁</span><span className="text-xs">REPLAY</span></>)}
        {phase === 'finished' && playCount >= 2 && (<><span className="text-3xl">✓</span><span className="text-xs">DONE</span></>)}
      </button>

      {/* Waveform — animates while playing, pauses when paused */}
      <WaveformAnimation
        active={phase === 'playing'}
        clipLength={clipLength}
        hasPreview={hasPreview}
        onComplete={fireClipEnd}
        playKey={playCount}
      />
    </div>
  )
}

import React, { useEffect, useState } from 'react'

/**
 * Full-screen animated overlay shown after the host confirms an answer.
 * Shows song title/artist, result, and drinking instructions.
 */
export default function RoundResultOverlay({ open, song, result, playerName, points, drinks, sufferMessage, sufferTarget, onNext }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (open) {
      setTimeout(() => setAnimate(true), 50)
    } else {
      setAnimate(false)
    }
  }, [open])

  if (!open) return null

  const isCorrect    = result === 'correct'
  const isArtistOnly = result === 'artistOnly'

  const getBgGradient = () => {
    if (isCorrect)    return 'from-green-900/90 to-groove-bg'
    if (isArtistOnly) return 'from-yellow-900/90 to-groove-bg'
    return 'from-red-900/90 to-groove-bg'
  }
  const getResultEmoji  = () => isCorrect ? '🎉' : isArtistOnly ? '🎤' : '❌'
  const getResultText   = () => isCorrect ? 'Correct!' : isArtistOnly ? 'Artist Only!' : 'Wrong!'
  const getResultColour = () => isCorrect ? 'text-green-400' : isArtistOnly ? 'text-yellow-400' : 'text-red-400'

  const getDrinkContent = () => {
    if (sufferMessage) {
      return sufferTarget ? (
        <>
          <div className="text-groove-pink font-display text-2xl mb-1">{sufferTarget}</div>
          <div className="text-white text-base font-normal">{sufferMessage}</div>
        </>
      ) : sufferMessage
    }
    if (isCorrect) {
      const sips = drinks || 1
      return `🍺 ${playerName} gives out ${sips} sip${sips > 1 ? 's' : ''}!`
    }
    if (isArtistOnly) return `🍺 ${playerName} gives out 1 sip!`
    if (drinks) return `🍺 ${playerName} drinks ${drinks} sip${drinks > 1 ? 's' : ''}!`
    return `🍺 ${playerName} drinks!`
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center p-6 text-center
        bg-gradient-to-b ${getBgGradient()}
        transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className={`space-y-5 max-w-sm w-full ${animate ? 'animate-bounce-in' : ''}`}>

        {/* Result emoji + text */}
        <div>
          <div className="text-6xl mb-2">{getResultEmoji()}</div>
          <h2 className={`font-display text-4xl ${getResultColour()}`}>
            {getResultText()}
          </h2>
          {points > 0 && (
            <div className="font-display text-groove-gold text-2xl mt-1 animate-score-pop">
              +{points} points!
            </div>
          )}
        </div>

        {/* Song reveal */}
        <div className="card animate-slide-up">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">The Song Was</div>
          <div className="font-display text-white text-xl">
            {song ? song.title : '🎵 Song Title'}
          </div>
          <div className="text-groove-orange text-base mt-1">
            {song ? song.artist : 'Artist Name'}
          </div>
          {!song?.previewUrl && (
            <div className="text-xs text-gray-600 mt-2 italic">
              🎧 Spotify integration coming soon
            </div>
          )}
        </div>

        {/* Drink instructions */}
        <div
          className="animate-drink-in font-display text-xl text-white py-4 px-6 rounded-2xl"
          style={{
            background: isCorrect
              ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))'
              : isArtistOnly
              ? 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(234,179,8,0.05))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
            border: isCorrect
              ? '1px solid rgba(34,197,94,0.3)'
              : isArtistOnly
              ? '1px solid rgba(234,179,8,0.3)'
              : '1px solid rgba(239,68,68,0.3)',
          }}
        >
          {getDrinkContent()}
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          className="w-full py-4 px-6 rounded-2xl font-display text-white text-xl
                     bg-gradient-to-r from-groove-orange to-orange-400
                     active:scale-95 transition-all duration-150 select-none"
          style={{ boxShadow: '0 4px 24px rgba(249,115,22,0.4)', minHeight: 60 }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

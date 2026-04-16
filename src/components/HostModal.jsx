import React from 'react'
import { VinylRecord } from './MusicDecor.jsx'

/**
 * Full-screen "Pass to host" modal shown when setup page loads.
 */
export default function HostModal({ open, onReady }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
      style={{ background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(8px)' }}
    >
      <div className="animate-bounce-in space-y-6 max-w-sm w-full">
        {/* Vinyl decoration */}
        <div className="flex justify-center">
          <VinylRecord size={100} spinning />
        </div>

        <div>
          <div className="text-5xl mb-3">🎧</div>
          <h2
            className="font-display text-3xl text-white mb-2"
            style={{ textShadow: '0 0 30px rgba(249,115,22,0.6)' }}
          >
            Pass to Host
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Hand the phone to your host, then tap ready when you're set!
          </p>
        </div>

        <button
          onClick={onReady}
          className="w-full py-5 px-6 rounded-2xl font-display text-white text-xl font-bold
                     bg-gradient-to-r from-groove-orange to-orange-400
                     active:scale-95 transition-all duration-150 select-none"
          style={{ boxShadow: '0 4px 32px rgba(249,115,22,0.5)', minHeight: 68 }}
        >
          I'm Ready — Let's Go! 🎵
        </button>
      </div>
    </div>
  )
}

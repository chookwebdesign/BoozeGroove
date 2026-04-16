import React from 'react'

/**
 * Full-screen confirmation dialog overlay.
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger = false }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div className="card w-full max-w-sm animate-bounce-in text-center space-y-4">
        <div className="text-3xl">{danger ? '⚠️' : '❓'}</div>
        <h3 className="font-display text-xl text-white">{title}</h3>
        {message && <p className="text-gray-400 text-sm">{message}</p>}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-groove-border text-gray-300
                       hover:bg-groove-cardLight transition-colors duration-150 font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-medium text-white transition-colors duration-150 active:scale-95
              ${danger
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-groove-orange hover:bg-groove-orange-light'
              }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

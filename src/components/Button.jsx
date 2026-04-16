import React from 'react'

/**
 * Primary CTA button (orange gradient)
 */
export function PrimaryButton({ children, onClick, disabled, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * Secondary button (dark card with border)
 */
export function SecondaryButton({ children, onClick, disabled, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-secondary disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * Ghost/text button
 */
export function GhostButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-ghost ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * Pink accent button
 */
export function PinkButton({ children, onClick, disabled, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-2xl font-display text-white text-xl font-bold
        bg-gradient-to-r from-groove-pink to-pink-400
        transition-all duration-150 active:scale-95 select-none cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{ boxShadow: '0 4px 24px rgba(236,72,153,0.4)', minHeight: 60 }}
    >
      {children}
    </button>
  )
}

/**
 * Judge action button (large, for host controls)
 */
export function JudgeButton({ children, onClick, variant = 'green', className = '' }) {
  const variants = {
    green: 'bg-green-600 hover:bg-green-500 border-green-500',
    red: 'bg-red-600 hover:bg-red-500 border-red-500',
    yellow: 'bg-yellow-600 hover:bg-yellow-500 border-yellow-500',
    purple: 'bg-purple-600 hover:bg-purple-500 border-purple-500',
    chaos: 'bg-gradient-to-r from-groove-orange to-groove-pink',
  }
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 px-3 rounded-2xl font-display text-white text-base font-bold
        border transition-all duration-150 active:scale-95 select-none cursor-pointer
        ${variants[variant]} ${className}`}
      style={{ minHeight: 60 }}
    >
      {children}
    </button>
  )
}

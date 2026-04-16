/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        groove: {
          bg: '#080810',
          card: '#12122a',
          cardLight: '#1e1e3a',
          border: '#2a2a50',
          orange: '#f97316',
          'orange-light': '#fb923c',
          'orange-glow': 'rgba(249,115,22,0.25)',
          pink: '#ec4899',
          'pink-light': '#f472b6',
          'pink-glow': 'rgba(236,72,153,0.25)',
          gold: '#f59e0b',
        },
      },
      animation: {
        'waveform-1': 'waveform 1.0s ease-in-out infinite',
        'waveform-2': 'waveform 1.4s ease-in-out infinite 0.15s',
        'waveform-3': 'waveform 0.9s ease-in-out infinite 0.3s',
        'waveform-4': 'waveform 1.2s ease-in-out infinite 0.45s',
        'waveform-5': 'waveform 1.1s ease-in-out infinite 0.1s',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slideUp 0.35s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'drink-in': 'drinkIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'score-pop': 'scorePop 0.5s ease-out',
        'timer-pulse': 'timerPulse 0.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.25)' },
          '50%': { transform: 'scaleY(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.08)' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drinkIn: {
          '0%': { transform: 'translateY(40px) scale(0.6)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        scorePop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.6)' },
          '100%': { transform: 'scale(1)' },
        },
        timerPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(249,115,22,0.8)' },
        },
      },
      boxShadow: {
        'neon-orange': '0 0 20px rgba(249,115,22,0.5)',
        'neon-pink': '0 0 20px rgba(236,72,153,0.5)',
        'neon-orange-lg': '0 0 40px rgba(249,115,22,0.4)',
        'neon-pink-lg': '0 0 40px rgba(236,72,153,0.4)',
      },
    },
  },
  plugins: [],
}

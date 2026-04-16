import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Countdown timer hook.
 * @param {number} seconds - Initial seconds to count down from
 * @param {function} onComplete - Called when timer reaches 0
 * @returns {{ timeLeft, isRunning, start, pause, reset }}
 */
export function useTimer(seconds, onComplete) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const start = useCallback(() => {
    clear()
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clear()
          setIsRunning(false)
          // Call outside the updater to avoid setState-during-render warning
          setTimeout(() => onCompleteRef.current?.(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const pause = useCallback(() => {
    clear()
    setIsRunning(false)
  }, [])

  const reset = useCallback((newSeconds) => {
    clear()
    setIsRunning(false)
    setTimeLeft(newSeconds ?? seconds)
  }, [seconds])

  useEffect(() => {
    return () => clear()
  }, [])

  return { timeLeft, isRunning, start, pause, reset }
}

import React from 'react'

/**
 * Single-select pill button group
 */
export function PillSingle({ options, value, onChange, labelFn = (v) => String(v) }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          className={value === opt ? 'pill-btn-active' : 'pill-btn-inactive'}
        >
          {labelFn(opt)}
        </button>
      ))}
    </div>
  )
}

/**
 * Multi-select pill button group
 * Handles "All" toggle logic: selecting All deselects others and vice versa.
 */
export function PillMulti({ options, value, onChange }) {
  const handleClick = (opt) => {
    if (opt === 'All') {
      onChange(['All'])
      return
    }
    let next = value.filter(v => v !== 'All')
    if (next.includes(opt)) {
      next = next.filter(v => v !== opt)
      if (next.length === 0) next = ['All']
    } else {
      next = [...next, opt]
    }
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => handleClick(opt)}
          className={value.includes(opt) ? 'pill-btn-active' : 'pill-btn-inactive'}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

/**
 * Pink variant multi-select (used for decades)
 */
export function PillMultiPink({ options, value, onChange }) {
  const handleClick = (opt) => {
    if (opt === 'All') {
      onChange(['All'])
      return
    }
    let next = value.filter(v => v !== 'All')
    if (next.includes(opt)) {
      next = next.filter(v => v !== opt)
      if (next.length === 0) next = ['All']
    } else {
      next = [...next, opt]
    }
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => handleClick(opt)}
          className={value.includes(opt) ? 'pill-btn-pink-active' : 'pill-btn-inactive'}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

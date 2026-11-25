import { useEffect, useReducer } from 'react'

export function useStoredReducer(key, reducer, fallback) {
  const [state, dispatch] = useReducer(reducer, fallback, (init) => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [key, state])

  return [state, dispatch]
}

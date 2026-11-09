import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export interface PresenceState {
  /** gameId (theme) -> active players in the last 5 minutes */
  byGame: Record<string, number>
  /** total active players across all games */
  online: number
  /** true once at least one snapshot arrived */
  live: boolean
}

/**
 * Subscribes to the public presence SSE stream (GET /games/presence/sse).
 * Counts are derived server-side from real recent spin activity — no data
 * means "nobody spun lately" or the stream is unavailable, and callers should
 * simply hide their badges (never fake numbers).
 */
export function usePresence(): PresenceState {
  const [state, setState] = useState<PresenceState>({ byGame: {}, online: 0, live: false })

  useEffect(() => {
    if (typeof EventSource === 'undefined') return

    let es: EventSource | null = null
    try {
      es = new EventSource(`${API_URL}/games/presence/sse`)
    } catch {
      return
    }

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { byGame?: Record<string, number>; online?: number }
        setState({
          byGame: data.byGame ?? {},
          online: data.online ?? 0,
          live: true
        })
      } catch {
        /* ignore malformed event */
      }
    }
    es.onerror = () => {
      // EventSource auto-reconnects; keep last known data meanwhile.
    }

    return () => {
      es?.close()
    }
  }, [])

  return state
}

/** Deterministic dicebear avatar URLs for a game's presence stack. */
export function presenceAvatars(gameId: string, count: number, max = 3): string[] {
  const n = Math.min(count, max)
  return Array.from(
    { length: n },
    (_, i) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(`${gameId}-${i}`)}`
  )
}

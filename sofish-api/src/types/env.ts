import type { D1Database, KVNamespace } from '@cloudflare/workers-types'

export type Bindings = {
  DB: D1Database              // Main game database
  SESSIONS: KVNamespace       // Session storage
  CACHE: KVNamespace          // Response caching
  GAME_STATE: DurableObjectNamespace  // Real-time game state

  JWT_SECRET: string
  ADSENSE_ID: string
}

export type Variables = {
  user: {
    id: string
    email: string
    tokenBalance: number
  }
}

export type HonoEnv = {
  Bindings: Bindings
  Variables: Variables
}

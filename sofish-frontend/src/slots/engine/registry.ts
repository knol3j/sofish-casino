/**
 * slots/engine/registry.ts
 * ---------------------------------------------------------------------------
 * Auto-discovers every game module under src/slots/games/<id>/index.ts.
 * Games register with ZERO shared-file edits: drop in a folder with an
 * index.ts default-exporting a SlotModule and it appears in the lobby.
 */

import type { GameMeta, SlotModule } from './types'

// eager: games are small (inline SVG only) and we want sync lookup by id.
const modules = import.meta.glob<{ default: SlotModule }>('../games/*/index.ts', {
  eager: true
})

const games = new Map<string, SlotModule>()

for (const [path, mod] of Object.entries(modules)) {
  const slot = mod.default
  if (!slot?.meta?.id) {
    console.warn(`[slots] game module at ${path} has no default SlotModule export`)
    continue
  }
  if (games.has(slot.meta.id)) {
    console.warn(`[slots] duplicate game id "${slot.meta.id}" at ${path}`)
    continue
  }
  games.set(slot.meta.id, slot)
}

/** All registered games, sorted by title (lobby order). */
export function listGames(): GameMeta[] {
  return [...games.values()]
    .map((g) => g.meta)
    .sort((a, b) => a.title.localeCompare(b.title))
}

/** Look up a full game module (meta + config) by id. */
export function getGame(id: string): SlotModule | undefined {
  return games.get(id)
}

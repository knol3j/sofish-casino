import { HTTPException } from 'hono/http-exception'
import type { Context } from 'hono'
import type { HonoEnv } from '../types/env'

export const errorHandler = (err: Error, c: Context<HonoEnv>) => {
  console.error('Error:', err)

  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
        status: err.status
      },
      err.status
    )
  }

  return c.json(
    {
      error: 'Internal server error',
      status: 500
    },
    500
  )
}

import { useMutation, useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function useSpinSlots() {
  const mutation = useMutation({
    mutationFn: async (betAmount: number) => {
      const token = getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${API_URL}/games/slots/spin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ betAmount, gameType: 'slots' })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to spin')
      }

      return response.json()
    }
  })

  return mutation
}

export function useLeaderboard(period: string) {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/games/leaderboard/${period}`)
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }
      return response.json()
    },
    refetchInterval: 60000  // Refresh every minute
  })
}

export function useUserBalance() {
  return useQuery({
    queryKey: ['user-balance'],
    queryFn: async () => {
      const token = getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${API_URL}/users/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch balance')
      }

      return response.json()
    }
  })
}

import { useMutation } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        try {
          const error = await response.json()
          throw new Error(error.error || 'Login failed')
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new Error('Invalid response from server')
          }
          throw e
        }
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.token)
      return data
    }
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({ email, username, password }: { email: string; username: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        body: JSON.stringify({ email, username, password })
      })

      if (!response.ok) {
        try {
          const error = await response.json()
          throw new Error(error.error || 'Registration failed')
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new Error('Invalid response from server')
          }
          throw e
        }
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.token)
      return data
    }
  })
}

export function logout() {
  localStorage.removeItem('auth_token')
  window.location.href = '/'
}

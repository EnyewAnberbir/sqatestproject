const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface FetchOptions extends RequestInit {
  token?: string
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options
  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok && response.status === 401) {
    // Token has expired, throw error to trigger refresh
    throw new Error('Token expired')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'API request failed')
  }

  return data
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    return {
      accessToken: data.access,
      refreshToken: data.refresh || refreshToken,
    }
  } catch (error) {
    throw new Error('Failed to refresh token')
  }
} 
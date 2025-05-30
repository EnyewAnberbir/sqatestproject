import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

interface CustomSession {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    accessToken?: string
  }
}

export async function GET(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as CustomSession | null

  if (!session?.user?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || '1'
  const sort = searchParams.get('sort') || 'lastUpdated'
  const order = searchParams.get('order') || 'desc'
  const search = searchParams.get('search') || ''

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/repositories/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repositories')
    }

    const data = await response.json()
    // Ensure we're returning an array of repositories
    const repositories = Array.isArray(data) ? data : data.repositories || []
    return NextResponse.json(repositories)
  } catch (error) {
    console.error('Failed to fetch repositories:', error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}

export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as CustomSession | null

  if (!session?.user?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/repositories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create repository' },
      { status: 500 }
    )
  }
} 
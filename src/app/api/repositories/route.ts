import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { fetchApi } from '@/lib/api'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.accessToken) {
    return NextResponse.json(
      { message: 'Please sign in to continue' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    const data = await fetchApi('/repositories/', {
      method: 'POST',
      token: session.user.accessToken,
      body: JSON.stringify(body),
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Repository creation error:', error)
    
    if (error instanceof Error && error.message === 'Token expired') {
      return NextResponse.json(
        { message: 'Your session has expired. Please sign in again.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'An error occurred while creating the repository' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.accessToken) {
    return NextResponse.json(
      { message: 'Please sign in to continue' },
      { status: 401 }
    )
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    let endpoint = '/repositories/'
    const queryParams = new URLSearchParams()
    
    if (search) queryParams.append('search', search)
    if (status) queryParams.append('status', status)
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`
    }

    const data = await fetchApi(endpoint, {
      token: session.user.accessToken,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Repository fetch error:', error)
    
    if (error instanceof Error && error.message === 'Token expired') {
      return NextResponse.json(
        { message: 'Your session has expired. Please sign in again.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'An error occurred while fetching repositories' },
      { status: 500 }
    )
  }
} 
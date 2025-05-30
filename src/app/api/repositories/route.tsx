import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { fetchApi } from '@/lib/api'

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || '1'
  const sort = searchParams.get('sort') || 'lastUpdated'
  const order = searchParams.get('order') || 'desc'
  const search = searchParams.get('search') || ''

  try {
    const data = await fetchApi('/repositories/', {
      token: session.user.accessToken,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = await fetchApi('/repositories/', {
      token: session.user.accessToken,
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create repository' },
      { status: 500 }
    )
  }
} 
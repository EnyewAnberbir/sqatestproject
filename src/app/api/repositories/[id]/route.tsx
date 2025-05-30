import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { fetchApi } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await fetchApi(`/repositories/${params.id}/`, {
      token: session.user.accessToken,
      method: 'GET',
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Repository fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch repository' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = await fetchApi(`/repositories/${params.id}/`, {
      token: session.user.accessToken,
      method: 'PUT',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Repository update error:', error)
    return NextResponse.json(
      { message: 'Failed to update repository' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/repositories/${params.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to delete repository')
    }

    return NextResponse.json({ message: 'Repository deleted successfully' })
  } catch (error) {
    console.error('Repository delete error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to delete repository' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { fetchApi } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await fetchApi(`/repositories/${params.id}/`, {
      token: session.user.accessToken,
      method: 'GET',
    })

    return NextResponse.json(data)
  } catch (error) {
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
  const session = await getServerSession()

  if (!session?.user) {
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
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await fetchApi(`/repositories/${params.id}/`, {
      token: session.user.accessToken,
      method: 'DELETE',
    })

    return NextResponse.json({ message: 'Repository deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete repository' },
      { status: 500 }
    )
  }
} 
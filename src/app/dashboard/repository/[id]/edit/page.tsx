'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Repository {
  id: string
  name: string
  description: string
  github_url: string
  status: 'active' | 'inactive'
}

export default function EditRepositoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [repository, setRepository] = useState<Repository | null>(null)

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(`/api/repositories/${params.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to fetch repository')
        }
        const data = await response.json()
        setRepository(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch repository')
      }
    }

    if (params.id) {
      fetchRepository()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const githubUrl = formData.get('githubUrl') as string
    const status = formData.get('status') as 'active' | 'inactive'

    try {
      const response = await fetch(`/api/repositories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          github_url: githubUrl,
          status,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update repository')
      }

      // Navigate to dashboard and refresh the page
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!repository) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300">
          {error || 'Loading...'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="mr-4 text-gray-300 hover:text-white"
            >
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit Repository</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Repository Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  defaultValue={repository.name}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  defaultValue={repository.description}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  id="githubUrl"
                  required
                  defaultValue={repository.github_url}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  defaultValue={repository.status}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 
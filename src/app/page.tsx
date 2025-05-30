import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <main className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Automated Code Review with AI
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Enhance your development workflow with AI-powered code reviews. Get instant feedback, catch bugs early, and maintain consistent code quality across your projects.
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="border border-gray-400 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </main>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Automated Analysis"
            description="Get instant feedback on your code with our AI-powered analysis engine."
          />
          <FeatureCard
            title="Repository Integration"
            description="Seamlessly connect with your GitHub repositories and manage pull requests."
          />
          <FeatureCard
            title="Team Collaboration"
            description="Work together efficiently with built-in collaboration features."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

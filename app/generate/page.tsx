'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Generation failed')
      }

      const { pageId } = await res.json()
      router.push(`/preview/${pageId}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const examples = [
    'A landing page for our "Brand in a Day" intensive service',
    'A services overview page with pricing',
    'A homepage that explains what BrandOS does for small businesses',
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <Link href="/brand-box" className="text-slate-400 hover:text-slate-600 text-sm">← Back</Link>
        <h1 className="text-xl font-bold text-slate-900">Generate a page</h1>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-slate-500 mb-8">
          Tell BrandOS what you need. Be as specific or as vague as you like — it knows your brand.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="e.g. A landing page for our brand strategy workshop — make it feel energetic but professional."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating…' : 'Generate page →'}
          </button>
        </form>

        {/* Example prompts */}
        <div className="mt-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Try one of these</p>
          <div className="space-y-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="w-full text-left text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

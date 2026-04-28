import { useState } from 'react'
import { aiAPI } from '../services'
import type { AssetDto } from '../types'
import Spinner from './Spinner'

interface AIQueryProps {
  onResults?: (query: string, assets: AssetDto[]) => void
}

export default function AIQuery({ onResults }: AIQueryProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const { result: aiResult, assets } = await aiAPI.queryAssets(query)
      setResult(aiResult)
      onResults?.(query, assets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process query')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5 shadow-sm sm:p-6">
      <div className="max-w-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">🤖 AI Asset Query</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Ask questions about your assets in natural language.</p>
      </div>

      <form onSubmit={handleQuery} className="mt-6 grid gap-3">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me all expensive equipment in Office A..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Spinner />}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-4 py-4 text-sm font-medium leading-6 text-sky-800">
          ✓ {result}
        </div>
      )}

      <details className="mt-5 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
        <summary className="cursor-pointer select-none text-sm font-semibold text-sky-700">
          Example queries
        </summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Show all computers worth over $1000</li>
          <li>List assets in maintenance status</li>
          <li>Find equipment in the warehouse</li>
          <li>Show recently added assets</li>
        </ul>
      </details>
    </div>
  )
}

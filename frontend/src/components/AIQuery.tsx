import { useState } from 'react'
import { aiAPI } from '../services'
import type { AssetDto } from '../types'

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
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(31, 94, 255, 0.08), rgba(255, 255, 255, 0.92))',
        border: '1px solid rgba(31, 94, 255, 0.12)',
        borderRadius: 18,
        padding: 24,
      }}
    >
      <h3 style={{ margin: '0 0 12px', color: '#1f5eff' }}>🤖 AI Asset Query</h3>
      <p style={{ margin: '0 0 20px', color: '#607089', fontSize: 14 }}>
        Ask questions about your assets in natural language.
      </p>

      <form onSubmit={handleQuery} style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me all expensive equipment in Office A..."
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(31, 94, 255, 0.16)',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#1f5eff',
              color: '#fff',
              fontWeight: 600,
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !query.trim() ? 0.6 : 1,
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: '#ffddd5',
            color: '#b42318',
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: '#e8f4ff',
            color: '#1746c5',
            fontSize: 14,
          }}
        >
          {result}
        </div>
      )}

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', color: '#1f5eff', fontWeight: 600 }}>
          Example queries
        </summary>
        <ul style={{ margin: '12px 0 0', paddingLeft: 20, color: '#607089', fontSize: 13 }}>
          <li>Show all computers worth over $1000</li>
          <li>List assets in maintenance status</li>
          <li>Find equipment in the warehouse</li>
          <li>Show recently added assets</li>
        </ul>
      </details>
    </div>
  )
}

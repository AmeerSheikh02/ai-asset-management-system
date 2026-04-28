import { useEffect, useState } from 'react'
import { aiAPI } from '../services'
import type { AssetSummary } from '../types'

export default function DashboardPage() {
  const [summary, setSummary] = useState<AssetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadSummary = async () => {
      try {
        const data = await aiAPI.getSummary()
        if (mounted) {
          setSummary(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard summary')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadSummary()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section>
      <div className="hero">
        <div className="badge">Dashboard</div>
        <h2>Asset Summary</h2>
        <p className="page-copy">A quick snapshot of the current asset state.</p>
      </div>

      {error && (
        <div style={{ padding: 16, background: '#ffddd5', color: '#b42318', borderRadius: 12, marginTop: 18 }}>
          {error}
        </div>
      )}

      <div className="grid" style={{ marginTop: 24 }}>
        <div className="card">
          <p style={{ margin: 0, color: '#607089', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Total Assets
          </p>
          <div className="card__stat">{loading ? 'Loading...' : summary?.totalAssets ?? '—'}</div>
        </div>

        <div className="card">
          <p style={{ margin: 0, color: '#607089', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Damaged Assets
          </p>
          <div className="card__stat">{loading ? 'Loading...' : summary?.damagedAssets ?? '—'}</div>
        </div>

        <div className="card">
          <p style={{ margin: 0, color: '#607089', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Inactive Assets
          </p>
          <div className="card__stat">{loading ? 'Loading...' : summary?.inactiveAssets ?? '—'}</div>
        </div>
      </div>
    </section>
  )
}

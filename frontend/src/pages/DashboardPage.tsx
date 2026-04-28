import { useEffect, useState } from 'react'
import { assetsAPI } from '../services'
import { calculateAssetStats, formatCurrency } from '../utils/helpers'
import AssetTable from '../components/AssetTable'
import type { AssetDto } from '../types'

export default function DashboardPage() {
  const [assets, setAssets] = useState<AssetDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadAssets = async () => {
      try {
        const data = await assetsAPI.getAll()
        if (mounted) {
          setAssets(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load assets')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadAssets()

    return () => {
      mounted = false
    }
  }, [])

  const stats = calculateAssetStats(assets)
  const recentAssets = assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  return (
    <section>
      <div className="hero">
        <div className="badge">Dashboard</div>
        <h2>Asset Management Overview</h2>
        <p className="page-copy">Track and manage your organizational assets at a glance.</p>
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
          <div className="card__stat">{stats.totalAssets}</div>
          <p style={{ margin: '8px 0 0', color: '#8c92a4', fontSize: 12 }}>
            {stats.activeAssets} active
          </p>
        </div>

        <div className="card">
          <p style={{ margin: 0, color: '#607089', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Total Value
          </p>
          <div className="card__stat" style={{ fontSize: '1.4rem' }}>{formatCurrency(stats.totalValue)}</div>
          <p style={{ margin: '8px 0 0', color: '#8c92a4', fontSize: 12 }}>
            Combined asset value
          </p>
        </div>

        <div className="card">
          <p style={{ margin: 0, color: '#607089', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Under Maintenance
          </p>
          <div className="card__stat">{stats.maintenanceAssets}</div>
          <p style={{ margin: '8px 0 0', color: '#8c92a4', fontSize: 12 }}>
            {stats.activeAssets} available
          </p>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ margin: '0 0 18px' }}>Recently Added Assets</h3>
        {loading ? (
          <p className="page-copy">Loading...</p>
        ) : recentAssets.length > 0 ? (
          <AssetTable assets={recentAssets} />
        ) : (
          <p className="page-copy">No assets yet. Get started by adding your first asset.</p>
        )}
      </div>
    </section>
  )
}

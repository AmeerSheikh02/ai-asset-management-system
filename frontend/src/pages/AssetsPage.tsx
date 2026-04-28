import { useEffect, useState } from 'react'
import { assetsAPI } from '../services'
import { useAssetSearch } from '../hooks'
import AssetTable from '../components/AssetTable'
import AssetFormV2 from '../components/AssetFormV2'
import type { AssetDto, CreateAssetDto } from '../types'
import { ASSET_STATUSES } from '../utils/constants'

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<AssetDto | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter, filtered } = useAssetSearch(assets)

  // Load assets on mount
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

  const openCreateForm = () => {
    setEditingAsset(null)
    setShowForm(true)
  }

  const openEditForm = (asset: AssetDto) => {
    setEditingAsset(asset)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingAsset(null)
  }

  const handleFormSuccess = (asset: AssetDto) => {
    // If editing, replace; otherwise prepend
    setAssets((prev) => (editingAsset ? prev.map((a) => (a.id === asset.id ? asset : a)) : [asset, ...prev]))
    closeForm()
    setFormLoading(false)
    setError(null)
  }

  const handleDelete = async (id: number) => {
    try {
      await assetsAPI.delete(id)
      setAssets((prev) => prev.filter((a) => a.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset')
    }
  }

  return (
    <section>
      <div className="hero">
        <div className="badge">Assets</div>
        <h2>Asset Inventory</h2>
        <p className="page-copy">Manage your complete asset inventory with search and filtering.</p>
        {!showForm && (
          <button
            onClick={openCreateForm}
            style={{
              marginTop: 12,
              padding: '12px 18px',
              borderRadius: 8,
              border: 'none',
              background: '#1f5eff',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Asset
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: 16,
            background: '#ffddd5',
            color: '#b42318',
            borderRadius: 12,
            marginTop: 18,
          }}
        >
          {error}
        </div>
      )}

      {showForm && (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: '#f9fbff',
            border: '1px solid rgba(31, 94, 255, 0.1)',
            borderRadius: 18,
          }}
        >
          <h3>{editingAsset ? 'Edit Asset' : 'Create New Asset'}</h3>
          <AssetFormV2
            initialData={editingAsset ?? undefined}
            onSuccess={handleFormSuccess}
            onCancel={closeForm}
          />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 18 }}>
          <input
            type="text"
            placeholder="Search by name, type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(31, 94, 255, 0.16)',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          />
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(31, 94, 255, 0.16)',
              fontSize: 14,
              minWidth: 150,
            }}
          >
            <option value="">All Statuses</option>
            {ASSET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="page-copy">Loading assets...</p>
        ) : (
          <AssetTable
            assets={filtered}
            onDelete={handleDelete}
            onEdit={openEditForm}
            loading={loading}
          />
        )}
      </div>
    </section>
  )
}


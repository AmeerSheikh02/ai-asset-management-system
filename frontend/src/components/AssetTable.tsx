import { useEffect, useMemo, useState } from 'react'
import type { AssetDto } from '../types'
import { formatCurrency, formatDate } from '../utils/helpers'
import { STATUS_COLORS } from '../utils/constants'
import { assetsAPI, createAsset } from '../services'
import { useToast } from './ToastProvider'

interface AssetTableProps {
  assets?: AssetDto[]
  onDelete?: (id: number) => void
  onEdit?: (asset: AssetDto) => void
  onView?: (asset: AssetDto) => void
  loading?: boolean
}

export default function AssetTable({ assets: assetsProp, onDelete: onDeleteProp, onEdit, onView, loading: loadingProp = false }: AssetTableProps) {
  const [localAssets, setLocalAssets] = useState<AssetDto[]>([])
  const [loading, setLoading] = useState<boolean>(!!assetsProp ? loadingProp : true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')

  const usingProp = Array.isArray(assetsProp)

  useEffect(() => {
    if (usingProp) {
      setLoading(loadingProp)
      return
    }

    let mounted = true

    const load = async () => {
      try {
        const data = await assetsAPI.getAll()
        if (mounted) setLocalAssets(data)
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load assets')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void load()
    return () => { mounted = false }
  }, [usingProp, loadingProp])

  const assets = usingProp ? (assetsProp as AssetDto[]) : localAssets

  const locations = useMemo(() => {
    const set = new Set<string>()
    assets.forEach((a) => { if (a.location) set.add(a.location) })
    return Array.from(set).sort()
  }, [assets])

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchesName = a.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || a.status === statusFilter
      const matchesLocation = !locationFilter || (a.location ?? '') === locationFilter
      return matchesName && matchesStatus && matchesLocation
    })
  }, [assets, search, statusFilter, locationFilter])

  const toast = useToast()

  const handleDelete = async (assetOrId: AssetDto | number) => {
    const isObj = typeof assetOrId !== 'number'
    const asset = isObj ? (assetOrId as AssetDto) : assets.find((a) => a.id === assetOrId)
    if (!asset) return
    if (!confirm('Delete this asset?')) return
    try {
      // prefer parent handler if provided
      if (onDeleteProp) {
        await onDeleteProp(asset.id)
        toast.showToast({ message: 'Asset deleted' })
        return
      }

      await assetsAPI.delete(asset.id)
      if (!usingProp) setLocalAssets((prev) => prev.filter((a) => a.id !== asset.id))
      // show undo toast which recreates asset
      toast.showToast({ message: 'Asset deleted', actionLabel: 'Undo', onAction: async () => {
        try {
          const recreated = await createAsset({
            name: asset.name,
            description: asset.description,
            assetType: asset.assetType,
            purchasePrice: asset.purchasePrice,
            purchaseDate: asset.purchaseDate,
            location: asset.location ?? undefined,
          })
          if (!usingProp) setLocalAssets((prev) => [recreated, ...prev])
        } catch (e) {
          toast.showToast({ message: 'Undo failed' })
        }
      } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset')
      toast.showToast({ message: 'Delete failed' })
    }
  }

  if (loading) return <p className="page-copy" style={{ marginTop: 18 }}>Loading assets...</p>
  if (error) return <div style={{ padding: 12, background: '#ffddd5', color: '#b42318', borderRadius: 8 }}>{error}</div>
  if (assets.length === 0) return <p className="page-copy" style={{ marginTop: 18 }}>No assets found.</p>

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(31,94,255,0.16)', flex: 1 }}
        />

        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(31,94,255,0.16)' }}>
          <option value="">All locations</option>
          {locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(31,94,255,0.16)' }}>
          <option value="">All statuses</option>
          {Array.from(new Set(assets.map((a) => a.status))).map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Price</th>
            <th>Location</th>
            <th>Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((asset) => (
            <tr key={asset.id}>
              <td>
                <strong>{asset.name}</strong>
                {asset.description && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8c92a4' }}>
                    {asset.description.substring(0, 50)}{asset.description.length > 50 ? '...' : ''}
                  </p>
                )}
              </td>
              <td>{asset.assetType}</td>
              <td>
                <span className="badge" style={{ backgroundColor: `${STATUS_COLORS[asset.status]}20`, color: STATUS_COLORS[asset.status] || '#1f5eff' }}>
                  {asset.status}
                </span>
              </td>
              <td>{formatCurrency(asset.purchasePrice)}</td>
              <td>{asset.location || '—'}</td>
              <td>{formatDate(asset.createdAt)}</td>
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(asset)}
                      style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #1f5eff', color: '#1f5eff', background: 'transparent', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDelete(asset)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #b42318', color: '#b42318', background: 'transparent', cursor: 'pointer' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

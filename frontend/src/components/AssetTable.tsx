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

  if (loading) return <p className="text-sm text-slate-500">Loading assets...</p>
  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
  if (assets.length === 0) return <p className="text-sm text-slate-500">No assets found.</p>

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        >
          <option value="">All statuses</option>
          {Array.from(new Set(assets.map((a) => a.status))).map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['Name', 'Type', 'Status', 'Price', 'Location', 'Added', 'Actions'].map((header) => (
                  <th key={header} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((asset) => (
                <tr key={asset.id} className="align-top transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-950">{asset.name}</div>
                      {asset.description && (
                        <p className="max-w-md text-sm text-slate-500">
                          {asset.description.substring(0, 50)}{asset.description.length > 50 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{asset.assetType}</td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: `${STATUS_COLORS[asset.status]}20`, color: STATUS_COLORS[asset.status] || '#1f5eff' }}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{formatCurrency(asset.purchasePrice)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{asset.location || '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{formatDate(asset.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(asset)}
                          className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(asset)}
                        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

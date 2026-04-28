import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assetsAPI } from '../services'
import AssetTable from '../components/AssetTable'
import type { AssetDto } from '../types'

export default function AssetsPage() {
  const navigate = useNavigate()
  const [assets, setAssets] = useState<AssetDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <section className="space-y-6">
      <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Assets
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Asset Inventory</h2>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">Manage your complete asset inventory with search and filtering.</p>
          </div>

          <button
            onClick={() => navigate('/assets/new')}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            + Add Asset
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading assets...</p>
        ) : (
          <AssetTable assets={assets} onDelete={handleDelete} onEdit={(asset) => navigate(`/assets/edit/${asset.id}`)} loading={loading} />
        )}
      </div>
    </section>
  )
}


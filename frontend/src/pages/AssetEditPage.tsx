import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AssetFormV2 from '../components/AssetFormV2'
import { assetsAPI } from '../services'
import type { AssetDto } from '../types'

export default function AssetEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [asset, setAsset] = useState<AssetDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadAsset = async () => {
      if (!id) {
        if (mounted) {
          setError('Missing asset id')
          setLoading(false)
        }
        return
      }

      try {
        const data = await assetsAPI.getById(Number(id))
        if (mounted) {
          setAsset(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load asset')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadAsset()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Assets
        </div>
        <div className="mt-5 max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Edit Asset</h2>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">Update the selected asset and save the changes.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading asset...</p>
        ) : asset ? (
          <AssetFormV2 initialData={asset} onSuccess={() => navigate('/assets')} onCancel={() => navigate('/assets')} />
        ) : null}
      </div>
    </section>
  )
}
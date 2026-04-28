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
    <section className="space-y-6">
      <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Dashboard
        </div>
        <div className="mt-5 max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Asset Summary</h2>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">A quick snapshot of the current asset state.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total Assets', value: summary?.totalAssets },
          { label: 'Damaged Assets', value: summary?.damagedAssets },
          { label: 'Inactive Assets', value: summary?.inactiveAssets },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              {loading ? (
                <span className="inline-block h-10 w-20 animate-pulse rounded-2xl bg-slate-100" />
              ) : (
                item.value ?? '—'
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

import { useNavigate } from 'react-router-dom'
import AssetFormV2 from '../components/AssetFormV2'

export default function AssetCreatePage() {
  const navigate = useNavigate()

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Assets
        </div>
        <div className="mt-5 max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Add Asset</h2>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">Create a new asset record and add it to the inventory.</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <AssetFormV2 onSuccess={() => navigate('/assets')} onCancel={() => navigate('/assets')} />
      </div>
    </section>
  )
}
import { useState } from 'react'
import AIQuery from '../components/AIQuery'
import AssetTable from '../components/AssetTable'
import type { AssetDto } from '../types'

export default function AIPage() {
  const [queryResults, setQueryResults] = useState<AssetDto[]>([])
  const [lastQuery, setLastQuery] = useState<string>('')

  const handleQueryResults = (query: string, assets: AssetDto[]) => {
    setLastQuery(query)
    setQueryResults(assets)
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          AI-Powered
        </div>
        <div className="mt-5 max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Intelligent Asset Search</h2>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Use natural language to query your asset database. Describe what you're looking for and let AI find it.
          </p>
        </div>
      </div>

      <div>
        <AIQuery onResults={handleQueryResults} />
      </div>

      {queryResults.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-r from-sky-50 to-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold tracking-tight text-sky-700">📊 Query Results</h3>
            <p className="mt-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Query:</span> <em>"{lastQuery}"</em>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              <span className="text-lg font-semibold text-sky-700">{queryResults.length}</span> asset{queryResults.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <AssetTable assets={queryResults} />
        </div>
      )}

      {queryResults.length === 0 && lastQuery && (
        <div className="rounded-[28px] border-2 border-dashed border-slate-200 bg-white/85 p-8 text-center shadow-sm">
          <div className="text-4xl">🔍</div>
          <h4 className="mt-3 text-lg font-semibold tracking-tight text-slate-900">No results found</h4>
          <p className="mt-2 text-sm text-slate-600">Your query "{lastQuery}" didn't match any assets.</p>
          <p className="mt-2 text-sm text-slate-500">Try different keywords, specific locations, or asset types.</p>
        </div>
      )}

      {!lastQuery && (
        <div className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold tracking-tight text-emerald-700">💡 Query Tips</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Use specific terms like <strong>"computer"</strong>, <strong>"furniture"</strong>, or <strong>"equipment"</strong></li>
            <li>Mention <strong>locations</strong> to filter by area: "assets in Office A"</li>
            <li>Include <strong>price ranges</strong>: "equipment over $500"</li>
            <li>Reference <strong>statuses</strong>: "active", "maintenance", "retired"</li>
            <li>Ask for <strong>date-based</strong> queries: "recently added" or "oldest assets"</li>
          </ul>
        </div>
      )}
    </section>
  )
}

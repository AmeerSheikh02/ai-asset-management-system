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
    <section>
      <div className="hero">
        <div className="badge">AI-Powered</div>
        <h2>Intelligent Asset Search</h2>
        <p className="page-copy">
          Use natural language to query your asset database. Describe what you're looking for and let AI find it.
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        <AIQuery onResults={handleQueryResults} />
      </div>

      {queryResults.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ margin: '0 0 18px' }}>
            Results for: <em>"{lastQuery}"</em>
          </h3>
          <p style={{ margin: '0 0 16px', color: '#607089', fontSize: 14 }}>
            Found {queryResults.length} matching asset{queryResults.length !== 1 ? 's' : ''}
          </p>
          <AssetTable assets={queryResults} />
        </div>
      )}

      {queryResults.length === 0 && lastQuery && (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: '#f0f4ff',
            border: '1px solid rgba(31, 94, 255, 0.16)',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#607089', margin: 0 }}>No results found for your query. Try a different search.</p>
        </div>
      )}

      <div
        style={{
          marginTop: 32,
          padding: 24,
          background: 'linear-gradient(135deg, rgba(0, 186, 124, 0.08), rgba(255, 255, 255, 0.92))',
          border: '1px solid rgba(0, 186, 124, 0.12)',
          borderRadius: 18,
        }}
      >
        <h3 style={{ margin: '0 0 12px', color: '#00ba7c' }}>💡 Tips</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#607089', fontSize: 14, lineHeight: 1.8 }}>
          <li>Use specific terms like "computer", "furniture", or "equipment"</li>
          <li>Mention locations to filter by area</li>
          <li>Include price ranges for financial queries</li>
          <li>Reference statuses like "active", "maintenance", or "retired"</li>
          <li>Ask for recent additions or oldest assets</li>
        </ul>
      </div>
    </section>
  )
}

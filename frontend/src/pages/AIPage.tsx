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
          <div
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, rgba(31, 94, 255, 0.06), rgba(255, 255, 255, 0.96))',
              border: '1px solid rgba(31, 94, 255, 0.1)',
              borderRadius: 16,
              marginBottom: 24,
            }}
          >
            <h3 style={{ margin: '0 0 12px', color: '#1f5eff' }}>📊 Query Results</h3>
            <p style={{ margin: '0 0 8px', color: '#607089', fontSize: 14 }}>
              <strong>Query:</strong> <em>"{lastQuery}"</em>
            </p>
            <p style={{ margin: 0, color: '#607089', fontSize: 14 }}>
              <strong style={{ color: '#1f5eff', fontSize: 16 }}>{queryResults.length}</strong> asset{queryResults.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <AssetTable assets={queryResults} />
        </div>
      )}

      {queryResults.length === 0 && lastQuery && (
        <div
          style={{
            marginTop: 24,
            padding: 32,
            background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.05), rgba(255, 255, 255, 0.96))',
            border: '2px dashed rgba(100, 116, 139, 0.2)',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <h4 style={{ margin: '0 0 8px', color: '#475569', fontSize: 16 }}>No results found</h4>
          <p style={{ color: '#607089', margin: '0 0 12px', fontSize: 13 }}>
            Your query "{lastQuery}" didn't match any assets.
          </p>
          <p style={{ color: '#8c92a4', margin: 0, fontSize: 12 }}>
            Try using different keywords, specific locations, or asset types.
          </p>
        </div>
      )}

      {!lastQuery && (
        <div
          style={{
            marginTop: 32,
            padding: 24,
            background: 'linear-gradient(135deg, rgba(0, 186, 124, 0.08), rgba(255, 255, 255, 0.92))',
            border: '1px solid rgba(0, 186, 124, 0.12)',
            borderRadius: 18,
          }}
        >
          <h3 style={{ margin: '0 0 12px', color: '#00ba7c' }}>💡 Query Tips</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#607089', fontSize: 14, lineHeight: 1.8 }}>
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

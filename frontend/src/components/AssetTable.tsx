import { useState } from 'react'
import type { AssetDto } from '../types'
import { formatCurrency, formatDate } from '../utils/helpers'
import { STATUS_COLORS } from '../utils/constants'

interface AssetTableProps {
  assets: AssetDto[]
  onDelete?: (id: number) => void
  onEdit?: (asset: AssetDto) => void
  onView?: (asset: AssetDto) => void
  loading?: boolean
}

export default function AssetTable({
  assets,
  onDelete,
  onEdit,
  onView,
  loading = false,
}: AssetTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'price'>('date')

  const sorted = [...assets].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return b.purchasePrice - a.purchasePrice
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  if (loading) {
    return <p className="page-copy" style={{ marginTop: 18 }}>Loading assets...</p>
  }

  if (assets.length === 0) {
    return <p className="page-copy" style={{ marginTop: 18 }}>No assets found.</p>
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <label htmlFor="sort" style={{ fontSize: 14, color: '#607089' }}>
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'price')}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(31, 94, 255, 0.16)',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          <option value="date">Date Added (Newest)</option>
          <option value="name">Name (A-Z)</option>
          <option value="price">Price (Highest)</option>
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
          {sorted.map((asset) => (
            <tr key={asset.id}>
              <td>
                <strong>{asset.name}</strong>
                {asset.description && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#8c92a4' }}>
                    {asset.description.substring(0, 50)}
                    {asset.description.length > 50 ? '...' : ''}
                  </p>
                )}
              </td>
              <td>{asset.assetType}</td>
              <td>
                <span
                  className="badge"
                  style={{ backgroundColor: `${STATUS_COLORS[asset.status]}20`, color: STATUS_COLORS[asset.status] || '#1f5eff' }}
                >
                  {asset.status}
                </span>
              </td>
              <td>{formatCurrency(asset.purchasePrice)}</td>
              <td>{asset.location || '—'}</td>
              <td>{formatDate(asset.createdAt)}</td>
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  {onView && (
                    <button
                      onClick={() => onView(asset)}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: '1px solid #1f5eff',
                        color: '#1f5eff',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(asset)}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: '1px solid #ffa800',
                        color: '#ffa800',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Delete this asset?')) onDelete(asset.id)
                      }}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: '1px solid #b42318',
                        color: '#b42318',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

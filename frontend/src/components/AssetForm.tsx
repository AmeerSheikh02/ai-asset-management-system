import { useEffect } from 'react'
import { useAssetForm } from '../hooks'
import { ASSET_TYPES, ASSET_STATUSES } from '../utils/constants'
import type { AssetDto, CreateAssetDto } from '../types'

interface AssetFormProps {
  onSubmit: (data: CreateAssetDto) => Promise<void>
  initialData?: AssetDto
  isLoading?: boolean
  onCancel?: () => void
}

export default function AssetForm({ onSubmit, initialData, isLoading = false, onCancel }: AssetFormProps) {
  const { formData, setFormData, errors, handleChange, validate, reset } = useAssetForm()

  useEffect(() => {
    if (!initialData) return

    setFormData({
      name: initialData.name,
      description: initialData.description,
      assetType: initialData.assetType,
      purchasePrice: initialData.purchasePrice.toString(),
      purchaseDate: initialData.purchaseDate,
      location: initialData.location ?? '',
    })
  }, [initialData, setFormData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        assetType: formData.assetType,
        purchasePrice: Number(formData.purchasePrice),
        purchaseDate: formData.purchaseDate,
        location: formData.location,
      })
      reset()
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18, maxWidth: 600 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
          Asset Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Dell XPS 13"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: `1px solid ${errors.name ? '#b42318' : 'rgba(31, 94, 255, 0.16)'}`,
            fontSize: 14,
            fontFamily: 'inherit',
          }}
        />
        {errors.name && <span style={{ color: '#b42318', fontSize: 12, marginTop: 4 }}>{errors.name}</span>}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about this asset..."
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid rgba(31, 94, 255, 0.16)',
            fontSize: 14,
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
            Asset Type *
          </label>
          <select
            name="assetType"
            value={formData.assetType}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${errors.assetType ? '#b42318' : 'rgba(31, 94, 255, 0.16)'}`,
              fontSize: 14,
            }}
          >
            <option value="">Select type</option>
            {ASSET_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.assetType && <span style={{ color: '#b42318', fontSize: 12, marginTop: 4 }}>{errors.assetType}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
            Purchase Price *
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${errors.purchasePrice ? '#b42318' : 'rgba(31, 94, 255, 0.16)'}`,
              fontSize: 14,
            }}
          />
          {errors.purchasePrice && <span style={{ color: '#b42318', fontSize: 12, marginTop: 4 }}>{errors.purchasePrice}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
            Purchase Date
          </label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(31, 94, 255, 0.16)',
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Office A"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(31, 94, 255, 0.16)',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 20px',
              borderRadius: 8,
              border: '1px solid rgba(31, 94, 255, 0.16)',
              background: 'transparent',
              color: '#1f5eff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            background: '#1f5eff',
            color: '#fff',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Saving...' : 'Save Asset'}
        </button>
      </div>
    </form>
  )
}

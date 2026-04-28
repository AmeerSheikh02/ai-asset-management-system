import { useState, useCallback } from 'react'
import type { AssetDto } from '../types'

export const useAssetSearch = (assets: AssetDto[]) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  const filtered = useCallback(() => {
    return assets.filter((asset) => {
      const matchesQuery =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetType.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = !statusFilter || asset.status === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [assets, searchQuery, statusFilter])

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filtered: filtered(),
  }
}

export const useAssetForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assetType: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    location: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.assetType) newErrors.assetType = 'Asset type is required'
    if (!formData.purchasePrice) newErrors.purchasePrice = 'Purchase price is required'
    if (Number(formData.purchasePrice) < 0) newErrors.purchasePrice = 'Price must be positive'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const reset = () => {
    setFormData({
      name: '',
      description: '',
      assetType: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      location: '',
    })
    setErrors({})
  }

  return { formData, setFormData, errors, handleChange, validate, reset }
}

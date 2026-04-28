import type { AssetDto, AssetStats } from '../types'

export const calculateAssetStats = (assets: AssetDto[]): AssetStats => {
  const totalAssets = assets.length
  const activeAssets = assets.filter((a) => a.status === 'Active').length
  const maintenanceAssets = assets.filter((a) => a.status === 'Maintenance').length
  const totalValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0)

  return {
    totalAssets,
    activeAssets,
    maintenanceAssets,
    totalValue,
  }
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString('en-US')
  } catch {
    return date
  }
}

export const sortAssets = (assets: AssetDto[], sortBy: 'name' | 'date' | 'price'): AssetDto[] => {
  const sorted = [...assets]
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'date':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'price':
      return sorted.sort((a, b) => b.purchasePrice - a.purchasePrice)
    default:
      return sorted
  }
}

export const filterAssets = (assets: AssetDto[], query: string, status?: string): AssetDto[] => {
  return assets.filter((asset) => {
    const matchesQuery =
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.description.toLowerCase().includes(query.toLowerCase()) ||
      asset.assetType.toLowerCase().includes(query.toLowerCase())

    const matchesStatus = !status || asset.status === status

    return matchesQuery && matchesStatus
  })
}

export type AssetDto = {
  id: number
  name: string
  description: string
  assetType: string
  purchasePrice: number
  purchaseDate: string
  status: string
  location?: string | null
  createdAt: string
  updatedAt?: string | null
}

export type CreateAssetDto = {
  name: string
  description: string
  assetType: string
  purchasePrice: number
  purchaseDate: string
  location?: string
}

export type UpdateAssetDto = Partial<CreateAssetDto> & {
  status?: string
}

export type AssetStats = {
  totalAssets: number
  activeAssets: number
  maintenanceAssets: number
  totalValue: number
}

export type AssetSummary = {
  totalAssets: number
  damagedAssets: number
  inactiveAssets: number
}

export type APIResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

import { api } from './api'

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

export async function getAssets() {
  const response = await api.get<AssetDto[]>('/assets')
  return response.data
}

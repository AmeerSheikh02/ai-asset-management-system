import type { AssetDto, CreateAssetDto, UpdateAssetDto } from '../types'
import { api } from './api'

// Asset endpoints
export const assetsAPI = {
  getAll: async (): Promise<AssetDto[]> => {
    const response = await api.get<AssetDto[]>('/assets')
    return response.data
  },

  getById: async (id: number): Promise<AssetDto> => {
    const response = await api.get<AssetDto>(`/assets/${id}`)
    return response.data
  },

  create: async (asset: CreateAssetDto): Promise<AssetDto> => {
    const response = await api.post<AssetDto>('/assets', asset)
    return response.data
  },

  update: async (id: number, asset: UpdateAssetDto): Promise<AssetDto> => {
    const response = await api.put<AssetDto>(`/assets/${id}`, asset)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/assets/${id}`)
  },

  search: async (query: string): Promise<AssetDto[]> => {
    const response = await api.get<AssetDto[]>('/assets')
    const assets = response.data
    return assets.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()),
    )
  },
}

// AI Query endpoints (placeholder for future AI integration)
export const aiAPI = {
  queryAssets: async (query: string): Promise<{ result: string; assets: AssetDto[] }> => {
    // Placeholder - will connect to AI backend when ready
    const assets = await assetsAPI.getAll()
    return {
      result: `Found ${assets.length} assets matching your query: "${query}"`,
      assets,
    }
  },

  generateReport: async (filters: Record<string, unknown>): Promise<string> => {
    // Placeholder for AI-powered report generation
    return 'Report generation feature coming soon'
  },
}

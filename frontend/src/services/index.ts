import { api } from './api'
import { getAllAssets } from './assetsService'
import type { AssetDto, AssetSummary } from '../types'

export {
  assetsAPI,
  createAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
} from './assetsService'

const getAssetSummary = async (): Promise<AssetSummary> => {
  const response = await api.get<AssetSummary>('/ai/summary')
  return response.data
}

// AI Query endpoints
export const aiAPI = {
  queryAssets: async (query: string): Promise<{ result: string; assets: AssetDto[] }> => {
    const response = await api.post<{ result: string; assets: AssetDto[] }>('/ai/query', { query })
    return response.data
  },

  getSummary: getAssetSummary,

  generateReport: async (filters: Record<string, unknown>): Promise<string> => {
    // Placeholder for AI-powered report generation
    return 'Report generation feature coming soon'
  },
}

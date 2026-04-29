import { api } from './api'
import { getAllAssets } from './assetsService'
import type { AIQueryResponse, AssetSummary } from '../types'

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
  queryAssets: async (query: string): Promise<AIQueryResponse> => {
    const response = await api.post<AIQueryResponse>('/ai/query', { query })
    return response.data
  },

  getSummary: getAssetSummary,

  generateReport: async (filters: Record<string, unknown>): Promise<string> => {
    // Placeholder for AI-powered report generation
    return 'Report generation feature coming soon'
  },
}

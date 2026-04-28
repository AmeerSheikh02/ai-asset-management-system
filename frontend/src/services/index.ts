import { getAllAssets } from './assetsService'
import type { AssetDto } from '../types'

export {
  assetsAPI,
  createAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
} from './assetsService'

// AI Query endpoints (placeholder for future AI integration)
export const aiAPI = {
  queryAssets: async (query: string): Promise<{ result: string; assets: AssetDto[] }> => {
    // Placeholder - will connect to AI backend when ready
    const assets = await getAllAssets()
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

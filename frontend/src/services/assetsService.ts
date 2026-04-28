import axios from 'axios'
import { api } from './api'
import type { AssetDto, CreateAssetDto, UpdateAssetDto } from '../types'

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      (error.response?.data as { message?: string; error?: string } | undefined)?.message ??
      (error.response?.data as { message?: string; error?: string } | undefined)?.error

    return responseMessage ?? error.message ?? 'Request failed'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

async function runRequest<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function getAllAssets(): Promise<AssetDto[]> {
  return runRequest(api.get<AssetDto[]>('/assets'))
}

export async function getAssetById(id: number): Promise<AssetDto> {
  return runRequest(api.get<AssetDto>(`/assets/${id}`))
}

export async function createAsset(data: CreateAssetDto): Promise<AssetDto> {
  return runRequest(api.post<AssetDto>('/assets', data))
}

export async function updateAsset(id: number, data: UpdateAssetDto): Promise<AssetDto> {
  return runRequest(api.put<AssetDto>(`/assets/${id}`, data))
}

export async function deleteAsset(id: number): Promise<void> {
  await runRequest(api.delete<void>(`/assets/${id}`))
}

export const assetsAPI = {
  getAll: getAllAssets,
  getById: getAssetById,
  create: createAsset,
  update: updateAsset,
  delete: deleteAsset,
}

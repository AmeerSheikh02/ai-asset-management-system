import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import { useToast } from './ToastProvider'
import type { AssetDto } from '../types'

type Props = {
  initialData?: AssetDto
  onSuccess?: (asset: AssetDto) => void
  onCancel?: () => void
}

export default function AssetFormV2({ initialData, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [category, setCategory] = useState(initialData?.assetType ?? '')
  const [location, setLocation] = useState(initialData?.location ?? '')
  const [condition, setCondition] = useState(initialData?.status ?? '')
  const [owner, setOwner] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? '')
      setCategory(initialData.assetType ?? '')
      setLocation(initialData.location ?? '')
      setCondition(initialData.status ?? '')
    }
  }, [initialData])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!category.trim()) errs.category = 'Category is required'
    if (!location.trim()) errs.location = 'Location is required'
    if (!condition.trim()) errs.condition = 'Condition is required'
    if (!owner.trim()) errs.owner = 'Owner is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        name,
        assetType: category,
        location,
        status: condition,
        owner,
      }

      let res
      if (initialData?.id) {
        res = await api.put<AssetDto>(`/assets/${initialData.id}`, payload)
      } else {
        res = await api.post<AssetDto>('/assets', payload)
      }

      toast.showToast({ message: 'Saved' })
      onSuccess?.(res.data)
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Save failed'
      toast.showToast({ message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-3xl gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700">Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
        {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700">Category *</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
        {errors.category && <div className="text-sm text-red-600">{errors.category}</div>}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700">Location *</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
        {errors.location && <div className="text-sm text-red-600">{errors.location}</div>}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700">Condition *</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        >
          <option value="">Select condition</option>
          <option value="New">New</option>
          <option value="Good">Good</option>
          <option value="Damaged">Damaged</option>
          <option value="Retired">Retired</option>
        </select>
        {errors.condition && <div className="text-sm text-red-600">{errors.condition}</div>}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700">Owner *</label>
        <input
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
        {errors.owner && <div className="text-sm text-red-600">{errors.owner}</div>}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

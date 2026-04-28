import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Toast = {
  id: string
  message: string
  duration?: number
  actionLabel?: string
  onAction?: () => void
}

type ToastContextValue = {
  showToast: (t: Omit<Toast, 'id'>) => string
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    const toast: Toast = { id, ...t }
    setToasts((s) => [toast, ...s])
    const duration = t.duration ?? 5000
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id))
    }, duration)
    return id
  }, [])

  const remove = useCallback((id: string) => setToasts((s) => s.filter((t) => t.id !== id)), [])

  useEffect(() => {
    return () => setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', right: 20, top: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ minWidth: 240, background: '#111827', color: '#fff', padding: '10px 12px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 14 }}>{t.message}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {t.actionLabel && (
                  <button onClick={() => { t.onAction?.(); remove(t.id) }} style={{ background: 'transparent', color: '#60a5fa', border: 'none', cursor: 'pointer' }}>{t.actionLabel}</button>
                )}
                <button onClick={() => remove(t.id)} style={{ background: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider

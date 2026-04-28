import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen px-3 py-3 text-slate-900 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:min-h-[calc(100vh-2rem)]">
        <header className="border-b border-slate-200/70 bg-gradient-to-r from-sky-50 via-white to-emerald-50 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/10">
                AM
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">Asset Manager</h1>
                <p className="mt-1 text-sm text-slate-500">Full-stack React + .NET</p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  [
                    'rounded-full border px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950',
                  ].join(' ')
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/assets"
                className={({ isActive }) =>
                  [
                    'rounded-full border px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950',
                  ].join(' ')
                }
              >
                Assets
              </NavLink>
              <NavLink
                to="/ai"
                className={({ isActive }) =>
                  [
                    'rounded-full border px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950',
                  ].join(' ')
                }
              >
                AI Query
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="app-shell__frame">
        <header className="app-header">
          <div className="app-brand">
            <h1 className="app-brand__title">Asset Manager</h1>
            <span className="app-brand__subtitle">Full-stack React + .NET</span>
          </div>

          <nav className="nav-links" aria-label="Primary navigation">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/assets" className={({ isActive }) => isActive ? 'active' : ''}>
              Assets
            </NavLink>
            <NavLink to="/ai" className={({ isActive }) => isActive ? 'active' : ''}>
              AI Search
            </NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

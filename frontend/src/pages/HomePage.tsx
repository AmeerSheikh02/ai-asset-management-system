import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section className="hero">
      <div className="badge">Vite + React frontend</div>
      <h1>Asset management UI ready for API integration.</h1>
      <p className="page-copy">
        This frontend uses functional components, React Router, and an axios service layer wired to a configurable API base URL.
      </p>
      <div className="hero__actions">
        <Link className="button" to="/assets">
          View assets
        </Link>
        <a className="button button--secondary" href="https://localhost:5001/swagger" target="_blank" rel="noreferrer">
          Open Swagger
        </a>
      </div>

      <div className="grid">
        <article className="card">
          <h3>Routing</h3>
          <p>Functional route-based pages with a shared layout.</p>
        </article>
        <article className="card">
          <h3>API Client</h3>
          <p>Axios is configured from <code>VITE_API_BASE_URL</code>.</p>
        </article>
        <article className="card">
          <h3>Structure</h3>
          <p>Separated into components, pages, and services for maintainability.</p>
        </article>
      </div>
    </section>
  )
}

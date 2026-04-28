import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="badge">404</div>
      <h2>Page not found</h2>
      <p className="page-copy" style={{ marginTop: 12 }}>
        The page you requested does not exist.
      </p>
      <div style={{ marginTop: 20 }}>
        <Link className="button" to="/">
          Go home
        </Link>
      </div>
    </section>
  )
}

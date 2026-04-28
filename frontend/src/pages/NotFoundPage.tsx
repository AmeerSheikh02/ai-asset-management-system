import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
        404
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Page not found</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">The page you requested does not exist.</p>
      <div className="mt-8">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          to="/"
        >
          Go home
        </Link>
      </div>
    </section>
  )
}

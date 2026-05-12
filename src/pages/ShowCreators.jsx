import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CreatorCard from '../components/CreatorCard.jsx'
import { getCreators } from '../services/creatorsApi.js'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const rows = await getCreators()
        if (!cancelled) {
          setCreators(rows)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong loading creators.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page page--creators">
      <div className="home-layout">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <h1 id="home-hero-title" className="home-hero__title">
          Creators worth following
        </h1>
        <p className="home-hero__subtitle">
          A short list of people and channels I like—newsletters, YouTube, portfolios, that kind of
          thing. Add someone you actually recommend.
        </p>
        <div className="home-hero__actions">
          <Link to="/add" className="button button--primary">
            Add a creator
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="fetch-state fetch-state--loading" role="status">
          Loading creators…
        </div>
      ) : null}

      {!loading && error ? (
        <div className="fetch-state fetch-state--error" role="alert">
          <p className="fetch-state__title">Could not load creators</p>
          <p className="fetch-state__detail">{error}</p>
        </div>
      ) : null}

      {!loading && !error && creators.length === 0 ? (
        <div className="fetch-state fetch-state--empty empty-state">
          <p className="fetch-state__title">No creators yet</p>
          <p className="fetch-state__detail">
            The <code className="page__code">creators</code> table has no rows. If you still need
            the table, run <code className="page__code">supabase/schema.sql</code> in the Supabase
            SQL editor. You can optionally run <code className="page__code">supabase/seed.sql</code>{' '}
            for sample data.
          </p>
          <p className="fetch-state__detail empty-state__more">
            Put <code className="page__code">VITE_SUPABASE_URL</code> and{' '}
            <code className="page__code">VITE_SUPABASE_PUBLISHABLE_KEY</code> in{' '}
            <code className="page__code">.env</code>, restart <code className="page__code">npm run dev</code>, or use{' '}
            <strong>Add a creator</strong> above.
          </p>
          <p className="fetch-state__detail empty-state__more">
            Setup notes: <code className="page__code">README.md</code>
          </p>
        </div>
      ) : null}

      {!loading && !error && creators.length > 0 ? (
        <>
          <h2 className="home-section-label">On this list</h2>
          <ul className="creator-grid">
            {creators.map((creator) => (
              <li key={creator.id} className="creator-grid__item">
                <CreatorCard creator={creator} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
    </div>
  )
}

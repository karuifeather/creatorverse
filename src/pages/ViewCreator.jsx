import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCreatorById } from '../services/creatorsApi.js'

export default function ViewCreator() {
  const { id } = useParams()
  const [creator, setCreator] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      setCreator(null)

      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        const row = await getCreatorById(id)
        if (!cancelled) {
          setCreator(row)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong loading this creator.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  const notFound = !isLoading && !error && !creator

  return (
    <div className="page page--detail">
      {isLoading ? (
        <div className="fetch-state fetch-state--loading" role="status">
          Loading creator…
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="fetch-state fetch-state--error" role="alert">
          <p className="fetch-state__title">Could not load creator</p>
          <p className="fetch-state__detail">{error}</p>
          <div className="creator-detail__footer-actions">
            <Link to="/" className="button button--secondary">
              Back to all creators
            </Link>
          </div>
        </div>
      ) : null}

      {!isLoading && notFound ? (
        <div className="fetch-state fetch-state--not-found">
          <p className="fetch-state__title">Creator not found</p>
          <p className="fetch-state__detail">
            {id
              ? 'There is no creator with that id in the database. It may have been removed, or the link might be wrong.'
              : 'This link is missing a creator id.'}
          </p>
          <div className="creator-detail__footer-actions">
            <Link to="/" className="button button--secondary">
              Back to all creators
            </Link>
          </div>
        </div>
      ) : null}

      {!isLoading && !error && creator ? (
        <div className="creator-detail__page">
          <article className="creator-detail creator-detail--stacked">
            <div className="creator-detail__media-col">
              <div className="creator-detail__figure">
                {creator.imageURL ? (
                  <img
                    src={creator.imageURL}
                    alt={creator.name ? `${creator.name} cover` : 'Creator cover image'}
                    className="creator-detail__figure-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="creator-detail__figure-fallback" aria-hidden="true">
                    No photo
                  </div>
                )}
              </div>
            </div>

            <div className="creator-detail__content-col">
              <div className="creator-detail__content-main">
                <h1 className="creator-detail__name">{creator.name}</h1>

                {creator.description ? (
                  <section
                    className="creator-detail__why"
                    aria-labelledby={`creator-${creator.id}-why-label`}
                  >
                    <h2 className="creator-detail__section-title" id={`creator-${creator.id}-why-label`}>
                      Why follow
                    </h2>
                    <p className="creator-detail__why-body">{creator.description}</p>
                  </section>
                ) : null}

                {creator.url ? (
                  <div className="creator-detail__website-row">
                    <span
                      className="creator-detail__website-label"
                      id={`creator-${creator.id}-website-label`}
                    >
                      Website
                    </span>
                    <a
                      href={creator.url}
                      className="creator-detail__website-url"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-labelledby={`creator-${creator.id}-website-label`}
                    >
                      {creator.url}
                    </a>
                  </div>
                ) : null}
              </div>

              <div
                className="creator-detail__actions"
                role="group"
                aria-label="Creator actions"
              >
                {creator.url ? (
                  <a
                    href={creator.url}
                    className="button button--primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${creator.name || 'creator'} (opens in new tab)`}
                  >
                    Visit creator
                  </a>
                ) : null}
                <Link to={`/edit/${creator.id}`} className="button button--secondary">
                  Edit creator
                </Link>
                <Link to="/" className="button button--secondary">
                  Back to all creators
                </Link>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  )
}

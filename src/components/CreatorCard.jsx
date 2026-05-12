import { Link } from 'react-router-dom'

export default function CreatorCard({ creator }) {
  if (!creator) {
    return null
  }

  const { id, name, description, url, imageURL } = creator

  return (
    <article className="creator-card">
      <div className="creator-card__media">
        {imageURL ? (
          <img
            src={imageURL}
            alt={name ? `${name} portrait` : 'Creator image'}
            className="creator-card__image"
            loading="lazy"
          />
        ) : (
          <div className="creator-card__image-fallback" aria-hidden="true">
            No photo
          </div>
        )}
      </div>
      <div className="creator-card__body">
        <div className="creator-card__stack">
          <h3 className="creator-card__title">{name}</h3>
          {description ? (
            <p className="creator-card__description">{description}</p>
          ) : null}
          {url ? (
            <a
              href={url}
              className="creator-card__url"
              target="_blank"
              rel="noopener noreferrer"
              title={url}
              aria-label={`${name ? `${name} — ` : ''}website (opens in new tab)`}
            >
              {url}
            </a>
          ) : null}
        </div>
        <div className="creator-card__actions">
          <Link className="creator-card__action" to={`/creator/${id}`}>
            View details
          </Link>
          <Link className="creator-card__action" to={`/edit/${id}`}>
            Edit
          </Link>
        </div>
      </div>
    </article>
  )
}

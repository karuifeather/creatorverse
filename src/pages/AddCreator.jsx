import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createCreator } from '../services/creatorsApi.js'

const initialForm = {
  name: '',
  url: '',
  description: '',
  imageURL: '',
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value)
}

export default function AddCreator() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage(null)

    const name = form.name.trim()
    const url = form.url.trim()
    const description = form.description.trim()
    const imageURL = form.imageURL.trim()

    if (!name || !url || !description) {
      setErrorMessage('Please fill in name, URL, and description. All three are required.')
      return
    }

    if (!isHttpUrl(url)) {
      setErrorMessage('Website URL must start with http:// or https://.')
      return
    }

    if (imageURL && !isHttpUrl(imageURL)) {
      setErrorMessage('Image URL must start with http:// or https:// when provided.')
      return
    }

    setIsSubmitting(true)

    try {
      const created = await createCreator({
        name,
        url,
        description,
        imageURL,
      })

      if (created && created.id != null) {
        navigate(`/creator/${created.id}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not save the creator. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page page--add">
      <div className="form-layout">
      <header className="page-header">
        <h1 className="page__title page-header__title">Add a creator</h1>
        <p className="page__lead page__lead--left">
          Add a channel, site, or portfolio you recommend. Name, URL, and description are required
          so visitors know who they are opening.
        </p>
      </header>

      {errorMessage ? (
        <div className="form-error-banner" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <form className="creator-form" onSubmit={handleSubmit} noValidate>
        <div className="form-card">
          <div className="form-field">
            <label className="form-label" htmlFor="add-name">
              Name <span className="form-required">*</span>
            </label>
            <input
              id="add-name"
              name="name"
              type="text"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="add-url">
              Website URL <span className="form-required">*</span>
            </label>
            <input
              id="add-url"
              name="url"
              type="url"
              inputMode="url"
              className="form-input"
              placeholder="https://"
              value={form.url}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <p className="form-hint">Must start with http:// or https://</p>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="add-description">
              Description <span className="form-required">*</span>
            </label>
            <textarea
              id="add-description"
              name="description"
              className="form-textarea"
              rows={4}
              value={form.description}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="add-imageURL">
              Image URL <span className="form-optional">(optional)</span>
            </label>
            <input
              id="add-imageURL"
              name="imageURL"
              type="url"
              inputMode="url"
              className="form-input"
              placeholder="https://"
              value={form.imageURL}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <p className="form-hint">If provided, must start with http:// or https://</p>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Add creator'}
            </button>
          </div>
        </div>
      </form>

      <p className="page__footer-link">
        <Link to="/" className="button button--secondary">
          Back to all creators
        </Link>
      </p>
      </div>
    </div>
  )
}

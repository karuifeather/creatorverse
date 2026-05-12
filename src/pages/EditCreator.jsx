import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCreator, getCreatorById, updateCreator } from '../services/creatorsApi.js'

const initialForm = {
  name: '',
  url: '',
  description: '',
  imageURL: '',
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value)
}

export default function EditCreator() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      setValidationError(null)
      setSubmitError(null)
      setDeleteError(null)
      setNotFound(false)
      setFormData(initialForm)

      if (!id) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        const creator = await getCreatorById(id)
        if (cancelled) return

        if (!creator) {
          setNotFound(true)
          return
        }

        setFormData({
          name: creator.name ?? '',
          url: creator.url ?? '',
          description: creator.description ?? '',
          imageURL: creator.imageURL ?? '',
        })
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

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setValidationError(null)
    setSubmitError(null)
    setDeleteError(null)

    const name = formData.name.trim()
    const url = formData.url.trim()
    const description = formData.description.trim()
    const imageURL = formData.imageURL.trim()

    if (!name || !url || !description) {
      setValidationError('Please fill in name, URL, and description. All three are required.')
      return
    }

    if (!isHttpUrl(url)) {
      setValidationError('Website URL must start with http:// or https://.')
      return
    }

    if (imageURL && !isHttpUrl(imageURL)) {
      setValidationError('Image URL must start with http:// or https:// when provided.')
      return
    }

    if (!id) {
      setSubmitError('Missing creator id. Cannot save changes.')
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateCreator(id, {
        name,
        url,
        description,
        imageURL,
      })

      if (updated && updated.id != null) {
        navigate(`/creator/${updated.id}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not save changes. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteClick() {
    if (
      !window.confirm(
        'Are you sure you want to delete this creator? This cannot be undone.',
      )
    ) {
      return
    }

    if (!id) {
      setDeleteError('Missing creator id. Cannot delete.')
      return
    }

    setDeleteError(null)
    setIsDeleting(true)

    try {
      await deleteCreator(id)
      navigate('/')
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Could not delete this creator. Please try again.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const showForm = !isLoading && !error && !notFound
  const formBusy = isSubmitting || isDeleting

  return (
    <div className="page page--edit">
      <div className="form-layout">
      <header className="page-header">
        <h1 className="page__title page-header__title">Edit creator</h1>
        <p className="page__lead page__lead--left">
          Update the fields and save. Delete only if you mean it—you can’t bring the row back from
          this app.
        </p>
      </header>

      {isLoading ? (
        <div className="fetch-state fetch-state--loading" role="status">
          Loading creator…
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="fetch-state fetch-state--error" role="alert">
          <p className="fetch-state__title">Could not load creator</p>
          <p className="fetch-state__detail">{error}</p>
          <div className="form-page-links">
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
              ? 'There is no creator with that id. It may have been deleted, or the link might be wrong.'
              : 'This link is missing a creator id.'}
          </p>
          <div className="form-page-links">
            {id ? (
              <Link to={`/creator/${id}`} className="button button--secondary">
                Back to creator details
              </Link>
            ) : null}
            <Link to="/" className="button button--secondary">
              Back to all creators
            </Link>
          </div>
        </div>
      ) : null}

      {showForm ? (
        <>
          {validationError ? (
            <div className="form-error-banner" role="alert">
              {validationError}
            </div>
          ) : null}
          {submitError ? (
            <div className="form-error-banner" role="alert">
              {submitError}
            </div>
          ) : null}

          <form className="creator-form" onSubmit={handleSubmit} noValidate>
            <div className="form-card">
              <div className="form-field">
                <label className="form-label" htmlFor="edit-name">
                  Name <span className="form-required">*</span>
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={formBusy}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="edit-url">
                  Website URL <span className="form-required">*</span>
                </label>
                <input
                  id="edit-url"
                  name="url"
                  type="url"
                  inputMode="url"
                  className="form-input"
                  placeholder="https://"
                  value={formData.url}
                  onChange={handleChange}
                  disabled={formBusy}
                  required
                />
                <p className="form-hint">Must start with http:// or https://</p>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="edit-description">
                  Description <span className="form-required">*</span>
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  className="form-textarea"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={formBusy}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="edit-imageURL">
                  Image URL <span className="form-optional">(optional)</span>
                </label>
                <input
                  id="edit-imageURL"
                  name="imageURL"
                  type="url"
                  inputMode="url"
                  className="form-input"
                  placeholder="https://"
                  value={formData.imageURL}
                  onChange={handleChange}
                  disabled={formBusy}
                />
                <p className="form-hint">If provided, must start with http:// or https://</p>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={formBusy}
                >
                  {isSubmitting ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </form>

          <section className="delete-section" aria-labelledby="delete-heading">
            <h2 id="delete-heading" className="delete-section__title">
              Delete creator
            </h2>
            <p className="delete-section__warn">
              This deletes the creator from the database. There is no undo here.
            </p>
            {deleteError ? (
              <div className="delete-section__error" role="alert">
                {deleteError}
              </div>
            ) : null}
            <button
              type="button"
              className="button button--danger"
              onClick={handleDeleteClick}
              disabled={formBusy}
            >
              {isDeleting ? 'Deleting…' : 'Delete creator'}
            </button>
          </section>

          <div className="form-page-links">
            <Link to={`/creator/${id}`} className="button button--secondary">
              Back to creator details
            </Link>
            <Link to="/" className="button button--secondary">
              Back to all creators
            </Link>
          </div>
        </>
      ) : null}
      </div>
    </div>
  )
}

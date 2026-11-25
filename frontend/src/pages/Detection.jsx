import { useState, useEffect } from 'react'
import {
  CameraIcon,
  CheckIcon,
  UploadIcon,
} from '../components/BotanicalIcons'

function Detection({
  onDetect,
  onPreviewDemo,
  isLoading = false,
  error = '',
  backendReady = false,
}) {
  const [photo, setPhoto] = useState(null)
  const [fileError, setFileError] = useState('')

  // Release temporary image URLs when no longer needed
  useEffect(() => {
    return () => {
      if (photo?.url) {
        URL.revokeObjectURL(photo.url)
      }
    }
  }, [photo])

  // Handles both camera photos and uploaded files
  function handleImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    setFileError('')

    const validTypes = ['image/jpeg', 'image/png']

    if (!validTypes.includes(file.type)) {
      setPhoto(null)
      setFileError('Please select a JPG or PNG image.')
      return
    }

    if (file.size === 0) {
      setPhoto(null)
      setFileError('The selected image is empty.')
      return
    }

    const maxSize = 10 * 1024 * 1024

    if (file.size > maxSize) {
      setPhoto(null)
      setFileError('Image size must be less than 10 MB.')
      return
    }

    setPhoto({
      file: file,
      url: URL.createObjectURL(file),
    })
  }

  function removeImage() {
    setPhoto(null)
    setFileError('')
  }

  return (
    <main className="animate-page-enter mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">

      <div className="border-b border-rule pb-6">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
          AGRISHIELD / DISEASE DETECTION
        </p>

        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Detect Crop Disease
        </h1>

        <p className="mt-2.5 text-base text-ink-muted">
          Take or upload a clear photograph of a tomato,
          potato or corn leaf.
        </p>
      </div>

      <section className="mt-8 rounded-lg border border-rule bg-card p-5 sm:p-8">

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Phone Camera */}
          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-accent/60 bg-accent-soft/40 px-6 py-8 text-center transition-colors duration-200 hover:border-accent hover:bg-accent-soft/70 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">

            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded border border-accent/30 bg-card text-accent transition-colors duration-200 group-hover:border-accent">
              <CameraIcon className="h-6 w-6" />
            </span>

            <h2 className="font-serif text-xl font-semibold text-ink">
              Take a Photo
            </h2>

            <p className="mt-1.5 text-sm text-ink-muted">
              Capture a leaf using your phone camera
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png"
              capture="environment"
              onChange={handleImage}
              disabled={isLoading}
              className="sr-only"
              aria-label="Take a leaf photograph"
            />

          </label>

          {/* Upload Existing Image */}
          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-rule-strong bg-paper px-6 py-8 text-center transition-colors duration-200 hover:border-ink hover:bg-paper-alt/70 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">

            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded border border-rule bg-card text-ink transition-colors duration-200 group-hover:border-ink">
              <UploadIcon className="h-6 w-6" />
            </span>

            <h2 className="font-serif text-xl font-semibold text-ink">
              Upload Image
            </h2>

            <p className="mt-1.5 text-sm text-ink-muted">
              Choose a photo from your device
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImage}
              disabled={isLoading}
              className="sr-only"
              aria-label="Upload a leaf photograph"
            />

          </label>

        </div>

        <p className="mt-4 text-center font-mono text-xs text-ink-faint">
          Supported formats: JPG and PNG | Maximum size: 10 MB
        </p>

        {/* File Error */}
        {fileError && (
          <p
            role="alert"
            className="mt-5 rounded border border-disease/30 border-l-4 border-l-disease bg-disease-soft px-4 py-3 text-sm font-medium text-disease"
          >
            {fileError}
          </p>
        )}

        {/* Selected Image Preview */}
        {photo && (
          <figure className="mt-6 rounded-md border border-rule bg-paper p-4 sm:p-5">

            <div className="mb-3 flex items-center justify-between gap-3 border-b border-rule pb-3">

              <h2 className="font-serif text-base font-semibold text-ink">
                Image Preview
              </h2>

              <button
                type="button"
                onClick={removeImage}
                disabled={isLoading}
                className="rounded border border-disease/30 bg-card px-3 py-1.5 text-xs font-medium text-disease transition-colors duration-150 hover:bg-disease-soft disabled:cursor-not-allowed disabled:opacity-45"
              >
                Remove
              </button>

            </div>

            <div className="relative overflow-hidden rounded border border-rule bg-card">
              <img
                src={photo.url}
                alt="Selected crop leaf"
                className="mx-auto max-h-80 w-full object-contain"
                onError={() => {
                  setPhoto(null)
                  setFileError('This image could not be opened.')
                }}
              />

              {isLoading && (
                <div
                  className="pointer-events-none absolute inset-0 bg-ink/10"
                  aria-hidden="true"
                >
                  <div className="animate-scan-line h-full w-full">
                    <div className="h-0.5 w-full bg-accent shadow-[0_0_8px_rgba(184,80,43,0.7)]" />
                  </div>
                </div>
              )}
            </div>

            <figcaption className="mt-3 break-all text-center font-mono text-xs text-ink-muted">
              {photo.file.name}
            </figcaption>

          </figure>
        )}

        {/* Loading */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="mt-5 flex items-center justify-center gap-2.5 rounded border border-rule bg-paper-alt px-4 py-3 text-center font-mono text-xs font-medium uppercase tracking-wider text-ink"
          >
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Analyzing your leaf photograph...
          </div>
        )}

        {/* Backend Error */}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded border border-disease/30 border-l-4 border-l-disease bg-disease-soft px-4 py-3 text-sm font-medium text-disease"
          >
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3 border-t border-rule pt-6">
          {/* Real AI Detection */}
          <button
            type="button"
            onClick={() => onDetect(photo?.file)}
            disabled={!photo || isLoading || !backendReady}
            className="w-full rounded-md bg-accent px-6 py-4 text-base font-semibold text-card transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-rule disabled:text-ink-faint"
          >
            {isLoading ? 'Analyzing Image...' : 'Detect Disease'}
          </button>

          {!backendReady && (
            <p className="text-center text-xs text-caution">
              Real detection will be available when the image-based
              backend API is connected.
            </p>
          )}

          {/* Sample Result */}
          <button
            type="button"
            onClick={() => onPreviewDemo(photo?.file)}
            disabled={!photo || isLoading}
            className="w-full rounded-md border border-rule-strong bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper-alt disabled:cursor-not-allowed disabled:opacity-45"
          >
            View Sample Diagnosis Report
          </button>

          <p className="text-center text-xs text-ink-faint">
            Sample results are for demonstration only.
            They are not real AI predictions.
          </p>
        </div>

      </section>

      {/* Photography Guidelines */}
      <section className="mt-8 rounded-lg border border-rule bg-paper-alt/60 p-5 sm:p-6">

        <h2 className="font-serif text-lg font-semibold text-ink">
          Tips for Better Results
        </h2>

        <ul className="mt-4 grid gap-2.5 text-sm text-ink-muted sm:grid-cols-2">
          {[
            'Capture one leaf at a time.',
            'Use sufficient lighting.',
            'Make sure the affected area is clearly visible.',
            'Avoid blurry photographs.',
            'Use tomato, potato or corn leaves.',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-healthy">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>

      </section>

    </main>
  )
}

export default Detection


import { useState, useEffect } from 'react'

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
    <main className="mx-auto max-w-5xl px-6 py-10">

      <p className="text-sm font-semibold text-emerald-700">
        AGRISHIELD / DISEASE DETECTION
      </p>

      <h1 className="mt-3 text-4xl font-bold text-emerald-950">
        Detect Crop Disease
      </h1>

      <p className="mt-3 text-slate-600">
        Take or upload a clear photograph of a tomato,
        potato or corn leaf.
      </p>

      <section className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Phone Camera */}
          <label className="cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center hover:bg-emerald-100 focus-within:ring-2 focus-within:ring-emerald-600">

            <h2 className="text-xl font-bold text-emerald-900">
              Take a Photo
            </h2>

            <p className="mt-2 text-sm text-slate-500">
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
          <label className="cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center hover:bg-emerald-100 focus-within:ring-2 focus-within:ring-emerald-600">

            <h2 className="text-xl font-bold text-emerald-900">
              Upload Image
            </h2>

            <p className="mt-2 text-sm text-slate-500">
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

        <p className="mt-4 text-center text-sm text-slate-500">
          Supported formats: JPG and PNG | Maximum size: 10 MB
        </p>

        {/* File Error */}
        {fileError && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {fileError}
          </p>
        )}

        {/* Selected Image Preview */}
        {photo && (
          <div className="mt-6 rounded-2xl border border-slate-200 p-4">

            <div className="mb-4 flex items-center justify-between gap-3">

              <h2 className="font-semibold text-slate-800">
                Image Preview
              </h2>

              <button
                type="button"
                onClick={removeImage}
                disabled={isLoading}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
              >
                Remove
              </button>

            </div>

            <img
              src={photo.url}
              alt="Selected crop leaf"
              className="mx-auto max-h-80 w-full rounded-xl bg-slate-50 object-contain"
              onError={() => {
                setPhoto(null)
                setFileError('This image could not be opened.')
              }}
            />

            <p className="mt-3 break-all text-center text-sm text-slate-500">
              {photo.file.name}
            </p>

          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl bg-blue-50 p-5 text-center text-blue-800"
          >
            Analyzing your leaf photograph...
          </div>
        )}

        {/* Backend Error */}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {/* Real AI Detection */}
        <button
          type="button"
          onClick={() => onDetect(photo?.file)}
          disabled={!photo || isLoading || !backendReady}
          className="mt-6 w-full rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? 'Analyzing Image...' : 'Detect Disease'}
        </button>

        {!backendReady && (
          <p className="mt-3 text-center text-sm text-amber-700">
            Real detection will be available when the image-based
            backend API is connected.
          </p>
        )}

        {/* Sample Result */}
        <button
          type="button"
          onClick={() => onPreviewDemo(photo?.file)}
          disabled={!photo || isLoading}
          className="mt-4 w-full rounded-xl border border-emerald-300 bg-white px-6 py-4 font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        >
          View Sample Diagnosis Report
        </button>

        <p className="mt-2 text-center text-xs text-slate-500">
          Sample results are for demonstration only.
          They are not real AI predictions.
        </p>

      </section>

      {/* Photography Guidelines */}
      <section className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

        <h2 className="text-lg font-bold text-emerald-900">
          Tips for Better Results
        </h2>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Capture one leaf at a time.</li>
          <li>Use sufficient lighting.</li>
          <li>Make sure the affected area is clearly visible.</li>
          <li>Avoid blurry photographs.</li>
          <li>Use tomato, potato or corn leaves.</li>
        </ul>

      </section>

    </main>
  )
}

export default Detection

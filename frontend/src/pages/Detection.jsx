
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

  // Clean up temporary image URLs
  useEffect(() => {
    return () => {
      if (photo) {
        URL.revokeObjectURL(photo.url)
      }
    }
  }, [photo])

  // Handle camera or uploaded image
  function handleImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    setFileError('')

    const validTypes = ['image/jpeg', 'image/png']
    const isValid =
      validTypes.includes(file.type) ||
      (!file.type && /\.(jpg|jpeg|png)$/i.test(file.name))

    if (!isValid || file.size === 0) {
      setPhoto(null)
      setFileError(
        'Please select a valid JPG or PNG image.'
      )
      return
    }

    setPhoto({
      file,
      url: URL.createObjectURL(file),
    })
  }

  function removeImage() {
    setPhoto(null)
    setFileError('')
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">

      <p className="text-sm font-semibold tracking-wider text-emerald-700">
        AGRISHIELD / DISEASE DETECTION
      </p>

      <h1 className="mt-3 text-4xl font-bold text-emerald-950">
        Detect Crop Disease
      </h1>

      <p className="mt-3 text-slate-600">
        Capture or upload a clear photograph of a
        tomato, potato or corn leaf.
      </p>

      <section className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

        {/* Camera and upload options */}
        <div className="grid gap-4 sm:grid-cols-2">

          <label className="cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center hover:bg-emerald-100 focus-within:ring-2 focus-within:ring-emerald-600">

            <div className="text-4xl">📷</div>

            <h2 className="mt-3 text-lg font-bold text-emerald-900">
              Take a Photo
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Use your device camera
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png"
              capture="environment"
              disabled={isLoading}
              onChange={handleImage}
              className="sr-only"
              aria-label="Take a leaf photograph"
            />

          </label>

          <label className="cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center hover:bg-emerald-100 focus-within:ring-2 focus-within:ring-emerald-600">

            <div className="text-4xl">📁</div>

            <h2 className="mt-3 text-lg font-bold text-emerald-900">
              Upload Image
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose an existing photograph
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png"
              disabled={isLoading}
              onChange={handleImage}
              className="sr-only"
              aria-label="Upload a leaf photograph"
            />

          </label>

        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          Supported formats: JPG, JPEG and PNG
        </p>

        {/* Validation errors */}
        {fileError && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {fileError}
          </div>
        )}

        {/* Image preview */}
        {photo && (
          <section className="mt-6 rounded-2xl border border-slate-200 p-4">

            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">
                Image Preview
              </h2>

              <button
                type="button"
                onClick={removeImage}
                disabled={isLoading}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
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

          </section>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl bg-blue-50 p-5 text-center text-blue-800"
          >
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
            Analyzing your leaf photograph...
          </div>
        )}

        {/* Backend error */}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Real prediction button */}
        <button
          type="button"
          onClick={() => onDetect(photo?.file)}
          disabled={!photo || isLoading || !backendReady}
          className="mt-6 w-full rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading
            ? 'Analyzing Image...'
            : 'Detect Disease'}
        </button>

        {!backendReady && (
          <p className="mt-3 text-center text-sm text-amber-700">
            Real AI detection is waiting for the image-based
            backend API.
          </p>
        )}

        {/* Demonstration button */}
        <button
          type="button"
          onClick={() => onPreviewDemo(photo?.file)}
          disabled={!photo || isLoading}
          className="mt-4 w-full rounded-xl border border-emerald-300 bg-white px-6 py-4 font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          View Sample Diagnosis Report
        </button>

        <p className="mt-2 text-center text-xs text-slate-500">
          The sample report is for interface testing only.
          It is not an AI prediction.
        </p>

      </section>

      {/* Photography guidelines */}
      <section className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

        <h2 className="text-lg font-bold text-emerald-900">
          Tips for Better Results
        </h2>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Capture one leaf at a time.</li>
          <li>Use sufficient lighting.</li>
          <li>Make sure the affected area is visible.</li>
          <li>Avoid blurry photographs.</li>
          <li>Use tomato, potato or corn leaves.</li>
        </ul>

      </section>

    </main>
  )
}

export default Detection

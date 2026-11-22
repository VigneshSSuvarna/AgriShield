
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { diseases } from '../data/diseases'

function Results({
  image,
  setPage,
  prediction = null,
  isDemo = !prediction,
}) {
  const imageRef = useRef(null)

  // Display uploaded image without updating React state
  useEffect(() => {
    if (!image || !imageRef.current) return

    const url = URL.createObjectURL(image)
    imageRef.current.src = url

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [image])

  // Sample prediction for demonstration only
  const demoPrediction = {
    prediction: 'Tomato___Late_blight',
    confidence: 94,
  }

  // Choose between demo and real prediction
  const result = isDemo
    ? demoPrediction
    : prediction || {}

  // Find matching information in the disease library
  const disease = diseases.find(
    (item) => item.modelLabel === result.prediction
  )

  const cropName = disease?.crop || 'Unknown Crop'

  const diseaseName =
    disease?.name ||
    result.prediction ||
    'Unknown Condition'

  const status = disease
    ? disease.healthy
      ? 'Healthy'
      : 'Diseased'
    : 'Unconfirmed'

  // Convert confidence into percentage
  const rawConfidence =
    result.confidence != null
      ? Number(result.confidence)
      : NaN

  const confidence = Number.isFinite(rawConfidence)
    ? Math.max(
        0,
        Math.min(
          100,
          rawConfidence <= 1
            ? rawConfidence * 100
            : rawConfidence
        )
      )
    : null

  // Retrieve symptoms from backend or disease library
  const symptoms = Array.isArray(result.symptoms)
    ? result.symptoms
    : disease?.symptoms || []

  // Retrieve recommendations
  const recommendations = Array.isArray(
    result.recommendations
  )
    ? result.recommendations
    : disease?.management || []

  const cause =
    disease?.cause || 'Information not available'

  // Logic verification status
  const verification = isDemo
    ? 'Not performed — demonstration'
    : result.verification_status ||
      result.logic_status ||
      result.verification ||
      'Not available from backend'

  // Markdown report
  const markdown = result.markdown_metrics || `
## Diagnosis Summary

**Crop:** ${cropName}

**Condition:** ${diseaseName}

**Status:** ${status}

**Confidence:** ${
    confidence !== null
      ? `${confidence.toFixed(2)}%`
      : 'Not available'
  }

## Symptoms

${
  symptoms.map((item) => `- ${item}`).join('\n') ||
  'Not available'
}

## Recommendations

${
  recommendations.map((item) => `- ${item}`).join('\n') ||
  'Not available'
}

## Logic Verification

${verification}
`

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">

      {/* Page heading */}
      <p className="text-sm font-semibold tracking-wider text-emerald-700">
        AGRISHIELD / DIAGNOSIS
      </p>

      <h1 className="mt-3 text-4xl font-bold text-emerald-950">
        Diagnosis Results
      </h1>

      {/* Demo warning */}
      {isDemo && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <strong>Demonstration Mode:</strong> This is a sample
          diagnosis. Your photograph has not been analyzed by AI.
        </div>
      )}

      {/* Main results */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">

        {/* Uploaded image */}
        <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-xl font-bold text-emerald-900">
            Uploaded Leaf
          </h2>

          {image ? (
            <img
              ref={imageRef}
              alt="Uploaded crop leaf"
              className="h-80 w-full rounded-xl bg-slate-50 object-contain"
            />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
              No image available
            </div>
          )}

          <p className="mt-3 break-all text-sm text-slate-500">
            {image?.name || ''}
          </p>

        </article>

        {/* Prediction */}
        <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

          <span
            className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
              status === 'Healthy'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'Diseased'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-slate-100 text-slate-700'
            }`}
          >
            {status}
          </span>

          <p className="mt-6 text-sm text-slate-500">
            Crop
          </p>

          <h2 className="text-2xl font-bold text-emerald-900">
            {cropName}
          </h2>

          <p className="mt-5 text-sm text-slate-500">
            Detected Condition
          </p>

          <h2 className="text-3xl font-bold text-slate-800">
            {diseaseName}
          </h2>

          {/* Confidence score */}
          <div className="mt-8">

            <div className="flex items-center justify-between gap-3">

              <p className="font-semibold text-slate-700">
                Prediction Confidence
              </p>

              <span className="text-2xl font-bold text-emerald-700">
                {confidence !== null
                  ? `${confidence.toFixed(2)}%`
                  : 'N/A'}
              </span>

            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600"
                style={{
                  width: `${confidence ?? 0}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              A confidence score does not guarantee
              a correct diagnosis.
            </p>

          </div>

        </article>

      </section>

      {/* Symptoms and causes */}
      <section className="mt-6 grid gap-6 md:grid-cols-2">

        <article className="rounded-2xl border border-emerald-100 bg-white p-6">

          <h2 className="text-xl font-bold text-emerald-900">
            Common Symptoms
          </h2>

          {symptoms.length > 0 ? (
            <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600">
              {symptoms.map((symptom, index) => (
                <li key={index}>
                  {symptom}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-500">
              No symptom information available.
            </p>
          )}

        </article>

        <article className="rounded-2xl border border-emerald-100 bg-white p-6">

          <h2 className="text-xl font-bold text-emerald-900">
            Cause / Condition
          </h2>

          <p className="mt-4 text-slate-600">
            {cause}
          </p>

        </article>

      </section>

      {/* Management recommendations */}
      <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

        <h2 className="text-xl font-bold text-emerald-900">
          Management Recommendations
        </h2>

        {recommendations.length > 0 ? (
          <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-700">
            {recommendations.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-600">
            Recommendations are not available yet.
          </p>
        )}

      </section>

      {/* Logic verification */}
      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">

        <h2 className="text-xl font-bold text-amber-900">
          Logic Verification
        </h2>

        <p className="mt-3 text-amber-800">
          {verification}
        </p>

      </section>

      {/* Markdown report */}
      <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6">

        <h2 className="mb-5 text-xl font-bold text-emerald-900">
          Detailed Diagnosis Report
        </h2>

        <div className="space-y-3 text-slate-700 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2">

          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>

        </div>

      </section>

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-wrap gap-4">

        <button
          type="button"
          onClick={() => setPage('detection')}
          className="rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white hover:bg-emerald-800"
        >
          Scan Another Leaf
        </button>

        <button
          type="button"
          onClick={() => setPage('diseases')}
          className="rounded-xl border border-emerald-300 bg-white px-6 py-4 font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          Explore Disease Library
        </button>

        <button
          type="button"
          onClick={() => setPage('home')}
          className="rounded-xl bg-slate-100 px-6 py-4 font-semibold text-slate-700 hover:bg-slate-200"
        >
          Back to Home
        </button>

      </div>

    </main>
  )
}

export default Results


import { useEffect, useRef } from 'react'
import { diseases } from '../data/diseases'
import TruthTableCard from '../components/TruthTableCard'
import MarkdownReport from '../components/MarkdownReport'

function Results({
  image,
  setPage,
  prediction = null,
  isDemo = !prediction,
}) {
  const imageRef = useRef(null)

  // Display the uploaded leaf photograph
  useEffect(() => {
    if (!image || !imageRef.current) return

    const imageUrl = URL.createObjectURL(image)
    imageRef.current.src = imageUrl

    return () => {
      URL.revokeObjectURL(imageUrl)
    }
  }, [image])

  // Mock result for frontend demonstration
  const demoPrediction = {
    prediction: 'Tomato___Late_blight',
    confidence: 94,
  }

  const result = isDemo
    ? demoPrediction
    : prediction || {}

  // Match prediction to the disease library
  const disease = diseases.find(
    (item) => item.modelLabel === result.prediction
  )

  const cropName =
    result.crop || disease?.crop || 'Unknown Crop'

  const diseaseName =
    disease?.name ||
    result.prediction ||
    'Unknown Condition'

  const status = disease
    ? disease.healthy
      ? 'Healthy'
      : 'Diseased'
    : 'Unconfirmed'

  // Convert model confidence to a percentage
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

  // Symptoms
  const symptoms = Array.isArray(result.symptoms)
    ? result.symptoms
    : disease?.symptoms || []

  // Disease cause
  const cause =
    result.cause ||
    disease?.cause ||
    'Information not available'

  // Management recommendations
  const recommendations = Array.isArray(
    result.recommendations
  )
    ? result.recommendations
    : disease?.management || []

  // Actual backend verification, if supplied
  const verification = isDemo
    ? 'Not performed - demonstration'
    : result.verification_status ||
      result.logic_status ||
      result.verification ||
      'Not available from backend'

  // Optional backend logic flags
  const logicFlags =
    !isDemo && Array.isArray(result.truth_table_flags)
      ? result.truth_table_flags
      : []

  // Format information as Markdown
  const symptomsMarkdown =
    symptoms.length > 0
      ? symptoms.map((item) => `- ${item}`).join('\n')
      : 'No symptom information available.'

  const recommendationsMarkdown =
    recommendations.length > 0
      ? recommendations
          .map((item) => `- ${item}`)
          .join('\n')
      : 'No recommendations available.'

  const confidenceText =
    confidence !== null
      ? `${confidence.toFixed(2)}%`
      : 'Not available'

  const generatedMarkdown = `
## Diagnosis Summary

**Crop:** ${cropName}

**Detected Condition:** ${diseaseName}

**Status:** ${status}

## Prediction Metrics

| Metric | Value |
| --- | --- |
| Crop | ${cropName} |
| Predicted Class | ${diseaseName} |
| Health Status | ${status} |
| Confidence Score | ${confidenceText} |

## Common Symptoms

${symptomsMarkdown}

## Cause / Condition

${cause}

## Management Recommendations

${recommendationsMarkdown}

## Logic Verification

${verification}
`

  // Use backend Markdown when available
  const markdown =
    !isDemo &&
    typeof result.markdown_metrics === 'string' &&
    result.markdown_metrics.trim()
      ? result.markdown_metrics
      : generatedMarkdown

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">

      {/* Page heading */}
      <p className="text-sm font-semibold tracking-wider text-emerald-700">
        AGRISHIELD / DIAGNOSIS
      </p>

      <h1 className="mt-3 text-4xl font-bold text-emerald-950">
        Diagnosis Results
      </h1>

      <p className="mt-3 text-slate-600">
        View the predicted crop condition, symptoms,
        recommendations and logical rule information.
      </p>

      {/* Sample mode warning */}
      {isDemo && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <strong>Demonstration Mode:</strong> This report
          contains sample data. The uploaded photograph
          has not been analyzed by AI.
        </div>
      )}

      {/* Main result cards */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">

        {/* Uploaded photograph */}
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

        {/* Prediction details */}
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
                {confidenceText}
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

      {/* Interactive truth table component */}
      <TruthTableCard
        initialDiseaseDetected={status === 'Diseased'}
        verificationStatus={verification}
        flags={logicFlags}
      />

      {/* Markdown report component */}
      <MarkdownReport
        markdown={markdown}
        isDemo={isDemo}
      />

      {/* Navigation */}
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

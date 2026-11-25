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
    <main className="animate-page-enter mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

      {/* Page heading */}
      <div className="border-b border-rule pb-6">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
          AGRISHIELD / DIAGNOSIS
        </p>

        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Diagnosis Results
        </h1>

        <p className="mt-2.5 max-w-2xl text-base text-ink-muted">
          View the predicted crop condition, symptoms,
          recommendations and logical rule information.
        </p>
      </div>

      {/* Sample mode warning */}
      {isDemo && (
        <div
          role="status"
          className="mt-6 rounded border border-caution/30 border-l-4 border-l-caution bg-caution-soft px-4 py-3.5 text-sm text-ink"
        >
          <strong className="font-semibold">Demonstration Mode:</strong> This report
          contains sample data. The uploaded photograph
          has not been analyzed by AI.
        </div>
      )}

      {/* Main result: Specimen photo beside Diagnosis Report Sheet */}
      <section className="mt-8 grid gap-6 lg:grid-cols-12">

        {/* Uploaded photograph */}
        <article className="flex flex-col rounded-lg border border-rule bg-card p-5 sm:p-6 lg:col-span-5">

          <h2 className="border-b border-rule pb-3 font-serif text-lg font-semibold text-ink">
            Uploaded Leaf
          </h2>

          <div className="mt-4 flex-1 overflow-hidden rounded border border-rule bg-paper">
            {image ? (
              <img
                ref={imageRef}
                alt="Uploaded crop leaf"
                className="h-72 w-full object-contain sm:h-80"
              />
            ) : (
              <div className="flex h-72 items-center justify-center font-mono text-xs text-ink-faint sm:h-80">
                No image available
              </div>
            )}
          </div>

          <p className="mt-3 break-all font-mono text-xs text-ink-muted">
            {image?.name || ''}
          </p>

        </article>

        {/* Prediction details (Diagnosis Report Sheet) */}
        <article className="flex flex-col justify-between rounded-lg border border-rule bg-card p-5 sm:p-8 lg:col-span-7">

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
              <span
                className={`inline-flex items-center rounded border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider ${
                  status === 'Healthy'
                    ? 'border-healthy/30 bg-healthy-soft text-healthy'
                    : status === 'Diseased'
                      ? 'border-disease/30 bg-disease-soft text-disease'
                      : 'border-rule bg-paper-alt text-ink-muted'
                }`}
              >
                {status}
              </span>

              <div className="text-right">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                  Crop
                </p>
                <h2 className="font-serif text-lg font-semibold text-ink">
                  {cropName}
                </h2>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                Detected Condition
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {diseaseName}
              </h2>
            </div>
          </div>

          {/* Confidence score */}
          <div className="mt-8 border-t border-rule pt-6">

            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-ink-muted">
                Prediction Confidence
              </p>

              <span className="font-mono text-2xl font-semibold text-ink">
                {confidenceText}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full border border-rule bg-paper-alt">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  status === 'Healthy'
                    ? 'bg-healthy'
                    : status === 'Diseased'
                      ? 'bg-accent'
                      : 'bg-ink-muted'
                }`}
                style={{
                  width: `${confidence ?? 0}%`,
                }}
              />
            </div>

            <p className="mt-2.5 text-xs text-ink-faint">
              A confidence score does not guarantee
              a correct diagnosis.
            </p>

          </div>

        </article>

      </section>

      {/* Symptoms and Management Recommendations */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">

        <article className="rounded-lg border border-rule bg-card p-5 sm:p-7">

          <h2 className="border-b border-rule pb-3 font-serif text-xl font-semibold text-ink">
            Common Symptoms
          </h2>

          {symptoms.length > 0 ? (
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-ink-muted marker:text-accent sm:text-base">
              {symptoms.map((symptom, index) => (
                <li key={index}>
                  {symptom}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-faint">
              No symptom information available.
            </p>
          )}

        </article>

        {/* Management recommendations */}
        <article className="rounded-lg border border-rule bg-paper-alt/60 p-5 sm:p-7">

          <h2 className="border-b border-rule pb-3 font-serif text-xl font-semibold text-ink">
            Management Recommendations
          </h2>

          {recommendations.length > 0 ? (
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-ink marker:text-healthy sm:text-base">
              {recommendations.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">
              Recommendations are not available yet.
            </p>
          )}

        </article>

      </section>

      {/* Cause / Condition */}
      <section className="mt-6 rounded-lg border border-rule bg-card p-5 sm:p-7">

        <h2 className="font-serif text-lg font-semibold text-ink">
          Cause / Condition
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
          {cause}
        </p>

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
      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-rule pt-8">

        <button
          type="button"
          onClick={() => setPage('detection')}
          className="rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-card transition-colors duration-200 hover:bg-accent-hover sm:text-base"
        >
          Scan Another Leaf
        </button>

        <button
          type="button"
          onClick={() => setPage('diseases')}
          className="rounded-md border border-rule-strong bg-card px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper-alt sm:text-base"
        >
          Explore Disease Library
        </button>

        <button
          type="button"
          onClick={() => setPage('home')}
          className="rounded-md px-5 py-3.5 text-sm font-medium text-ink-muted transition-colors duration-200 hover:bg-paper-alt hover:text-ink sm:text-base"
        >
          Back to Home
        </button>

      </div>

    </main>
  )
}

export default Results

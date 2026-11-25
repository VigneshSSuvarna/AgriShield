
import { useEffect, useState } from 'react'
import { diseases } from '../data/diseases'

// Local disease photographs
const diseasePhotos = {
  'tomato-healthy': '/images/tomato_healthy.JPG',
  'tomato-early-blight': '/images/tomato_early_blight.JPG',
  'tomato-late-blight': '/images/tomato_late_blight.JPG',

  'potato-healthy': '/images/potato_healthy.JPG',
  'potato-early-blight': '/images/potato_early_blight.jpg',
  'potato-late-blight': '/images/potato_late_blight.JPG',

  'corn-healthy': '/images/corn_healthy.jpg',
  'corn-common-rust': '/images/corn_common_rust.JPG',
  'corn-northern-leaf-blight':
    '/images/corn_northern_leaf_blight.jpg',
}

// Displays photographs in library cards and detail pages
function DiseasePhoto({ disease, variant = 'card' }) {
  const [imageFailed, setImageFailed] = useState(false)

  const imagePath = diseasePhotos[disease.id]
  const isDetail = variant === 'detail'

  // Consistent image dimensions for all detail pages
  const detailFrame =
    'flex h-[320px] w-full items-center justify-center ' +
    'bg-paper-alt p-3 sm:h-[440px] sm:p-6 lg:h-[500px]'

  const cardFrame =
    'h-44 w-full overflow-hidden bg-paper-alt sm:h-48'

  if (!imagePath || imageFailed) {
    return (
      <div className={isDetail ? detailFrame : cardFrame}>
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-ink-muted">
            Photograph unavailable
          </p>
        </div>
      </div>
    )
  }

  // Full image on disease details page
  if (isDetail) {
    return (
      <div className={detailFrame}>
        <img
          src={imagePath}
          alt={`Full photograph of ${disease.crop} - ${disease.name}`}
          className="block h-auto w-auto max-h-full max-w-full object-contain"
          onError={() => setImageFailed(true)}
        />
      </div>
    )
  }

  // Cropped thumbnail on library cards
  return (
    <div className={cardFrame}>
      <img
        src={imagePath}
        alt={`${disease.crop} - ${disease.name}`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    </div>
  )
}

function DiseaseInfo() {
  const [selectedCrop, setSelectedCrop] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedDisease, setSelectedDisease] = useState(null)

  // Scroll to top when switching between screens
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedDisease])

  // Search and filter diseases
  const filteredDiseases = diseases.filter((disease) => {
    const matchesCrop =
      selectedCrop === 'All' ||
      disease.crop === selectedCrop

    const matchesSearch =
      `${disease.crop} ${disease.name} ${disease.description}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())

    return matchesCrop && matchesSearch
  })

  function openDisease(disease) {
    setSelectedDisease(disease)
  }

  function backToLibrary() {
    setSelectedDisease(null)
  }

  // ==========================================
  // INDIVIDUAL DISEASE DETAILS PAGE
  // ==========================================

  if (selectedDisease) {
    return (
      <main className="animate-page-enter mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Back to library */}
        <button
          type="button"
          onClick={backToLibrary}
          className="inline-flex items-center gap-2 rounded border border-rule-strong bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper-alt"
        >
          <span aria-hidden="true">&larr;</span>
          Back to Disease Library
        </button>

        <p className="mt-8 font-mono text-xs font-medium uppercase tracking-widest text-accent">
          AGRISHIELD / DISEASE DETAILS
        </p>

        <section className="mt-4 overflow-hidden rounded-lg border border-rule bg-card">

          {/* Disease heading */}
          <div className="border-b border-rule bg-paper-alt/80 p-6 sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
                  {selectedDisease.crop}
                </p>

                <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                  {selectedDisease.name}
                </h1>
              </div>

              <span
                className={`self-start rounded border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider sm:self-center ${
                  selectedDisease.healthy
                    ? 'border-healthy/30 bg-healthy-soft text-healthy'
                    : 'border-disease/30 bg-disease-soft text-disease'
                }`}
              >
                {selectedDisease.healthy
                  ? 'Healthy'
                  : 'Disease'}
              </span>

            </div>

          </div>

          {/* Full photograph without any extra image link */}
          <DiseasePhoto
            key={selectedDisease.id}
            disease={selectedDisease}
            variant="detail"
          />

          {/* Overview */}
          <div className="border-t border-rule p-6 sm:p-8">

            <h2 className="font-serif text-xl font-semibold text-ink">
              Overview
            </h2>

            <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
              {selectedDisease.description}
            </p>

          </div>

        </section>

        {/* Symptoms and management guidance */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Symptoms */}
          <article className="rounded-lg border border-rule bg-card p-6">

            <h2 className="border-b border-rule pb-3 font-serif text-xl font-semibold text-ink">
              Common Symptoms
            </h2>

            {selectedDisease.symptoms?.length > 0 ? (
              <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-ink-muted marker:text-accent sm:text-base">

                {selectedDisease.symptoms.map(
                  (symptom, index) => (
                    <li key={index}>
                      {symptom}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink-faint">
                No symptom information available.
              </p>
            )}

          </article>

          {/* Management guidance */}
          <article className="rounded-lg border border-rule bg-paper-alt/60 p-6">

            <h2 className="border-b border-rule pb-3 font-serif text-xl font-semibold text-ink">
              Management Guidance
            </h2>

            {selectedDisease.management?.length > 0 ? (
              <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-ink marker:text-healthy sm:text-base">

                {selectedDisease.management.map(
                  (tip, index) => (
                    <li key={index}>
                      {tip}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink-muted">
                No management guidance available.
              </p>
            )}

          </article>

        </section>

        {/* Cause */}
        <section className="mt-6 rounded-lg border border-rule bg-card p-6">

          <h2 className="font-serif text-lg font-semibold text-ink">
            Cause / Condition
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            {selectedDisease.cause ||
              'Cause information not available.'}
          </p>

        </section>

        {/* Educational disclaimer */}
        <section className="mt-6 rounded border border-rule bg-paper-alt/50 px-5 py-4">

          <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">
            These photographs are reference examples.
            Actual symptoms may vary between plants and
            growing conditions. Consult qualified local
            agricultural guidance before applying chemical
            treatments.
          </p>

        </section>

        {/* Bottom back button */}
        <div className="mt-8 flex justify-start border-t border-rule pt-6">

          <button
            type="button"
            onClick={backToLibrary}
            className="rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-card transition-colors hover:bg-accent-hover sm:text-base"
          >
            Back to Disease Library
          </button>

        </div>

      </main>
    )
  }

  // ==========================================
  // MAIN DISEASE LIBRARY PAGE
  // ==========================================

  return (
    <main className="animate-page-enter mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

      {/* Page heading */}
      <div className="border-b border-rule pb-6">

        <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
          AGRISHIELD / CROP KNOWLEDGE BASE
        </p>

        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Disease Information Library
        </h1>

        <p className="mt-2.5 max-w-2xl text-base text-ink-muted">
          Explore the crop conditions supported by AgriShield,
          including common symptoms and basic management guidance.
        </p>

      </div>

      {/* Search and crop filters */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="w-full lg:max-w-md">

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search crop or disease..."
            aria-label="Search crop diseases"
            className="w-full rounded-md border border-rule-strong bg-card px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />

        </div>

        <div className="flex flex-wrap gap-2">

          {['All', 'Tomato', 'Potato', 'Corn'].map((crop) => (

            <button
              key={crop}
              type="button"
              onClick={() => setSelectedCrop(crop)}
              aria-pressed={selectedCrop === crop}
              className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${
                selectedCrop === crop
                  ? 'border-ink bg-ink text-paper'
                  : 'border-rule-strong bg-card text-ink-muted hover:border-ink hover:text-ink'
              }`}
            >
              {crop === 'All' ? 'All Crops' : crop}
            </button>

          ))}

        </div>

      </div>

      {/* Class count */}
      <p className="mt-6 border-b border-rule pb-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
        Showing {filteredDiseases.length} of {diseases.length} classes
      </p>

      {/* Disease cards */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">

        {filteredDiseases.map((disease) => (

          <button
            key={disease.id}
            type="button"
            onClick={() => openDisease(disease)}
            className="group flex flex-col overflow-hidden rounded-lg border border-rule bg-card text-left transition-colors hover:border-accent"
          >

            {/* Cropped card photograph */}
            <div className="overflow-hidden border-b border-rule bg-paper-alt">

              <DiseasePhoto
                key={disease.id}
                disease={disease}
                variant="card"
              />

            </div>

            {/* Card information */}
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">

              <div>

                <div className="flex flex-wrap items-start justify-between gap-3">

                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                      {disease.crop}
                    </p>

                    <h2 className="mt-1 font-serif text-xl font-semibold text-ink">
                      {disease.name}
                    </h2>
                  </div>

                  {/* Health status */}
                  <span
                    className={`shrink-0 rounded border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${
                      disease.healthy
                        ? 'border-healthy/30 bg-healthy-soft text-healthy'
                        : 'border-disease/30 bg-disease-soft text-disease'
                    }`}
                  >
                    {disease.healthy
                      ? 'Healthy'
                      : 'Disease'}
                  </span>

                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                  {disease.description}
                </p>

              </div>

              {/* View Details */}
              <p className="mt-5 flex items-center font-mono text-xs font-medium uppercase tracking-wider text-accent group-hover:text-accent-hover">

                View Details

                <span
                  className="ml-2 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  &rarr;
                </span>

              </p>

            </div>

          </button>

        ))}

      </div>

      {/* No search results */}
      {filteredDiseases.length === 0 && (
        <div className="mt-8 rounded-lg border border-rule bg-card p-8 text-center text-sm text-ink-muted">
          No matching crop conditions found.
        </div>
      )}

      {/* Library disclaimer */}
      <p className="mt-10 border-t border-rule pt-6 text-xs leading-relaxed text-ink-faint sm:text-sm">
        Photographs are reference examples for educational use.
        A photograph alone may not confirm every crop disease.
        Consult qualified local agricultural guidance before
        applying chemical treatments.
      </p>

    </main>
  )
}

export default DiseaseInfo

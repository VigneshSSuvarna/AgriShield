import { useEffect, useState } from 'react'
import { diseases } from '../data/diseases'
import { CropIllustration } from '../components/BotanicalIcons'

function DiseaseInfo() {
  const [selectedCrop, setSelectedCrop] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedDisease, setSelectedDisease] = useState(null)

  // Automatically scroll to the top when opening or
  // closing a disease details screen
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedDisease])

  // Filter diseases by crop and search
  const filteredDiseases = diseases.filter((disease) => {
    const matchesCrop =
      selectedCrop === 'All' ||
      disease.crop === selectedCrop

    const matchesSearch =
      `${disease.crop} ${disease.name}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())

    return matchesCrop && matchesSearch
  })

  function selectCrop(crop) {
    setSelectedCrop(crop)
  }

  function openDisease(disease) {
    setSelectedDisease(disease)
  }

  function backToLibrary() {
    setSelectedDisease(null)
  }

  // ==========================================
  // SEPARATE DISEASE DETAILS SCREEN
  // ==========================================

  if (selectedDisease) {
    return (
      <main className="animate-page-enter mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Back button */}
        <button
          type="button"
          onClick={backToLibrary}
          className="inline-flex items-center gap-2 rounded border border-rule-strong bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-paper-alt"
        >
          <span aria-hidden="true">&larr;</span>
          Back to Disease Library
        </button>

        {/* Heading */}
        <p className="mt-8 font-mono text-xs font-medium uppercase tracking-widest text-accent">
          AGRISHIELD / DISEASE DETAILS
        </p>

        <section className="mt-4 overflow-hidden rounded-lg border border-rule bg-card">

          {/* Field-guide header band */}
          <div className="border-b border-rule bg-paper-alt/80 p-6 sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-rule bg-card text-ink sm:h-20 sm:w-20">
                  <CropIllustration
                    crop={selectedDisease.crop}
                    className="h-10 w-10 sm:h-12 sm:w-12"
                  />
                </div>

                <div>
                  <p className="font-mono text-xs font-medium uppercase tracking-wider text-ink-muted">
                    {selectedDisease.crop}
                  </p>

                  <h1 className="mt-1 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                    {selectedDisease.name}
                  </h1>
                </div>
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

          {/* Overview */}
          <div className="p-6 sm:p-8">

            <h2 className="font-serif text-xl font-semibold text-ink">
              Overview
            </h2>

            <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
              {selectedDisease.description}
            </p>

          </div>

        </section>

        {/* Symptoms and recommendations */}
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

        {/* Cause information */}
        <section className="mt-6 rounded-lg border border-rule bg-card p-6">

          <h2 className="font-serif text-lg font-semibold text-ink">
            Cause / Condition
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            {selectedDisease.cause ||
              'Cause information not available.'}
          </p>

        </section>

        {/* Disclaimer */}
        <section className="mt-6 rounded border border-rule bg-paper-alt/50 px-5 py-4">

          <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">
            This information is provided for educational
            purposes. A photograph alone may not confirm
            every crop disease. Consult qualified local
            agricultural guidance before applying chemical
            treatments.
          </p>

        </section>

        {/* Bottom back button */}
        <div className="mt-8 flex justify-start border-t border-rule pt-6">

          <button
            type="button"
            onClick={backToLibrary}
            className="rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-card transition-colors duration-200 hover:bg-accent-hover sm:text-base"
          >
            Back to Disease Library
          </button>

        </div>

      </main>
    )
  }

  // ==========================================
  // MAIN DISEASE LIBRARY SCREEN
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

      {/* Search bar and crop filters */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="w-full lg:max-w-md">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search crop or disease..."
            aria-label="Search crop diseases"
            className="w-full rounded-md border border-rule-strong bg-card px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Crop filter buttons */}
        <div className="flex flex-wrap gap-2">

          {['All', 'Tomato', 'Potato', 'Corn'].map((crop) => (

            <button
              key={crop}
              type="button"
              onClick={() => selectCrop(crop)}
              aria-pressed={selectedCrop === crop}
              className={`rounded border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
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

      {/* Disease index */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">

        {filteredDiseases.map((disease) => (

          <button
            key={disease.id}
            type="button"
            onClick={() => openDisease(disease)}
            className="group flex flex-col justify-between rounded-lg border border-rule bg-card p-5 text-left transition-colors duration-200 hover:border-accent sm:p-6"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-rule bg-paper text-ink transition-colors duration-200 group-hover:border-accent/40 group-hover:text-accent">
                    <CropIllustration
                      crop={disease.crop}
                      className="h-7 w-7"
                    />
                  </div>

                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                      {disease.crop}
                    </p>

                    <h2 className="mt-0.5 font-serif text-xl font-semibold text-ink">
                      {disease.name}
                    </h2>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${
                    disease.healthy
                      ? 'border-healthy/30 bg-healthy-soft text-healthy'
                      : 'border-disease/30 bg-disease-soft text-disease'
                  }`}
                >
                  {disease.healthy ? 'Healthy' : 'Disease'}
                </span>
              </div>

              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                {disease.description}
              </p>
            </div>

            <p className="mt-5 flex items-center font-mono text-xs font-medium uppercase tracking-wider text-accent group-hover:text-accent-hover">
              View Details
              <span
                className="ml-2 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </p>

          </button>

        ))}

      </div>

      {/* No search results */}
      {filteredDiseases.length === 0 && (
        <div className="mt-8 rounded-lg border border-rule bg-card p-8 text-center text-sm text-ink-muted">
          No matching crop conditions found.
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-10 border-t border-rule pt-6 text-xs leading-relaxed text-ink-faint sm:text-sm">
        This library provides general educational information.
        A photograph alone may not confirm every crop disease.
        Consult qualified local agricultural guidance before
        applying chemical treatments.
      </p>

    </main>
  )
}

export default DiseaseInfo

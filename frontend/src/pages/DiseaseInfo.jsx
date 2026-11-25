
import { useEffect, useState } from 'react'
import { diseases } from '../data/diseases'

// Original crop icons
const cropIcons = {
  Tomato: '🍅',
  Potato: '🥔',
  Corn: '🌽',
}

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
      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Back button */}
        <button
          type="button"
          onClick={backToLibrary}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          <span aria-hidden="true">&larr;</span>
          Back to Disease Library
        </button>

        {/* Heading */}
        <p className="mt-8 text-sm font-semibold tracking-wider text-emerald-700">
          AGRISHIELD / DISEASE DETAILS
        </p>

        <section className="mt-5 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">

          {/* Crop icon and disease name */}
          <div className="bg-emerald-50 p-8">

            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-white text-7xl shadow-sm">
              {cropIcons[selectedDisease.crop]}
            </div>

            <p className="text-sm font-semibold text-emerald-700">
              {selectedDisease.crop}
            </p>

            <h1 className="mt-2 text-4xl font-bold text-emerald-950">
              {selectedDisease.name}
            </h1>

            <span
              className={`mt-5 inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                selectedDisease.healthy
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {selectedDisease.healthy
                ? 'Healthy'
                : 'Disease'}
            </span>

          </div>

          {/* Overview */}
          <div className="p-6 md:p-8">

            <h2 className="text-xl font-bold text-emerald-900">
              Overview
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              {selectedDisease.description}
            </p>

          </div>

        </section>

        {/* Symptoms and recommendations */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Symptoms */}
          <article className="rounded-2xl bg-amber-50 p-6">

            <h2 className="text-xl font-bold text-amber-900">
              Common Symptoms
            </h2>

            {selectedDisease.symptoms?.length > 0 ? (
              <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-700">
                {selectedDisease.symptoms.map(
                  (symptom, index) => (
                    <li key={index}>
                      {symptom}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="mt-4 text-slate-600">
                No symptom information available.
              </p>
            )}

          </article>

          {/* Management guidance */}
          <article className="rounded-2xl bg-emerald-50 p-6">

            <h2 className="text-xl font-bold text-emerald-900">
              Management Guidance
            </h2>

            {selectedDisease.management?.length > 0 ? (
              <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-700">
                {selectedDisease.management.map(
                  (tip, index) => (
                    <li key={index}>
                      {tip}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="mt-4 text-slate-600">
                No management guidance available.
              </p>
            )}

          </article>

        </section>

        {/* Cause information */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

          <h2 className="text-xl font-bold text-slate-800">
            Cause / Condition
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {selectedDisease.cause ||
              'Cause information not available.'}
          </p>

        </section>

        {/* Disclaimer */}
        <section className="mt-6 rounded-2xl bg-slate-50 p-6">

          <p className="text-sm leading-relaxed text-slate-600">
            This information is provided for educational
            purposes. A photograph alone may not confirm
            every crop disease. Consult qualified local
            agricultural guidance before applying chemical
            treatments.
          </p>

        </section>

        {/* Bottom back button */}
        <div className="mt-8 flex justify-center">

          <button
            type="button"
            onClick={backToLibrary}
            className="rounded-xl bg-emerald-700 px-8 py-4 font-semibold text-white transition hover:bg-emerald-800"
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
    <main className="mx-auto max-w-7xl px-6 py-10">

      {/* Page heading */}
      <p className="text-sm font-semibold tracking-wider text-emerald-700">
        AGRISHIELD / CROP KNOWLEDGE BASE
      </p>

      <h1 className="mt-3 text-4xl font-bold text-emerald-950">
        Disease Information Library
      </h1>

      <p className="mt-3 max-w-2xl text-slate-600">
        Explore the crop conditions supported by AgriShield,
        including common symptoms and basic management guidance.
      </p>

      {/* Search bar */}
      <div className="mt-8">

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search crop or disease..."
          aria-label="Search crop diseases"
          className="w-full rounded-xl border border-emerald-200 bg-white px-5 py-4 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />

      </div>

      {/* Crop filter buttons */}
      <div className="mt-5 flex flex-wrap gap-3">

        {['All', 'Tomato', 'Potato', 'Corn'].map((crop) => (

          <button
            key={crop}
            type="button"
            onClick={() => selectCrop(crop)}
            aria-pressed={selectedCrop === crop}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              selectedCrop === crop
                ? 'bg-emerald-700 text-white'
                : 'border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            {crop === 'All' ? 'All Crops' : crop}
          </button>

        ))}

      </div>

      {/* Class count */}
      <p className="mt-6 text-sm text-slate-500">
        Showing {filteredDiseases.length} of {diseases.length} classes
      </p>

      {/* Disease cards */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {filteredDiseases.map((disease) => (

          <button
            key={disease.id}
            type="button"
            onClick={() => openDisease(disease)}
            className="group rounded-2xl border border-emerald-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >

            {/* ORIGINAL CROP ICONS RESTORED */}
            <div className="mb-5 flex h-20 items-center justify-center rounded-xl bg-emerald-50 text-5xl">
              {cropIcons[disease.crop]}
            </div>

            {/* Crop name */}
            <p className="text-sm font-medium text-slate-500">
              {disease.crop}
            </p>

            {/* Disease name */}
            <h2 className="mt-2 text-xl font-bold text-emerald-950">
              {disease.name}
            </h2>

            {/* Health status */}
            <span
              className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                disease.healthy
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {disease.healthy ? 'Healthy' : 'Disease'}
            </span>

            {/* Short description */}
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {disease.description}
            </p>

            {/* View Details */}
            <p className="mt-5 font-semibold text-emerald-700 group-hover:text-emerald-900">
              View Details
              <span className="ml-2" aria-hidden="true">
                &rarr;
              </span>
            </p>

          </button>

        ))}

      </div>

      {/* No search results */}
      {filteredDiseases.length === 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          No matching crop conditions found.
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-8 text-sm leading-relaxed text-slate-500">
        This library provides general educational information.
        A photograph alone may not confirm every crop disease.
        Consult qualified local agricultural guidance before
        applying chemical treatments.
      </p>

    </main>
  )
}

export default DiseaseInfo


import { useState } from 'react'
import { diseases } from '../data/diseases'

const cropIcons = {
  Tomato: '🍅',
  Potato: '🥔',
  Corn: '🌽',
}

function DiseaseInfo() {
  const [selectedCrop, setSelectedCrop] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedDisease, setSelectedDisease] = useState(null)

  const filteredDiseases = diseases.filter((disease) => {
    const matchesCrop =
      selectedCrop === 'All' || disease.crop === selectedCrop

    const matchesSearch =
      `${disease.crop} ${disease.name}`
        .toLowerCase()
        .includes(search.toLowerCase())

    return matchesCrop && matchesSearch
  })

  function selectCrop(crop) {
    setSelectedCrop(crop)
    setSelectedDisease(null)
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

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

      {/* Search */}
      <div className="mt-8">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setSelectedDisease(null)
          }}
          placeholder="Search crop or disease..."
          aria-label="Search crop diseases"
          className="w-full rounded-xl border border-emerald-200 bg-white px-5 py-4 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Crop filters */}
      <div className="mt-5 flex flex-wrap gap-3">
        {['All', 'Tomato', 'Potato', 'Corn'].map((crop) => (
          <button
            key={crop}
            type="button"
            onClick={() => selectCrop(crop)}
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

      <p className="mt-6 text-sm text-slate-500">
        Showing {filteredDiseases.length} of {diseases.length} classes
      </p>

      {/* Disease cards */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {filteredDiseases.map((disease) => (
          <button
            key={disease.id}
            type="button"
            onClick={() => setSelectedDisease(disease)}
            aria-pressed={selectedDisease?.id === disease.id}
            className={`rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
              selectedDisease?.id === disease.id
                ? 'border-emerald-600 ring-2 ring-emerald-100'
                : 'border-emerald-100'
            }`}
          >

            <div className="mb-5 flex h-20 items-center justify-center rounded-xl bg-emerald-50 text-5xl">
              {cropIcons[disease.crop]}
            </div>

            <p className="text-sm font-medium text-slate-500">
              {disease.crop}
            </p>

            <h2 className="mt-2 text-xl font-bold text-emerald-950">
              {disease.name}
            </h2>

            <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              disease.healthy
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {disease.healthy ? 'Healthy' : 'Disease'}
            </span>

            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {disease.description}
            </p>

            <p className="mt-5 text-sm font-semibold text-emerald-700">
              View Details →
            </p>

          </button>
        ))}

      </div>

      {filteredDiseases.length === 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          No matching crop conditions found.
        </div>
      )}

      {/* Selected disease details */}
      {selectedDisease && (
        <section className="mt-10 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                {selectedDisease.crop}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-emerald-950">
                {selectedDisease.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDisease(null)}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Close
            </button>
          </div>

          <p className="mt-5 leading-relaxed text-slate-600">
            {selectedDisease.description}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* Symptoms */}
            <article className="rounded-2xl bg-amber-50 p-6">

              <h3 className="text-xl font-bold text-amber-900">
                Common Symptoms
              </h3>

              <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-700">
                {selectedDisease.symptoms.map((symptom) => (
                  <li key={symptom}>{symptom}</li>
                ))}
              </ul>

            </article>

            {/* Recommendations */}
            <article className="rounded-2xl bg-emerald-50 p-6">

              <h3 className="text-xl font-bold text-emerald-900">
                Management Guidance
              </h3>

              <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-700">
                {selectedDisease.management.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>

            </article>

          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">

            <h3 className="font-bold text-slate-800">
              Cause / Condition
            </h3>

            <p className="mt-2 text-slate-600">
              {selectedDisease.cause}
            </p>

          </div>

        </section>
      )}

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

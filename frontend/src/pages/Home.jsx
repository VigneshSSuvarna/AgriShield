
const crops = [
  {
    name: 'Tomato',
    icon: '🍅',
    diseases: 'Early Blight and Late Blight',
  },
  {
    name: 'Potato',
    icon: '🥔',
    diseases: 'Early Blight and Late Blight',
  },
  {
    name: 'Corn',
    icon: '🌽',
    diseases: 'Common Rust and Northern Leaf Blight',
  },
]

const steps = [
  {
    number: '01',
    title: 'Capture or Upload',
    description: 'Take a clear photograph of a crop leaf.',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'The trained AI model analyzes the leaf image.',
  },
  {
    number: '03',
    title: 'View Diagnosis',
    description: 'View the prediction, symptoms and recommendations.',
  },
]

function Home({ setPage }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      {/* Hero section */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-950 to-emerald-700 px-8 py-16 text-white md:px-16">

        <p className="mb-4 text-sm font-semibold tracking-widest text-emerald-200">
          AI-POWERED CROP HEALTH
        </p>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Healthy crops.
          <br />
          Smarter decisions.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-emerald-100">
          Identify crop leaf diseases using artificial
          intelligence and receive clear information to
          support better farming decisions.
        </p>

        <button
          onClick={() => setPage('detection')}
          className="mt-8 rounded-xl bg-white px-7 py-4 font-semibold text-emerald-900 transition hover:bg-emerald-100"
        >
          Start Detection →
        </button>

        <div className="mt-10 flex flex-wrap gap-6 border-t border-emerald-500 pt-6 text-sm text-emerald-100">
          <span>3 Supported Crops</span>
          <span>9 Classification Categories</span>
          <span>Image-Based Detection</span>
        </div>

      </section>

      {/* Supported crops */}
      <section className="mt-14">

        <h2 className="text-3xl font-bold text-emerald-950">
          Supported Crops
        </h2>

        <p className="mt-2 text-slate-500">
          Explore the crops supported by AgriShield.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          {crops.map(crop => (
            <article
              key={crop.name}
              className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-24 items-center justify-center rounded-xl bg-emerald-50 text-6xl">
                {crop.icon}
              </div>

              <h3 className="text-xl font-bold text-emerald-900">
                {crop.name}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {crop.diseases}
              </p>

              <p className="mt-3 text-sm font-medium text-emerald-700">
                1 healthy class · 2 disease classes
              </p>
            </article>
          ))}

        </div>
      </section>

      {/* Workflow */}
      <section className="mt-14">

        <h2 className="text-3xl font-bold text-emerald-950">
          How It Works
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          {steps.map(step => (
            <article
              key={step.number}
              className="rounded-2xl border border-emerald-100 bg-white p-6"
            >
              <span className="inline-block rounded-xl bg-emerald-100 px-4 py-2 font-bold text-emerald-800">
                {step.number}
              </span>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </article>
          ))}

        </div>
      </section>

    </main>
  )
}

export default Home

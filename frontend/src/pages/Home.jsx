import {
  CropIllustration,
  HeroBotanicalSpecimen,
} from '../components/BotanicalIcons'

const crops = [
  {
    name: 'Tomato',
    diseases: 'Early Blight and Late Blight',
  },
  {
    name: 'Potato',
    diseases: 'Early Blight and Late Blight',
  },
  {
    name: 'Corn',
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
    <main className="animate-page-enter mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

      {/* Hero section */}
      <section className="grid items-center gap-10 border-b border-rule pb-12 lg:grid-cols-12 lg:gap-12 lg:pb-16">

        <div className="lg:col-span-7">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
            AI-POWERED CROP HEALTH
          </p>

          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            Healthy crops.
            <br />
            Smarter decisions.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Identify crop leaf diseases using artificial
            intelligence and receive clear information to
            support better farming decisions.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setPage('detection')}
              className="inline-flex items-center justify-center rounded-md bg-accent px-7 py-4 text-base font-semibold text-card transition-colors duration-200 hover:bg-accent-hover"
            >
              Start Detection →
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-lg border border-rule bg-card p-6 sm:p-8">
            <HeroBotanicalSpecimen className="mx-auto max-h-72 w-full" />
          </div>
        </div>

      </section>

      {/* Clean data strip */}
      <section className="grid divide-y divide-rule border-b border-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="py-4 sm:px-6 sm:first:pl-0">
          <span className="font-mono text-sm font-medium text-ink">
            3 Supported Crops
          </span>
        </div>
        <div className="py-4 sm:px-6">
          <span className="font-mono text-sm font-medium text-ink">
            9 Classification Categories
          </span>
        </div>
        <div className="py-4 sm:px-6 sm:last:pr-0">
          <span className="font-mono text-sm font-medium text-ink">
            Image-Based Detection
          </span>
        </div>
      </section>

      {/* Supported crops */}
      <section className="mt-14 sm:mt-16">

        <div className="flex flex-col justify-between gap-2 border-b border-rule pb-4 sm:flex-row sm:items-end">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Supported Crops
          </h2>

          <p className="text-sm text-ink-muted">
            Explore the crops supported by AgriShield.
          </p>
        </div>

        <div className="mt-6 grid divide-y divide-rule rounded-lg border border-rule bg-card md:grid-cols-3 md:divide-x md:divide-y-0">

          {crops.map(crop => (
            <article
              key={crop.name}
              className="flex flex-col justify-between p-6 sm:p-7"
            >
              <div>
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded border border-rule bg-paper text-ink">
                  <CropIllustration crop={crop.name} className="h-9 w-9" />
                </div>

                <h3 className="font-serif text-2xl font-semibold text-ink">
                  {crop.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {crop.diseases}
                </p>
              </div>

              <p className="mt-6 border-t border-rule pt-3 font-mono text-xs text-healthy">
                1 healthy class · 2 disease classes
              </p>
            </article>
          ))}

        </div>
      </section>

      {/* Workflow */}
      <section className="mt-14 border-t border-rule pt-12 sm:mt-16 sm:pt-14">

        <h2 className="font-serif text-3xl font-semibold text-ink">
          How It Works
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">

          {steps.map((step, index) => (
            <article
              key={step.number}
              className="relative border-l border-rule pl-6 md:border-l-0 md:border-t md:pl-0 md:pt-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-semibold text-accent">
                  {step.number}
                </span>
                {index < steps.length - 1 && (
                  <span
                    className="hidden h-px flex-1 bg-rule md:block"
                    aria-hidden="true"
                  />
                )}
              </div>

              <h3 className="mt-3 font-serif text-xl font-semibold text-ink">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
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

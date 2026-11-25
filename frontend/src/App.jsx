
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Detection from './pages/Detection'
import Results from './pages/Results'
import DiseaseInfo from './pages/DiseaseInfo'
import { predictLeafDisease } from './services/api'

function App() {
  const [page, setPage] = useState('home')
  const [selectedImage, setSelectedImage] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [demoMode, setDemoMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // True only when an image API endpoint is configured
  const backendReady = Boolean(
    import.meta.env.VITE_PREDICT_ENDPOINT
  )

  function navigateTo(newPage) {
    if (newPage !== 'results') {
      setSelectedImage(null)
      setPrediction(null)
    }

    setError('')
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  // Request a real prediction from the backend
  async function handleDetection(image) {
    if (!image || isLoading) return

    setError('')
    setIsLoading(true)

    try {
      const result = await predictLeafDisease(image)

      if (
        !result ||
        typeof result.prediction !== 'string' ||
        !result.prediction.trim() ||
        result.confidence == null ||
        !Number.isFinite(Number(result.confidence))
      ) {
        throw new Error(
          'The backend returned an incomplete prediction.'
        )
      }

      setSelectedImage(image)
      setPrediction(result)
      setDemoMode(false)
      setPage('results')
      window.scrollTo(0, 0)

    } catch (err) {
      setError(
        err.message || 'Unable to analyze the image.'
      )

    } finally {
      setIsLoading(false)
    }
  }

  // Open results with clearly labelled sample data
  function handleDemo(image) {
    if (!image || isLoading) return

    setSelectedImage(image)
    setPrediction(null)
    setDemoMode(true)
    setError('')
    setPage('results')
    window.scrollTo(0, 0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">

      <Navbar
        page={page === 'results' ? 'detection' : page}
        setPage={navigateTo}
      />

      <div className="flex-1">

        {page === 'home' && (
          <Home setPage={navigateTo} />
        )}

        {page === 'detection' && (
          <Detection
            onDetect={handleDetection}
            onPreviewDemo={handleDemo}
            isLoading={isLoading}
            error={error}
            backendReady={backendReady}
          />
        )}

        {page === 'results' && (
          <Results
            image={selectedImage}
            prediction={prediction}
            isDemo={demoMode}
            setPage={navigateTo}
          />
        )}

        {page === 'diseases' && (
          <DiseaseInfo />
        )}

      </div>

      <footer className="mt-16 border-t border-rule bg-paper-alt/60 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-serif text-lg font-semibold text-ink">
              AgriShield
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">
              Crop Health and Pest Expert System
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            AI-Powered Crop Disease Detection
          </p>
        </div>
      </footer>

    </div>
  )
}

export default App

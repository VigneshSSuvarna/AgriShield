
import { useState } from 'react'
import SensorForm, { sensors } from './components/SensorForm'
import ChoiceToggles from './components/ChoiceToggles'

function App() {
  // Store the seven sensor readings
  const [values, setValues] = useState(
    Object.fromEntries(
      sensors.map(sensor => [
        sensor.key,
        sensor.defaultValue
      ])
    )
  )

  // Store selected farming actions
  const [selectedActions, setSelectedActions] = useState([])

  // Store form submission result
  const [result, setResult] = useState(null)

  // Update the value of a sensor
  function updateSensor(key, value) {
    setValues(previous => ({
      ...previous,
      [key]: Number(value)
    }))

    setResult(null)
  }

  // Select or deselect a farming action
  function toggleAction(key) {
    setSelectedActions(previous =>
      previous.includes(key)
        ? previous.filter(action => action !== key)
        : [...previous, key]
    )

    setResult(null)
  }

  // Validate and collect form inputs
  function handleSubmit(event) {
    event.preventDefault()

    const valid = sensors.every(sensor => {
      const value = values[sensor.key]

      return (
        Number.isFinite(value) &&
        value >= sensor.min &&
        value <= sensor.max
      )
    })

    if (!valid) {
      alert('Please check your sensor readings.')
      return
    }

    const formData = {
      ...values,
      planned_actions: selectedActions
    }

    console.log('Form data:', formData)

    setResult(formData)
  }

  return (
    <div className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-800">
      <main className="mx-auto max-w-4xl">

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-3 text-5xl">🌱</div>

          <h1 className="text-4xl font-bold text-emerald-800">
            AgriShield
          </h1>

          <p className="mt-3 text-slate-600">
            Crop Health and Pest Expert System
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Enter soil and environmental readings
            to begin an assessment.
          </p>
        </header>

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Sensor Sliders */}
          <SensorForm
            values={values}
            onChange={updateSensor}
          />

          {/* Farming Action Checkboxes */}
          <ChoiceToggles
            selectedActions={selectedActions}
            onToggle={toggleAction}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white hover:bg-emerald-800"
          >
            Check Inputs
          </button>
        </form>

        {/* Form Submission Result */}
        {result && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-3 text-xl font-semibold text-emerald-800">
              Form Data Collected
            </h2>

            <p className="mb-4 text-sm text-slate-600">
              Sensor values and planned actions have
              been collected successfully.
              Backend diagnosis is not connected yet.
            </p>

            <pre className="overflow-x-auto rounded-xl bg-slate-100 p-4 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>

          </section>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-slate-500">
          AgriShield • Crop Health & Pest Expert System
        </footer>

      </main>
    </div>
  )
}

export default App

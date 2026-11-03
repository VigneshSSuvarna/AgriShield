
export const sensors = [
  { key: 'nitrogen', label: 'Nitrogen (N)', min: 0, max: 140, step: 1, defaultValue: 50 },
  { key: 'phosphorus', label: 'Phosphorus (P)', min: 0, max: 145, step: 1, defaultValue: 50 },
  { key: 'potassium', label: 'Potassium (K)', min: 0, max: 205, step: 1, defaultValue: 50 },
  { key: 'temperature', label: 'Temperature', min: 0, max: 50, step: 1, defaultValue: 25, unit: '°C' },
  { key: 'humidity', label: 'Humidity', min: 0, max: 100, step: 1, defaultValue: 60, unit: '%' },
  { key: 'ph', label: 'Soil pH', min: 0, max: 14, step: 0.1, defaultValue: 6.5 },
  { key: 'moisture', label: 'Soil Moisture', min: 0, max: 100, step: 1, defaultValue: 40, unit: '%' },
]

function SensorForm({ values, onChange }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-emerald-800">
        Soil & Environmental Sensors
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Adjust the sliders according to the available sensor readings.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {sensors.map((sensor) => (
          <div key={sensor.key}>
            <div className="mb-2 flex justify-between">
              <label htmlFor={sensor.key} className="font-medium">
                {sensor.label}
              </label>

              <span className="font-semibold text-emerald-700">
                {values[sensor.key]}{sensor.unit || ''}
              </span>
            </div>

            <input
              id={sensor.key}
              type="range"
              min={sensor.min}
              max={sensor.max}
              step={sensor.step}
              value={values[sensor.key]}
              onChange={(event) =>
                onChange(sensor.key, Number(event.target.value))
              }
              className="w-full cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-xs text-slate-400">
              <span>{sensor.min}</span>
              <span>{sensor.max}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SensorForm

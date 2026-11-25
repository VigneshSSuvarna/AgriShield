
import { useState } from 'react'

function TruthTableCard({
  initialDiseaseDetected = false,
  verificationStatus = '',
  flags = [],
}) {
  const [diseaseDetected, setDiseaseDetected] = useState(
    Boolean(initialDiseaseDetected)
  )
  const [rainExpected, setRainExpected] = useState(false)

  // Proposed rule: Spray = D AND NOT R
  const rows = [
    { disease: false, rain: false },
    { disease: false, rain: true },
    { disease: true, rain: false },
    { disease: true, rain: true },
  ]

  const canSpray = diseaseDetected && !rainExpected

  function isActiveRow(row) {
    return (
      row.disease === diseaseDetected &&
      row.rain === rainExpected
    )
  }

  return (
    <section className="mt-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-emerald-900">
        Truth Table Matrix Viewer
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        This table demonstrates the logical rule used to check
        whether the conditions for spraying are satisfied.
      </p>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">
          Logical Expression
        </p>

        <p className="mt-2 text-lg font-bold text-emerald-800">
          Spray = D AND NOT R
        </p>

        <p className="mt-2 text-sm text-slate-600">
          D = Disease Detected
        </p>

        <p className="text-sm text-slate-600">
          R = Rain Expected
        </p>
      </div>

      {/* Interactive scenario inputs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={diseaseDetected}
            onChange={(event) =>
              setDiseaseDetected(event.target.checked)
            }
            className="h-5 w-5 accent-emerald-700"
          />

          <span className="text-sm font-medium text-slate-700">
            Disease Detected (D)
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={rainExpected}
            onChange={(event) =>
              setRainExpected(event.target.checked)
            }
            className="h-5 w-5 accent-emerald-700"
          />

          <span className="text-sm font-medium text-slate-700">
            Rain Expected (R)
          </span>
        </label>

      </div>

      <p className="mt-3 text-xs text-slate-500">
        Change either checkbox to explore the truth table.
        These are example conditions, not live weather data.
      </p>

      {/* Truth table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">

        <table className="w-full min-w-[440px] border-collapse text-left text-sm">

          <thead className="bg-emerald-900 text-white">
            <tr>
              <th className="px-4 py-4">
                Disease (D)
              </th>

              <th className="px-4 py-4">
                Rain (R)
              </th>

              <th className="px-4 py-4">
                D AND NOT R
              </th>

              <th className="px-4 py-4">
                Active
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const allowed = row.disease && !row.rain
              const active = isActiveRow(row)

              const rowColor = active
                ? allowed
                  ? 'bg-green-100 text-green-900'
                  : 'bg-red-100 text-red-900'
                : 'bg-white text-slate-700'

              return (
                <tr
                  key={index}
                  className={`border-t border-slate-200 ${rowColor}`}
                >
                  <td className="px-4 py-4 font-medium">
                    {row.disease ? 'True' : 'False'}
                  </td>

                  <td className="px-4 py-4">
                    {row.rain ? 'True' : 'False'}
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {allowed ? 'True' : 'False'}
                  </td>

                  <td className="px-4 py-4">
                    {active ? (
                      <span className="font-bold">
                        Current Row
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>

      </div>

      {/* Dynamic decision */}
      <div
        role="status"
        aria-live="polite"
        className={`mt-5 rounded-xl border p-4 ${
          canSpray
            ? 'border-green-300 bg-green-50 text-green-900'
            : 'border-red-300 bg-red-50 text-red-900'
        }`}
      >
        <p className="text-sm font-semibold">
          Current Logical Result
        </p>

        <p className="mt-2 text-lg font-bold">
          {canSpray
            ? 'TRUE - Rule conditions satisfied'
            : 'FALSE - Rule conditions not satisfied'}
        </p>

        <p className="mt-2 text-sm">
          {canSpray
            ? 'Disease is detected and rain is not expected.'
            : 'The conditions required by the example spraying rule are not both satisfied.'}
        </p>
      </div>

      {/* Backend verification */}
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

        <p className="font-semibold text-amber-900">
          Backend Logic Verification
        </p>

        <p className="mt-2 text-sm text-amber-800">
          {verificationStatus ||
            'No verification result available.'}
        </p>

      </div>

      {/* Optional rule flags returned by backend */}
      {Array.isArray(flags) && flags.length > 0 && (
        <div className="mt-5">

          <h3 className="font-bold text-slate-800">
            Backend Rule Checks
          </h3>

          <div className="mt-3 space-y-3">

            {flags.map((flag, index) => {
              const statusText = String(flag.status || '')
              const allowed =
                statusText.toLowerCase().includes('allowed')

              return (
                <div
                  key={index}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3"
                >
                  <span className="text-sm text-slate-700">
                    {flag.rule}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      allowed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {statusText || 'Unknown'}
                  </span>
                </div>
              )
            })}

          </div>
        </div>
      )}

      <p className="mt-5 text-xs text-slate-500">
        This interactive truth table demonstrates a simplified
        logical condition. It does not determine whether pesticide
        application is safe or appropriate in a real field.
      </p>

    </section>
  )
}

export default TruthTableCard

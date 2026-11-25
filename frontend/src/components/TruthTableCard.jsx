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
    <section className="mt-8 rounded-lg border border-rule bg-card p-5 sm:p-8">

      <div className="border-b border-rule pb-4">
        <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
          Truth Table Matrix Viewer
        </h2>

        <p className="mt-1.5 text-sm text-ink-muted">
          This table demonstrates the logical rule used to check
          whether the conditions for spraying are satisfied.
        </p>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-4 rounded border border-rule bg-paper-alt/60 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Logical Expression
          </p>

          <p className="mt-1 font-mono text-base font-semibold text-ink sm:text-lg">
            Spray = D AND NOT R
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-ink-muted">
          <p>D = Disease Detected</p>
          <p>R = Rain Expected</p>
        </div>
      </div>

      {/* Interactive scenario inputs */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded border border-rule bg-paper p-4 transition-colors duration-150 hover:border-rule-strong">
          <span className="text-sm font-medium text-ink">
            Disease Detected (D)
          </span>

          <span className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={diseaseDetected}
              onChange={(event) =>
                setDiseaseDetected(event.target.checked)
              }
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full border border-rule-strong bg-paper-alt transition-colors duration-200 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card transition-transform duration-200 peer-checked:translate-x-5" />
          </span>
        </label>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded border border-rule bg-paper p-4 transition-colors duration-150 hover:border-rule-strong">
          <span className="text-sm font-medium text-ink">
            Rain Expected (R)
          </span>

          <span className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={rainExpected}
              onChange={(event) =>
                setRainExpected(event.target.checked)
              }
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full border border-rule-strong bg-paper-alt transition-colors duration-200 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card transition-transform duration-200 peer-checked:translate-x-5" />
          </span>
        </label>

      </div>

      <p className="mt-2.5 text-xs text-ink-faint">
        Change either checkbox to explore the truth table.
        These are example conditions, not live weather data.
      </p>

      {/* Truth table */}
      <div className="mt-6 overflow-x-auto rounded border border-rule">

        <table className="w-full min-w-[440px] border-collapse text-left text-sm">

          <thead className="border-b border-rule bg-paper-alt">
            <tr>
              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                Disease (D)
              </th>

              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                Rain (R)
              </th>

              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                D AND NOT R
              </th>

              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
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
                  ? 'bg-healthy-soft text-ink font-medium'
                  : 'bg-disease-soft text-ink font-medium'
                : 'bg-card text-ink-muted'

              return (
                <tr
                  key={index}
                  className={`border-t border-rule transition-colors duration-150 ${rowColor}`}
                >
                  <td className="px-4 py-3.5 font-mono text-xs">
                    {row.disease ? 'True' : 'False'}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-xs">
                    {row.rain ? 'True' : 'False'}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-xs font-semibold">
                    {allowed ? 'True' : 'False'}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-xs">
                    {active ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-semibold ${
                          allowed
                            ? 'border-healthy/40 bg-card text-healthy'
                            : 'border-disease/40 bg-card text-disease'
                        }`}
                      >
                        Current Row
                      </span>
                    ) : (
                      <span className="text-ink-faint">
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
        className={`mt-5 rounded border-l-4 border border-rule p-4 ${
          canSpray
            ? 'border-l-healthy bg-healthy-soft/70 text-ink'
            : 'border-l-disease bg-disease-soft/70 text-ink'
        }`}
      >
        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
          Current Logical Result
        </p>

        <p className="mt-1.5 font-mono text-base font-semibold sm:text-lg">
          {canSpray
            ? 'TRUE - Rule conditions satisfied'
            : 'FALSE - Rule conditions not satisfied'}
        </p>

        <p className="mt-1.5 text-sm text-ink-muted">
          {canSpray
            ? 'Disease is detected and rain is not expected.'
            : 'The conditions required by the example spraying rule are not both satisfied.'}
        </p>
      </div>

      {/* Backend verification */}
      <div className="mt-4 rounded border border-caution/30 bg-caution-soft/70 p-4">

        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-caution">
          Backend Logic Verification
        </p>

        <p className="mt-1.5 text-sm text-ink">
          {verificationStatus ||
            'No verification result available.'}
        </p>

      </div>

      {/* Optional rule flags returned by backend */}
      {Array.isArray(flags) && flags.length > 0 && (
        <div className="mt-5">

          <h3 className="font-serif text-base font-semibold text-ink">
            Backend Rule Checks
          </h3>

          <div className="mt-3 divide-y divide-rule rounded border border-rule bg-paper">

            {flags.map((flag, index) => {
              const statusText = String(flag.status || '')
              const allowed =
                statusText.toLowerCase().includes('allowed')

              return (
                <div
                  key={index}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                >
                  <span className="text-sm text-ink">
                    {flag.rule}
                  </span>

                  <span
                    className={`rounded border px-2.5 py-0.5 font-mono text-xs font-medium ${
                      allowed
                        ? 'border-healthy/30 bg-healthy-soft text-healthy'
                        : 'border-disease/30 bg-disease-soft text-disease'
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

      <p className="mt-5 text-xs leading-relaxed text-ink-faint">
        This interactive truth table demonstrates a simplified
        logical condition. It does not determine whether pesticide
        application is safe or appropriate in a real field.
      </p>

    </section>
  )
}

export default TruthTableCard

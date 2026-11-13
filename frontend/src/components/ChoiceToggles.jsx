
export const farmingActions = [
  {
    key: 'irrigation',
    label: 'Irrigation',
    description: 'Watering the crops',
  },
  {
    key: 'fertilizer',
    label: 'Apply Fertilizer',
    description: 'Adding nutrients to the soil',
  },
  {
    key: 'fungicide',
    label: 'Apply Fungicide',
    description: 'Controlling fungal infections',
  },
]

function ChoiceToggles({ selectedActions, onToggle }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-emerald-800">
        Planned Farming Actions
      </h2>

      <p className="mb-5 text-sm text-slate-500">
        Select the actions the farmer is planning to perform.
      </p>

      <div className="space-y-3">
        {farmingActions.map((action) => (
          <label
            key={action.key}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 p-4 hover:bg-emerald-50"
          >
            <input
              type="checkbox"
              checked={selectedActions.includes(action.key)}
              onChange={() => onToggle(action.key)}
              className="h-5 w-5 accent-emerald-600"
            />

            <div>
              <p className="font-medium">{action.label}</p>
              <p className="text-sm text-slate-500">
                {action.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </section>
  )
}

export default ChoiceToggles

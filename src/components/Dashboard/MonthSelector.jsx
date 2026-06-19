import { formatMonthLabel, shiftMonthKey } from '../../lib/dateUtils'

export default function MonthSelector({ monthKey, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(shiftMonthKey(monthKey, -1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        aria-label="Mois précédent"
      >
        ‹
      </button>
      <span className="min-w-[10rem] text-center text-lg font-semibold text-gray-900">
        {formatMonthLabel(monthKey)}
      </span>
      <button
        type="button"
        onClick={() => onChange(shiftMonthKey(monthKey, 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        aria-label="Mois suivant"
      >
        ›
      </button>
    </div>
  )
}

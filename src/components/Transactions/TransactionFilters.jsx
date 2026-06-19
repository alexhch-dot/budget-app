import { AMOUNT_RANGES } from '../../lib/constants'

const AMOUNT_RANGE_OPTIONS = [AMOUNT_RANGES.SMALL, AMOUNT_RANGES.LARGE, AMOUNT_RANGES.INCOME]

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function TransactionFilters({
  categories,
  filters,
  onChange,
  availableMonths,
  availableQuarters,
}) {
  const update = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap gap-6">
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
            Catégorie
          </p>
          <div className="flex max-w-md flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => update({ categories: toggleValue(filters.categories, category) })}
                className={[
                  'rounded-full border px-2.5 py-1 text-xs font-medium',
                  filters.categories.includes(category)
                    ? 'border-accent bg-accent-light text-accent'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50',
                ].join(' ')}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
            Montant
          </p>
          <div className="flex flex-wrap gap-1.5">
            {AMOUNT_RANGE_OPTIONS.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => update({ amountRanges: toggleValue(filters.amountRanges, range) })}
                className={[
                  'rounded-full border px-2.5 py-1 text-xs font-medium',
                  filters.amountRanges.includes(range)
                    ? 'border-accent bg-accent-light text-accent'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50',
                ].join(' ')}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
          Période
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.periodType}
            onChange={(e) => update({ periodType: e.target.value })}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
          >
            <option value="month">Mois</option>
            <option value="quarter">Trimestre</option>
            <option value="custom">Plage personnalisée</option>
          </select>

          {filters.periodType === 'month' && (
            <select
              value={filters.month}
              onChange={(e) => update({ month: e.target.value })}
              className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}

          {filters.periodType === 'quarter' && (
            <select
              value={filters.quarter}
              onChange={(e) => update({ quarter: e.target.value })}
              className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            >
              {availableQuarters.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          )}

          {filters.periodType === 'custom' && (
            <>
              <input
                type="date"
                value={filters.start}
                onChange={(e) => update({ start: e.target.value })}
                className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
              <span className="text-sm text-gray-400">→</span>
              <input
                type="date"
                value={filters.end}
                onChange={(e) => update({ end: e.target.value })}
                className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

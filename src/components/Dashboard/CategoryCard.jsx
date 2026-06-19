function formatEUR(amount) {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export default function CategoryCard({ category, spent, budget, onClick }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : spent > 0 ? 100 : 0
  const ratio = budget > 0 ? spent / budget : spent > 0 ? Infinity : 0
  const barColor = ratio >= 1 ? 'bg-negative' : ratio >= 0.75 ? 'bg-orange-400' : 'bg-positive'

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      <span className="text-sm font-medium text-gray-700">{category}</span>
      <span className="text-lg font-semibold text-gray-900">
        {formatEUR(spent)}
        <span className="ml-1 text-sm font-normal text-gray-400">
          / {budget > 0 ? formatEUR(budget) : 'pas de budget'}
        </span>
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </button>
  )
}

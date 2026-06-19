function formatEUR(amount) {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export default function SummaryCard({ totalSpent, totalBudget }) {
  const pct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0
  const barColor = pct >= 100 ? 'bg-negative' : pct >= 75 ? 'bg-orange-400' : 'bg-positive'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">Total dépensé ce mois</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-gray-900">{formatEUR(totalSpent)}</span>
        <span className="text-sm text-gray-400">/ {formatEUR(totalBudget)} budget</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function BudgetSettings({ categories, budgets, onSetBudget }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">Budgets par catégorie</h2>
      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-700">{category}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                step="1"
                value={budgets[category] ?? ''}
                onChange={(e) => onSetBudget(category, e.target.value)}
                placeholder="0"
                className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-right text-sm"
              />
              <span className="text-sm text-gray-400">€ / mois</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

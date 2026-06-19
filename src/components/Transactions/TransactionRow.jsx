function formatEUR(amount) {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export default function TransactionRow({
  transaction,
  categories,
  onCategoryChange,
  pendingRuleCategory,
  onConfirmRule,
  onDismissRule,
}) {
  const handleCategorySelect = (e) => {
    onCategoryChange(transaction.id, e.target.value)
  }

  return (
    <div className="flex flex-col gap-1.5 border-b border-gray-100 px-2 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="w-24 shrink-0 text-sm text-gray-500">{transaction.date}</span>
        <span className="flex-1 truncate text-sm text-gray-800">{transaction.label}</span>
        <select
          value={transaction.category}
          onChange={handleCategorySelect}
          className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <span
          className={`w-24 shrink-0 text-right text-sm font-medium ${
            transaction.amount < 0 ? 'text-negative' : 'text-positive'
          }`}
        >
          {formatEUR(transaction.amount)}
        </span>
      </div>

      {pendingRuleCategory && (
        <div className="ml-[6.5rem] flex items-center gap-2 text-xs text-gray-500">
          <span>
            Créer une règle automatique : « {transaction.label} » → {pendingRuleCategory} ?
          </span>
          <button type="button" onClick={onConfirmRule} className="font-medium text-accent hover:underline">
            Oui
          </button>
          <button type="button" onClick={onDismissRule} className="hover:underline">
            Non
          </button>
        </div>
      )}
    </div>
  )
}

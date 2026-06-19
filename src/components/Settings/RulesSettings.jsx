import { useState } from 'react'

function describeRule(rule) {
  if (rule.type === 'amount') return `Montant exact : ${rule.amount.toFixed(2)} €`
  return `Mot-clé : « ${rule.keyword} »`
}

export default function RulesSettings({ rules, categories, onAdd, onUpdate, onDelete, onReapply }) {
  const [newKeyword, setNewKeyword] = useState('')
  const [newCategory, setNewCategory] = useState(categories[0] || '')

  const handleAdd = () => {
    if (!newKeyword.trim()) return
    onAdd({ type: 'keyword', keyword: newKeyword.trim(), category: newCategory })
    setNewKeyword('')
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Règles de catégorisation</h2>
        <button
          type="button"
          onClick={onReapply}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Réappliquer sur les transactions existantes
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Nouveau mot-clé"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
        >
          Ajouter
        </button>
      </div>

      <div className="flex max-h-96 flex-col divide-y divide-gray-100 overflow-y-auto">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between gap-3 py-2">
            <span className="flex-1 truncate text-sm text-gray-600">{describeRule(rule)}</span>
            <select
              value={rule.category}
              onChange={(e) => onUpdate(rule.id, { category: e.target.value })}
              className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onDelete(rule.id)}
              className="text-xs text-negative hover:underline"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

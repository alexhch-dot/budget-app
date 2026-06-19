import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useBudget } from '../context/BudgetContext'
import { getCurrentMonthKey, getQuarterOfMonthKey } from '../lib/dateUtils'
import TransactionFilters from '../components/Transactions/TransactionFilters'
import TransactionRow from '../components/Transactions/TransactionRow'

function formatEUR(amount) {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export default function TransactionsPage() {
  const { transactions, categories, updateTransactionCategory, addRule } = useBudget()
  const [searchParams] = useSearchParams()

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((tx) => tx.month))
    months.add(getCurrentMonthKey())
    return Array.from(months).sort((a, b) => {
      const [ma, ya] = a.split('/').map(Number)
      const [mb, yb] = b.split('/').map(Number)
      return yb - ya || mb - ma
    })
  }, [transactions])

  const availableQuarters = useMemo(() => {
    const quarters = new Set(transactions.map((tx) => getQuarterOfMonthKey(tx.month)))
    quarters.add(getQuarterOfMonthKey(getCurrentMonthKey()))
    return Array.from(quarters).sort().reverse()
  }, [transactions])

  const initialMonth = searchParams.get('month') || getCurrentMonthKey()
  const initialCategory = searchParams.get('category')

  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    amountRanges: [],
    periodType: 'month',
    month: initialMonth,
    quarter: getQuarterOfMonthKey(initialMonth),
    start: '',
    end: '',
  })

  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [pendingRules, setPendingRules] = useState({})

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.categories.length > 0 && !filters.categories.includes(tx.category)) return false
      if (filters.amountRanges.length > 0 && !filters.amountRanges.includes(tx.amountRange))
        return false

      if (filters.periodType === 'month' && tx.month !== filters.month) return false
      if (filters.periodType === 'quarter' && getQuarterOfMonthKey(tx.month) !== filters.quarter)
        return false
      if (filters.periodType === 'custom') {
        if (filters.start && tx.date < filters.start) return false
        if (filters.end && tx.date > filters.end) return false
      }
      return true
    })
  }, [transactions, filters])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'date') cmp = a.date.localeCompare(b.date)
      else if (sortBy === 'amount') cmp = a.amount - b.amount
      else if (sortBy === 'category') cmp = a.category.localeCompare(b.category)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [filtered, sortBy, sortDir])

  const total = useMemo(() => sorted.reduce((sum, tx) => sum + tx.amount, 0), [sorted])

  // Transactions with an unconfirmed "create rule?" prompt stay visible even
  // if a category change makes them no longer match the active filters —
  // otherwise the row (and the confirmation) disappears before the user can
  // respond to it.
  const displayed = useMemo(() => {
    const pendingIds = Object.keys(pendingRules)
    if (pendingIds.length === 0) return sorted
    const shownIds = new Set(sorted.map((tx) => tx.id))
    const extra = transactions.filter((tx) => pendingRules[tx.id] && !shownIds.has(tx.id))
    return [...sorted, ...extra]
  }, [sorted, pendingRules, transactions])

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  const handleCategoryChange = (id, newCategory) => {
    const tx = transactions.find((t) => t.id === id)
    updateTransactionCategory(id, newCategory)
    if (tx && newCategory !== tx.category) {
      setPendingRules((prev) => ({ ...prev, [id]: newCategory }))
    }
  }

  const confirmRule = (tx) => {
    addRule({ type: 'keyword', keyword: tx.label, category: pendingRules[tx.id] })
    setPendingRules((prev) => {
      const next = { ...prev }
      delete next[tx.id]
      return next
    })
  }

  const dismissRule = (id) => {
    setPendingRules((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const sortLabel = (field, label) => (
    <button
      type="button"
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 ${sortBy === field ? 'text-accent' : 'text-gray-400'}`}
    >
      {label}
      {sortBy === field && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </button>
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>

      <TransactionFilters
        categories={categories}
        filters={filters}
        onChange={setFilters}
        availableMonths={availableMonths}
        availableQuarters={availableQuarters}
      />

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {sorted.length} transaction{sorted.length > 1 ? 's' : ''} · {formatEUR(total)}
        </span>
        <div className="flex gap-4 text-xs">
          {sortLabel('date', 'Date')}
          {sortLabel('amount', 'Montant')}
          {sortLabel('category', 'Catégorie')}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-2">
        {displayed.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-gray-400">
            Aucune transaction ne correspond aux filtres.
          </p>
        ) : (
          displayed.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              pendingRuleCategory={pendingRules[tx.id]}
              onConfirmRule={() => confirmRule(tx)}
              onDismissRule={() => dismissRule(tx.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

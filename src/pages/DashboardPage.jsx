import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBudget } from '../context/BudgetContext'
import { getCurrentMonthKey } from '../lib/dateUtils'
import MonthSelector from '../components/Dashboard/MonthSelector'
import SummaryCard from '../components/Dashboard/SummaryCard'
import CategoryDonutChart from '../components/Dashboard/CategoryDonutChart'
import CategoryCard from '../components/Dashboard/CategoryCard'
import CsvImportButton from '../components/Import/CsvImportButton'

export default function DashboardPage() {
  const { transactions, budgets, loadDemoData } = useBudget()
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey())
  const navigate = useNavigate()

  const monthTransactions = useMemo(
    () => transactions.filter((tx) => tx.month === monthKey),
    [transactions, monthKey]
  )

  const spentByCategory = useMemo(() => {
    const totals = {}
    for (const tx of monthTransactions) {
      if (tx.amount >= 0) continue
      totals[tx.category] = (totals[tx.category] || 0) + Math.abs(tx.amount)
    }
    return totals
  }, [monthTransactions])

  const totalSpent = useMemo(
    () => Object.values(spentByCategory).reduce((sum, v) => sum + v, 0),
    [spentByCategory]
  )

  const totalBudget = useMemo(
    () => Object.values(budgets).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [budgets]
  )

  const donutData = useMemo(
    () =>
      Object.entries(spentByCategory)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    [spentByCategory]
  )

  const cardCategories = useMemo(() => {
    const names = new Set([...Object.keys(spentByCategory), ...Object.keys(budgets)])
    return Array.from(names).sort((a, b) => (spentByCategory[b] || 0) - (spentByCategory[a] || 0))
  }, [spentByCategory, budgets])

  const goToCategory = (category) => {
    navigate(`/transactions?month=${encodeURIComponent(monthKey)}&category=${encodeURIComponent(category)}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <MonthSelector monthKey={monthKey} onChange={setMonthKey} />
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Aucune transaction pour le moment. Importez un relevé CSV ou chargez des données de
            démonstration.
          </p>
          <button
            type="button"
            onClick={loadDemoData}
            className="rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent-light"
          >
            Charger des données de démo
          </button>
        </div>
      ) : null}

      <CsvImportButton />

      <SummaryCard totalSpent={totalSpent} totalBudget={totalBudget} />

      <CategoryDonutChart data={donutData} />

      {cardCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cardCategories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              spent={spentByCategory[category] || 0}
              budget={Number(budgets[category]) || 0}
              onClick={() => goToCategory(category)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

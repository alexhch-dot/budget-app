import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { storage } from '../lib/storage'
import { reapplyRules } from '../lib/categorization'
import { mergeImported } from '../lib/transactions'
import { DEMO_RAW_TRANSACTIONS } from '../lib/demoData'

const BudgetContext = createContext(null)

export function BudgetProvider({ children }) {
  const [transactions, setTransactions] = useState(storage.loadTransactions)
  const [categories, setCategories] = useState(storage.loadCategories)
  const [rules, setRules] = useState(storage.loadRules)
  const [budgets, setBudgets] = useState(storage.loadBudgets)
  const [profile, setProfileState] = useState(storage.loadProfile)

  useEffect(() => storage.saveTransactions(transactions), [transactions])
  useEffect(() => storage.saveCategories(categories), [categories])
  useEffect(() => storage.saveRules(rules), [rules])
  useEffect(() => storage.saveBudgets(budgets), [budgets])
  useEffect(() => storage.saveProfile(profile), [profile])

  const importTransactions = (rawTransactions) => {
    const result = mergeImported(transactions, rawTransactions, rules)
    setTransactions(result.transactions)
    return { importedCount: result.importedCount, duplicateCount: result.duplicateCount }
  }

  const loadDemoData = () => importTransactions(DEMO_RAW_TRANSACTIONS)

  const updateTransactionCategory = (id, category) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, category } : tx)))
  }

  const addRule = (rule) => {
    setRules((prev) => [...prev, { id: uuidv4(), ...rule }])
  }

  const updateRule = (id, patch) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)))
  }

  const deleteRule = (id) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id))
  }

  const reapplyAllRules = () => {
    setTransactions((prev) => reapplyRules(prev, rules))
  }

  const setBudget = (category, amount) => {
    setBudgets((prev) => ({ ...prev, [category]: amount }))
  }

  const setProfile = (patch) => {
    setProfileState((prev) => ({ ...prev, ...patch }))
  }

  const value = useMemo(
    () => ({
      transactions,
      categories,
      rules,
      budgets,
      profile,
      importTransactions,
      loadDemoData,
      updateTransactionCategory,
      addRule,
      updateRule,
      deleteRule,
      reapplyAllRules,
      setBudget,
      setProfile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, categories, rules, budgets, profile]
  )

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

export function useBudget() {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within a BudgetProvider')
  return ctx
}

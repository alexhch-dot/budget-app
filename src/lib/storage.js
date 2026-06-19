import { DEFAULT_CATEGORIES, DEFAULT_RULES, DEFAULT_PROFILE } from './constants'

const KEYS = {
  transactions: 'budgetapp_transactions',
  categories: 'budgetapp_categories',
  rules: 'budgetapp_rules',
  budgets: 'budgetapp_budgets',
  profile: 'budgetapp_profile',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  loadTransactions: () => load(KEYS.transactions, []),
  saveTransactions: (transactions) => save(KEYS.transactions, transactions),

  loadCategories: () => load(KEYS.categories, DEFAULT_CATEGORIES),
  saveCategories: (categories) => save(KEYS.categories, categories),

  loadRules: () => load(KEYS.rules, DEFAULT_RULES),
  saveRules: (rules) => save(KEYS.rules, rules),

  loadBudgets: () => load(KEYS.budgets, {}),
  saveBudgets: (budgets) => save(KEYS.budgets, budgets),

  loadProfile: () => load(KEYS.profile, DEFAULT_PROFILE),
  saveProfile: (profile) => save(KEYS.profile, profile),
}

import { AMOUNT_RANGES, UNCATEGORIZED } from './constants'

export function categorizeTransaction(transaction, rules) {
  for (const rule of rules) {
    if (rule.type === 'amount') {
      if (Math.abs(transaction.amount - rule.amount) < 0.01) {
        return rule.category
      }
    } else if (rule.type === 'keyword') {
      if (transaction.label.toLowerCase().includes(rule.keyword.toLowerCase())) {
        return rule.category
      }
    }
  }
  return UNCATEGORIZED
}

export function computeAmountRange(amount) {
  if (amount > 0) return AMOUNT_RANGES.INCOME
  if (amount < -40) return AMOUNT_RANGES.LARGE
  return AMOUNT_RANGES.SMALL
}

export function computeMonth(isoDate) {
  const [year, month] = isoDate.split('-')
  return `${month}/${year}`
}

export function reapplyRules(transactions, rules) {
  return transactions.map((tx) => ({
    ...tx,
    category: categorizeTransaction(tx, rules),
  }))
}

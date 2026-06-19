import { v4 as uuidv4 } from 'uuid'
import { categorizeTransaction, computeAmountRange, computeMonth } from './categorization'

export function buildTransaction(raw, rules) {
  const base = {
    id: uuidv4(),
    date: raw.date,
    label: raw.label,
    amount: raw.amount,
    event_id: null,
  }
  return {
    ...base,
    category: categorizeTransaction(base, rules),
    amountRange: computeAmountRange(base.amount),
    month: computeMonth(base.date),
  }
}

function dedupeKey(tx) {
  return `${tx.date}|${tx.label.trim().toLowerCase()}|${tx.amount.toFixed(2)}`
}

export function mergeImported(existingTransactions, rawIncoming, rules) {
  const existingKeys = new Set(existingTransactions.map(dedupeKey))
  const newTransactions = []
  let duplicateCount = 0

  for (const raw of rawIncoming) {
    const key = dedupeKey(raw)
    if (existingKeys.has(key)) {
      duplicateCount++
      continue
    }
    existingKeys.add(key)
    newTransactions.push(buildTransaction(raw, rules))
  }

  return {
    transactions: [...existingTransactions, ...newTransactions],
    importedCount: newTransactions.length,
    duplicateCount,
  }
}

const MONTH_LABELS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

export function getCurrentMonthKey() {
  const now = new Date()
  return `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
}

export function shiftMonthKey(monthKey, delta) {
  const [month, year] = monthKey.split('/').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

export function formatMonthLabel(monthKey) {
  const [month, year] = monthKey.split('/').map(Number)
  return `${MONTH_LABELS[month - 1]} ${year}`
}

export function getQuarterOfMonthKey(monthKey) {
  const [month, year] = monthKey.split('/').map(Number)
  return `T${Math.ceil(month / 3)} ${year}`
}

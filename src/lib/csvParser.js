// Société Générale CSV export. Real-world exports vary:
// - separator can be ";" or a tab character
// - the header row isn't always line 1 — exports often start with an
//   account number / balance line, then a blank line, then the header
// - amounts are either split across Débit/Crédit columns or combined in a
//   single signed "Montant" column, always French format (comma decimal,
//   optional space thousands separator)
// Encoding can be UTF-8 or Latin-1, with an optional UTF-8 BOM.

const SPACE_CHARS_RE = /[\s  ]/g

function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function normalizeText(str) {
  return stripAccents(str.trim().toLowerCase())
}

function detectSeparator(line) {
  const tabCount = (line.match(/\t/g) || []).length
  const semicolonCount = (line.match(/;/g) || []).length
  return tabCount > semicolonCount ? '\t' : ';'
}

function parseCsvLine(line, separator) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === separator && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  return fields
}

function parseFrenchAmount(raw) {
  if (!raw) return null
  const cleaned = raw
    .replace(SPACE_CHARS_RE, '')
    .replace(/€/g, '')
    .replace(',', '.')
  if (cleaned === '') return null
  const value = parseFloat(cleaned)
  return Number.isNaN(value) ? null : value
}

function parseFrenchDate(raw) {
  const match = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, day, month, year] = match
  return `${year}-${month}-${day}`
}

// Scans for the first line that looks like the real header — "Date" plus
// one of Libellé/Montant/Débit — instead of assuming line 1. Everything
// above it (account number, balance, blank lines) is ignored.
function findHeaderLineIndex(lines) {
  return lines.findIndex((line) => {
    const normalized = normalizeText(line)
    return (
      normalized.includes('date') &&
      (normalized.includes('libelle') || normalized.includes('montant') || normalized.includes('debit'))
    )
  })
}

// Reads the file trying UTF-8 first, then falls back to Latin-1 if the
// decoded text contains replacement characters (a sign UTF-8 decoding of a
// Latin-1 file silently broke accented characters).
export function decodeFileToText(file) {
  return file.arrayBuffer().then((buffer) => {
    const utf8Text = new TextDecoder('utf-8').decode(buffer)
    if (!utf8Text.includes('�')) {
      return utf8Text.replace(/^﻿/, '')
    }
    return new TextDecoder('iso-8859-1').decode(buffer)
  })
}

export function parseSGCsv(text) {
  const lines = text.split(/\r\n|\n|\r/).filter((line) => line.trim() !== '')
  if (lines.length === 0) return []

  const headerLineIndex = findHeaderLineIndex(lines)
  if (headerLineIndex === -1) {
    throw new Error("Format CSV non reconnu : ligne d'en-tête (Date / Libellé / Montant) introuvable.")
  }

  const separator = detectSeparator(lines[headerLineIndex])
  const header = parseCsvLine(lines[headerLineIndex], separator).map(normalizeText)

  const dateIdx = header.findIndex((h) => h.startsWith('date'))
  const labelIdx = header.findIndex((h) => h.startsWith('libelle'))
  const debitIdx = header.findIndex((h) => h.startsWith('debit'))
  const creditIdx = header.findIndex((h) => h.startsWith('credit'))
  const amountIdx = header.findIndex((h) => h.includes('montant'))

  if (dateIdx === -1 || labelIdx === -1) {
    throw new Error("Format CSV non reconnu : colonnes Date / Libellé introuvables.")
  }
  if (amountIdx === -1 && debitIdx === -1 && creditIdx === -1) {
    throw new Error("Format CSV non reconnu : aucune colonne de montant trouvée.")
  }

  const transactions = []
  for (let i = headerLineIndex + 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i], separator)
    if (fields.length <= Math.max(dateIdx, labelIdx)) continue

    const date = parseFrenchDate(fields[dateIdx])
    const label = fields[labelIdx]
    if (!date || !label) continue

    let amount = null
    if (amountIdx !== -1) {
      amount = parseFrenchAmount(fields[amountIdx])
    } else {
      const debit = debitIdx !== -1 ? parseFrenchAmount(fields[debitIdx]) : null
      const credit = creditIdx !== -1 ? parseFrenchAmount(fields[creditIdx]) : null
      if (debit !== null) amount = -Math.abs(debit)
      else if (credit !== null) amount = Math.abs(credit)
    }
    if (amount === null) continue

    transactions.push({ date, label, amount })
  }
  return transactions
}

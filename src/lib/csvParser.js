// Société Générale CSV export: ";"-separated, French number format
// (comma decimal, space thousands separator), columns Date / Libellé /
// Débit / Crédit / Solde. Encoding can be UTF-8 or Latin-1 depending on
// how the export was generated, with an optional UTF-8 BOM.

const SPACE_CHARS_RE = /[\s  ]/g

function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function normalizeHeader(header) {
  return stripAccents(header.trim().toLowerCase())
}

function parseCsvLine(line) {
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
    } else if (char === ';' && !inQuotes) {
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

  const header = parseCsvLine(lines[0]).map(normalizeHeader)
  const dateIdx = header.findIndex((h) => h.startsWith('date'))
  const labelIdx = header.findIndex((h) => h.startsWith('libelle'))
  const debitIdx = header.findIndex((h) => h.startsWith('debit'))
  const creditIdx = header.findIndex((h) => h.startsWith('credit'))

  if (dateIdx === -1 || labelIdx === -1) {
    throw new Error("Format CSV non reconnu : colonnes Date / Libellé introuvables.")
  }

  const transactions = []
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i])
    if (fields.length <= Math.max(dateIdx, labelIdx)) continue

    const date = parseFrenchDate(fields[dateIdx])
    const label = fields[labelIdx]
    if (!date || !label) continue

    const debit = debitIdx !== -1 ? parseFrenchAmount(fields[debitIdx]) : null
    const credit = creditIdx !== -1 ? parseFrenchAmount(fields[creditIdx]) : null

    let amount = null
    if (debit !== null) amount = -Math.abs(debit)
    else if (credit !== null) amount = Math.abs(credit)
    if (amount === null) continue

    transactions.push({ date, label, amount })
  }
  return transactions
}

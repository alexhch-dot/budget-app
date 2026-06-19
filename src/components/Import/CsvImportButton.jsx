import { useRef, useState } from 'react'
import { useBudget } from '../../context/BudgetContext'
import { decodeFileToText, parseSGCsv } from '../../lib/csvParser'

export default function CsvImportButton() {
  const { importTransactions } = useBudget()
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleFile = async (file) => {
    if (!file) return
    try {
      const text = await decodeFileToText(file)
      const raw = parseSGCsv(text)
      const { importedCount, duplicateCount } = importTransactions(raw)
      setFeedback({
        type: 'success',
        message: `${importedCount} nouvelle${importedCount > 1 ? 's' : ''} transaction${importedCount > 1 ? 's' : ''} importée${importedCount > 1 ? 's' : ''}, ${duplicateCount} doublon${duplicateCount > 1 ? 's' : ''} ignoré${duplicateCount > 1 ? 's' : ''}.`,
      })
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || "Erreur lors de l'import du fichier." })
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={[
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
          isDragging ? 'border-accent bg-accent-light' : 'border-gray-200 bg-white',
        ].join(' ')}
      >
        <p className="text-sm text-gray-600">
          Glissez-déposez votre relevé CSV Société Générale ici
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Importer un CSV
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {feedback && (
        <p className={`mt-2 text-sm ${feedback.type === 'error' ? 'text-negative' : 'text-gray-600'}`}>
          {feedback.message}
        </p>
      )}
    </div>
  )
}

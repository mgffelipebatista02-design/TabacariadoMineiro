'use client'

import { useRef, useState } from 'react'
import { Upload, AlertCircle, FileCheck } from 'lucide-react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface CsvImportRow {
  sku: string
  quantidade: number
}

interface CsvImportProps {
  onImport: (data: CsvImportRow[]) => void
}

export function CsvImport({ onImport }: CsvImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState<number | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setImportedCount(null)

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0) {
          setError('Erro ao ler o arquivo CSV. Verifique o formato.')
          return
        }

        const rows: CsvImportRow[] = []

        for (const row of results.data) {
          const sku = row.sku || row.codigo || row.SKU || row.Codigo || ''
          const qtyRaw = row.quantidade || row.qty || row.Quantidade || row.QTY || ''
          const quantidade = parseInt(qtyRaw, 10)

          if (!sku.trim()) continue

          if (isNaN(quantidade) || quantidade <= 0) {
            setError(
              `Quantidade invalida para o SKU "${sku}". Todas as linhas devem ter quantidade > 0.`
            )
            return
          }

          rows.push({ sku: sku.trim(), quantidade })
        }

        if (rows.length === 0) {
          setError(
            'Nenhum item valido encontrado. O CSV deve conter colunas "sku" (ou "codigo") e "quantidade".'
          )
          return
        }

        setImportedCount(rows.length)
        onImport(rows)
      },
      error() {
        setError('Erro ao processar o arquivo CSV.')
      },
    })

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="secondary"
        size="md"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Importar CSV
      </Button>

      {error && (
        <div className="flex items-start gap-2 text-sm text-status-error">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {importedCount !== null && !error && (
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-status-success" />
          <span className="text-sm text-text-secondary">
            <Badge variant="green">{importedCount}</Badge> itens importados
          </span>
        </div>
      )}
    </div>
  )
}

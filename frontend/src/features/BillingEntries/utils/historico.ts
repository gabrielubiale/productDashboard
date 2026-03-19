export type HistoricoParsedItem = { label: string; value: string }

export function splitHistoricoLines(raw?: string | null): string[] {
  if (!raw) return []
  return raw.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)
}

export function parseHistoricoKeyValue(raw?: string | null): HistoricoParsedItem[] {
  const lines = splitHistoricoLines(raw)

  return lines.map((line) => {
    const [labelPart, ...rest] = line.split(':')

    if (rest.length === 0) {
      return { label: '', value: line }
    }

    return {
      label: `${labelPart.trim()}:`,
      value: rest.join(':').trim(),
    }
  })
}


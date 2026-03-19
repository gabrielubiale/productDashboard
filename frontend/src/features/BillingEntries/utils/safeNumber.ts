export function safeNumber(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v

  const x = Number(v)
  return Number.isFinite(x) ? x : 0
}


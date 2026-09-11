/**
 * Parsers for the free-text scientific figures editors type into the CMS ("45–165 µm", "~90 µm",
 * "up to 1000 cm/h", "≈100 mg lysozyme/mL"). Pure, unit-tested; used by the range plot, the product
 * cards and the catalogue sort.
 */

const NUM = /(\d+(?:[.,]\d+)?)/
const RANGE = /(\d+(?:[.,]\d+)?)\s*(?:–|-|—|to)\s*(\d+(?:[.,]\d+)?)/

const toNumber = (s: string) => Number(s.replace(',', '.'))

/** "45–165 µm" → [45, 165]; null when the text holds no range. */
export function parseRange(s?: string | null): [number, number] | null {
  const m = s?.match(RANGE)
  return m ? [toNumber(m[1]), toNumber(m[2])] : null
}

/** First number in the text ("~90 µm" → 90). */
export function parseNumber(s?: string | null): number | null {
  const m = s?.match(NUM)
  return m ? toNumber(m[1]) : null
}

/** Largest number in the text ("800–1000 cm/h" → 1000, "~700 cm/h @ 0.1 MPa" → 700 when `firstOnly`). */
export function parseMax(s?: string | null): number | null {
  const range = parseRange(s)
  if (range) return Math.max(range[0], range[1])
  return parseNumber(s)
}

/** "up to 1000 cm/h" → { value: "1000", prefix: "up to", unit: "cm/h" }; "≈100 mg/mL" → { prefix: "≈", value: "100", unit: "mg/mL" }. */
export function parseFigure(s?: string | null): { value: string; prefix: string; unit: string } | null {
  if (!s) return null
  // A range ("800–1000 cm/h") is one figure, not "800" with the unit "–1000 cm/h".
  const m = s.match(RANGE) ?? s.match(NUM)
  if (!m || m.index == null) return null
  const value = m[0]
  const prefix = s.slice(0, m.index).replace(/[–-]\s*$/, '').trim()
  const unit = s.slice(m.index + value.length).trim()
  return { value, prefix, unit }
}

/** True for "≈", "~", "≥"…: marks that belong in front of the number rather than in the unit line. */
export const isSymbolPrefix = (prefix: string) => /^[≈~≥≤<>±]+$/.test(prefix)

/**
 * Split a figure into the number that is read first and the qualifier that follows it, for the
 * "value in mono, unit in sans" treatment: "≈100 mg lysozyme/mL" → ["≈100", "mg lysozyme/mL"],
 * "800–1000 cm/h" → ["800–1000", "cm/h"], "up to 700 cm/h (6%)" → ["up to 700", "cm/h (6%)"].
 * Text without a number comes back whole.
 */
export function splitFigure(s?: string | null): [string, string] {
  if (!s) return ['', '']
  const range = s.match(RANGE)
  const m = range ?? s.match(NUM)
  if (!m || m.index == null) return [s.trim(), '']
  const end = m.index + m[0].length
  const before = s.slice(0, m.index)
  const symbolPrefix = /^[\s≈~≥≤<>±]*$/.test(before)
  const head = symbolPrefix ? (before.trim() + m[0]).trim() : `${before.trim()} ${m[0]}`.trim()
  return [head, s.slice(end).trim().replace(/^[·,;:]\s*/, '')]
}

/** "~90 µm" → "90"; keeps the approximation mark out so several d50 values can share one unit. */
export function stripUnit(s?: string | null): string {
  const m = s?.match(RANGE) ?? s?.match(NUM)
  return m ? m[0] : (s ?? '').trim()
}

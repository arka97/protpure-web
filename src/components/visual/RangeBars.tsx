import * as React from 'react'
import { isSymbolPrefix, parseFigure, parseNumber, parseRange } from '@/lib/figures'
import { cn } from '@/lib/utils'

export { parseFigure, parseNumber, parseRange }

/**
 * The four-grade particle platform as a quantitative range plot (HTML/CSS, labels stay text).
 * Every row shares one 0–250 µm axis: the bar encodes the supplied particle-size range, the filled
 * marker the d50V, the circle beside the name is a qualitative grade mark, and the figure on the right
 * is the platform's maximum linear flow. Drawn for the dark field.
 *
 * Takes the `grades` array of the `gradesPlatform` block as stored in the CMS — values are strings
 * such as "100–240 µm", "~163 µm", "up to 1000 cm/h" and are parsed here. Rows whose range cannot be
 * parsed still render, with the plot left empty.
 */
export type RangeGrade = {
  id?: string | null
  name: string
  /** Application label, e.g. "Industrial capture". */
  badge?: string | null
  d50?: string | null
  sizeRange?: string | null
  maxFlow?: string | null
  pressure?: string | null
  text?: string | null
}

function beadSize(d50: number | null) {
  if (d50 == null) return 18
  return Math.max(10, Math.min(48, Math.round(d50 * 0.28)))
}

const pct = (n: number) => `${Math.round(n * 1000) / 10}%`

export function RangeBars({
  grades,
  axisMax = 250,
  unit = 'µm',
  legend = ['Grade / particle size distribution', 'Maximum linear flow / application'],
  className,
}: {
  grades: RangeGrade[]
  axisMax?: number
  unit?: string
  legend?: [string, string]
  className?: string
}) {
  // Extend the axis in 50 µm steps if a supplied range exceeds it.
  const maxSeen = Math.max(axisMax, ...grades.map((g) => parseRange(g.sizeRange)?.[1] ?? 0))
  const max = Math.ceil(maxSeen / 50) * 50
  const ticks = Array.from({ length: max / 50 + 1 }, (_, i) => i * 50)
  const cols = 'lg:grid-cols-[220px_minmax(0,1fr)_140px_175px]'

  return (
    <div className={cn('text-surface', className)}>
      <div className="flex justify-between gap-6 border-b border-rule-dark pb-3 text-[11px] uppercase tracking-[0.09em] text-text-2-dark max-lg:text-[9px]" aria-hidden>
        <span>{legend[0]}</span>
        <span>{legend[1]}</span>
      </div>
      <ol className="m-0 list-none p-0">
        {grades.map((g, i) => {
          const range = parseRange(g.sizeRange)
          const d50 = parseNumber(g.d50)
          const flow = parseFigure(g.maxFlow)
          const start = range ? range[0] / max : 0
          const length = range ? (range[1] - range[0]) / max : 0
          const mean = d50 != null ? d50 / max : range ? (range[0] + range[1]) / 2 / max : 0
          const rangeLabel = [g.sizeRange, g.d50 ? `d50V ${g.d50}` : null].filter(Boolean).join(' · ')
          // Numerals in mono, words/units in sans: "100–240 µm · d50V ~163 µm".
          const labelParts = rangeLabel.split(/(\d[\d.,]*(?:\s*[–—-]\s*\d[\d.,]*)?|~\d[\d.,]*)/g).filter(Boolean)
          return (
            <li key={g.id ?? i} className={cn('grid min-h-[106px] grid-cols-[minmax(0,1fr)_94px] items-center gap-x-3 gap-y-2 border-b border-rule-dark py-5 lg:gap-8', cols)}>
              <div className="flex items-center gap-3 lg:gap-4">
                <span className="flex w-[42px] justify-center lg:w-12" aria-hidden>
                  <span className="bead-mark" style={{ '--size': `${beadSize(d50)}px` } as React.CSSProperties} />
                </span>
                <h3 className="serif-sm text-[27px] leading-tight lg:text-[24px]">{g.name}</h3>
              </div>
              <div className="range-plot col-span-2 row-start-2 mt-3 lg:col-span-1 lg:row-start-auto lg:mt-0" style={{ '--start': pct(start), '--length': pct(length), '--mean': pct(mean) } as React.CSSProperties} role="img" aria-label={range ? `Particle size ${g.sizeRange}${g.d50 ? `, d50V ${g.d50}` : ''}` : 'Range not supplied'}>
                {rangeLabel ? (
                  <span className="range-label">
                    {labelParts.map((part, k) => (/^[~\d]/.test(part) ? <span key={k} className="mono">{part}</span> : <React.Fragment key={k}>{part}</React.Fragment>))}
                  </span>
                ) : null}
                {range ? (
                  <>
                    <span className="range-bar" />
                    {d50 != null || range ? <span className="range-median" /> : null}
                  </>
                ) : (
                  <span className="range-label top-4! mono text-[11px]">[range: to confirm]</span>
                )}
              </div>
              <div className="col-start-2 row-start-1 text-right lg:col-start-auto lg:row-start-auto lg:text-left">
                {flow ? (
                  <p className="mono text-[26px] leading-[1.1] text-teal-lum lg:text-[27px]">
                    {isSymbolPrefix(flow.prefix) ? flow.prefix : ''}
                    {flow.value}
                    <span className="mt-1.5 block font-sans text-[9px] normal-case text-text-2-dark lg:text-[11px]">{[flow.unit, isSymbolPrefix(flow.prefix) ? '' : flow.prefix].filter(Boolean).join(' · ')}</span>
                  </p>
                ) : (
                  <p className="mono text-[11px] text-text-2-dark">[flow: to confirm]</p>
                )}
              </div>
              <p className="col-span-2 text-[11px] text-text-2-dark lg:col-span-1 lg:text-[13px]">{g.badge || g.text}</p>
            </li>
          )
        })}
      </ol>
      <div className={cn('grid grid-cols-1 gap-x-3 lg:gap-8', cols)} aria-hidden>
        <div className="hidden lg:block" />
        <div className="range-axis">
          {ticks.map((t, i) => {
            const x = `${(t / max) * 100}%`
            const edge = i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : undefined
            return (
              <React.Fragment key={t}>
                <span className="range-axis-tick" style={{ left: x }} />
                <span className="range-axis-label" data-edge={edge} style={{ left: x }}>
                  {t}
                  {i === ticks.length - 1 ? <span className="font-sans"> {unit}</span> : null}
                </span>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

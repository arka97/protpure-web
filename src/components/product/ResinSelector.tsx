'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowIcon } from '@/components/visual/icons'
import { GRADE_LABELS } from '@/lib/rfq'
import { cn } from '@/lib/utils'

export type SlimProduct = { id: number; slug: string; name: string; subtitle: string | null; category: string; categoryName: string; ligand: string | null; functionalType: string | null; grades: string[] }
type Cat = { slug: string; name: string; mode: string | null }

const TARGETS = [
  { id: 'his', label: 'His-tagged protein', modes: ['affinity'], hint: /ni-nta|imac|nickel|cobalt|copper|zinc|nta/i },
  { id: 'basic', label: 'Basic protein (pI > 7)', modes: ['ion-exchange'], hint: /cation|\bsp\b|\bcm\b/i },
  { id: 'acidic', label: 'Acidic protein / nucleic acid', modes: ['ion-exchange'], hint: /anion|\bq\b|deae/i },
  { id: 'antibody', label: 'Antibody / polishing', modes: ['ion-exchange', 'mixed-mode', 'hydrophobic-interaction'], hint: /cation|mixed|phenyl|hic/i },
  { id: 'hydrophobic', label: 'Hydrophobic separation', modes: ['hydrophobic-interaction'], hint: /phenyl|hic|hydrophobic/i },
  { id: 'sec', label: 'Buffer exchange / size-based', modes: ['size-exclusion'], hint: /sec|size|desalt|cross-linked/i },
]
const STAGES = [
  { id: 'capture', label: 'Capture' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'polishing', label: 'Polishing' },
  { id: 'screening', label: 'R&D screening' },
]
const THROUGHPUT = [
  { id: 'high', label: 'High throughput / industrial', grades: ['faster', 'fast-flow'] },
  { id: 'balanced', label: 'Balanced', grades: ['fast-flow'] },
  { id: 'resolution', label: 'High resolution / gentle', grades: ['precise', 'hr'] },
]
const GRADE_LABEL: Record<string, string> = GRADE_LABELS

/**
 * "Find the right chemistry in three steps": target, purification stage and throughput narrow the
 * catalogue to a starting point. It suggests, it does not assert — every recommendation ends with a
 * scientist confirming the grade and column conditions. Sits on the tint surface (`bg-tint`).
 */
export function ResinSelector({ categories, products }: { categories: Cat[]; products: SlimProduct[] }) {
  const [target, setTarget] = React.useState<string | null>(null)
  const [stage, setStage] = React.useState<string | null>(null)
  const [thr, setThr] = React.useState<string | null>(null)

  const t = TARGETS.find((x) => x.id === target)
  const th = THROUGHPUT.find((x) => x.id === thr)

  const matches = React.useMemo(() => {
    if (!t) return []
    const modeCats = new Set(categories.filter((c) => c.mode && t.modes.includes(c.mode)).map((c) => c.slug))
    return products
      .filter((p) => modeCats.has(p.category))
      .map((p) => ({ p, score: (t.hint.test(`${p.name} ${p.subtitle ?? ''} ${p.ligand ?? ''} ${p.functionalType ?? ''}`) ? 2 : 0) + (th && p.grades.some((g) => th.grades.includes(g)) ? 1 : 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [t, th, categories, products])

  const recommendedGrade = th ? th.grades.map((g) => GRADE_LABEL[g] ?? g).join(' or ') : null
  const stageNote = stage === 'polishing' ? 'For polishing, prefer the Precise or HR grade for resolution.' : stage === 'capture' ? 'For capture from crude feed, the Fast Flow or Faster grade keeps back-pressure low.' : stage === 'screening' ? 'For screening, ask about 1 mL pre-packed columns and small pack sizes.' : null
  const touched = Boolean(target || stage || thr)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
      <div className="grid content-start gap-6">
        <Step n={1} title="What are you purifying?" options={TARGETS} value={target} onChange={setTarget} />
        <Step n={2} title="Purification stage" options={STAGES} value={stage} onChange={setStage} />
        <Step n={3} title="Throughput need" options={THROUGHPUT} value={thr} onChange={setThr} />
      </div>
      <div className="card p-5 lg:sticky lg:top-24 lg:self-start lg:p-6" aria-live="polite">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="heading-3">Starting point</h3>
          {touched ? (
            <button type="button" onClick={() => (setTarget(null), setStage(null), setThr(null))} className="min-h-11 text-[12px] font-medium text-teal-deep underline decoration-rule underline-offset-4 hover:decoration-current sm:min-h-0">
              Reset
            </button>
          ) : null}
        </div>
        {!t ? (
          <p className="mt-3 text-[13px] leading-[1.6] text-text-2">Pick what you are purifying and we suggest the resin family and grade. Confirm grade and column conditions with a scientist before you qualify.</p>
        ) : (
          <>
            {recommendedGrade ? (
              <p className="mt-3 text-[13px] leading-[1.6] text-text-2">
                Suggested grade: <span className="mono font-medium text-ink">{recommendedGrade}</span>
              </p>
            ) : null}
            {stageNote ? <p className="mt-1 text-[13px] leading-[1.6] text-text-2">{stageNote}</p> : null}
            <ul className="mt-4 divide-y divide-rule border-y border-rule">
              {matches.length ? (
                matches.map(({ p }) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} className="group flex min-h-11 items-center justify-between gap-3 py-2.5 hover:text-teal-deep">
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium text-ink group-hover:text-teal-deep">{p.name}</span>
                        <span className="block text-[11px] text-text-2">{p.subtitle || p.categoryName}</span>
                      </span>
                      <ArrowIcon className="h-4 w-4 shrink-0 text-text-2 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))
              ) : (
                <li className="py-3 text-[13px] text-text-2">No matching product yet — ask us about custom chemistries.</li>
              )}
            </ul>
            <p className="mt-3 text-[11px] leading-[1.5] text-text-2">A starting point, not a recommendation: a scientist confirms grade and column conditions for your feed.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/request-quote?${matches.map((m) => `product=${m.p.id}`).join('&')}`} className="btn-primary btn-sm min-h-11 sm:min-h-9">
                Request a quote <ArrowIcon />
              </Link>
              <Link href="/request-quote?type=technical" className="btn-secondary btn-sm min-h-11 sm:min-h-9">
                Ask a scientist
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Step({ n, title, options, value, onChange }: { n: number; title: string; options: { id: string; label: string }[]; value: string | null; onChange: (v: string) => void }) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="eyebrow mb-3 text-[10px] tracking-[0.11em] text-ink">
        <span className="num">{String(n).padStart(2, '0')} / </span>
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.id} className={cn('inline-flex min-h-11 cursor-pointer select-none items-center border px-3.5 py-1.5 text-[12px] leading-tight transition-colors sm:min-h-9', value === o.id ? 'border-teal-deep bg-white font-medium text-ink' : 'border-[#b6cfc4] bg-white/60 text-text-2 hover:border-teal-deep hover:text-ink')}>
            <input type="radio" name={`step-${n}`} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

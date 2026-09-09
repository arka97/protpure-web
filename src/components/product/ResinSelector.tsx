'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, RotateCcw } from 'lucide-react'
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
const GRADE_LABEL: Record<string, string> = { faster: 'Faster', 'fast-flow': 'Fast Flow', precise: 'Precise', hr: 'HR' }

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

  const recommendedGrade = th ? th.grades.map((g) => GRADE_LABEL[g]).join(' or ') : null
  const stageNote = stage === 'polishing' ? 'For polishing, prefer the Precise or HR grade for resolution.' : stage === 'capture' ? 'For capture from crude feed, the Fast Flow or Faster grade keeps back-pressure low.' : stage === 'screening' ? 'For screening, ask about 1 mL pre-packed columns and small pack sizes.' : null

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="grid gap-5 lg:col-span-7">
        <Step n={1} title="What are you purifying?" options={TARGETS} value={target} onChange={setTarget} />
        <Step n={2} title="Purification stage?" options={STAGES} value={stage} onChange={setStage} />
        <Step n={3} title="Throughput need?" options={THROUGHPUT} value={thr} onChange={setThr} />
      </div>
      <div className="lg:col-span-5">
        <div className="card sticky top-24 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-navy-900">Recommendation</h3>
            {(target || stage || thr) && (
              <button type="button" onClick={() => (setTarget(null), setStage(null), setThr(null))} className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-navy-900">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
          {!t ? (
            <p className="mt-3 text-sm text-ink-soft">Pick what you are purifying and we’ll suggest the resin family and grade. You can then request a quote or ask our scientists to review your process.</p>
          ) : (
            <>
              {recommendedGrade ? (
                <p className="mt-3 text-sm text-ink-soft">
                  Suggested grade: <span className="font-semibold text-navy-900">{recommendedGrade}</span>
                </p>
              ) : null}
              {stageNote ? <p className="mt-1 text-sm text-ink-soft">{stageNote}</p> : null}
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {matches.length ? (
                  matches.map(({ p }) => (
                    <li key={p.id}>
                      <Link href={`/products/${p.slug}`} className="group flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2/60">
                        <div>
                          <p className="font-medium text-navy-900 group-hover:text-teal-600">{p.name}</p>
                          <p className="text-xs text-muted">{p.subtitle || p.categoryName}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted" />
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-muted">No matching product yet — ask us about custom chemistries.</li>
                )}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/request-quote?${matches.map((m) => `product=${m.p.id}`).join('&')}`} className="btn-primary btn-sm">
                  Request a quote
                </Link>
                <Link href="/request-quote?type=technical" className="btn-secondary btn-sm">
                  Ask a scientist
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Step({ n, title, options, value, onChange }: { n: number; title: string; options: { id: string; label: string }[]; value: string | null; onChange: (v: string) => void }) {
  return (
    <fieldset className="card p-5">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{n}</span>
        <p className="font-semibold text-navy-900">{title}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.id} className={cn('cursor-pointer select-none rounded-full border px-3.5 py-1.5 text-sm transition', value === o.id ? 'border-teal-500 bg-teal-50 font-medium text-teal-600' : 'border-line bg-white text-ink-soft hover:border-navy-900/30')}>
            <input type="radio" name={`step-${n}`} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

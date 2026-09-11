'use client'

import * as React from 'react'
import Form from 'next/form'
import Link from 'next/link'
import { ArrowIcon, SearchIcon } from '@/components/visual/icons'
import { SORT_OPTIONS, type FilterGroup, type SortValue } from '@/lib/catalog'
import { cn } from '@/lib/utils'

/**
 * Catalogue filters as a plain GET form: every checkbox is a URL search param, so the server renders
 * the result and the page works without JavaScript (an "Apply" button shows in that case). With
 * JavaScript, changes submit the form straight away (client-side navigation via next/form) and the
 * sidebar folds behind a "Filters" disclosure on phones.
 */
/** False during SSR and hydration, true once the client has taken over — the no-JS fallbacks key off it. */
const noop = () => () => {}
const useHydrated = () => React.useSyncExternalStore(noop, () => true, () => false)

export function FilterSidebar({ action, groups, q, sort, activeCount, resultCount }: { action: string; groups: FilterGroup[]; q: string; sort: SortValue; activeCount: number; resultCount: number }) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const id = React.useId()
  const js = useHydrated()
  const [open, setOpen] = React.useState(false)
  const submit = () => formRef.current?.requestSubmit()

  return (
    <div className="lg:sticky lg:top-[88px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-form`}
        className={cn('btn-secondary btn-sm mb-4 w-full justify-between lg:hidden', !js && 'hidden')}
      >
        <span>
          Filters
          {activeCount ? <span className="mono text-[12px] font-normal text-text-2"> ({activeCount} active)</span> : null}
        </span>
        <span className="text-[12px] font-normal text-text-2"><span className="mono">{resultCount}</span> products</span>
      </button>

      <Form ref={formRef} id={`${id}-form`} action={action} scroll={false} className={cn(js && !open && 'max-lg:hidden')} role="search" aria-label="Product filters">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-medium text-ink">Refine your selection</h2>
          {activeCount ? (
            <Link href={action} className="text-[12px] font-medium text-teal-deep underline decoration-rule underline-offset-4 hover:decoration-current">
              Reset
            </Link>
          ) : null}
        </div>

        <label className="relative mb-6 block">
          <span className="sr-only">Search products</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-2" />
          <input type="search" name="q" defaultValue={q} placeholder="Search products" className="field-control min-h-11 pl-10 text-[13px] lg:min-h-10" enterKeyHint="search" />
        </label>
        {sort !== 'catalogue' ? <input type="hidden" name="sort" value={sort} /> : null}

        {groups.map((g) => (
          <fieldset key={`${g.name}:${g.selected.join(',')}`} className="mb-7 border-0 p-0">
            <legend className="mb-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-ink">{g.legend}</legend>
            <div className="grid">
              {g.options.map((o) => (
                <label key={o.value} className="flex min-h-11 cursor-pointer items-center gap-2.5 py-1.5 text-[12px] leading-tight text-ink lg:min-h-0">
                  <input type="checkbox" name={g.name} value={o.value} defaultChecked={g.selected.includes(o.value)} onChange={submit} className="h-[15px] w-[15px] shrink-0" />
                  <span className="min-w-0 flex-1">
                    {o.label}
                    {o.note ? <span className="mono text-[11px] text-text-2"> · {o.note}</span> : null}
                  </span>
                  <span className="mono text-[10px] text-text-2" aria-label={`${o.count} products`}>
                    {String(o.count).padStart(2, '0')}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {!js ? (
          <button type="submit" className="btn-secondary btn-sm mb-6 w-full">
            Apply filters
          </button>
        ) : null}
      </Form>
    </div>
  )
}

/** Sort select in the results bar; carries the active filters as hidden fields so the URL stays complete. */
export function SortForm({ action, sort, hidden }: { action: string; sort: SortValue; hidden: [string, string][] }) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const id = React.useId()
  const js = useHydrated()
  return (
    <Form ref={formRef} action={action} scroll={false} className="flex items-center gap-2 text-[12px]">
      {hidden.map(([k, v], i) => (
        <input key={`${k}-${i}`} type="hidden" name={k} value={v} />
      ))}
      <label htmlFor={`${id}-sort`} className="whitespace-nowrap text-text-2">
        Sort by
      </label>
      <select id={`${id}-sort`} name="sort" defaultValue={sort} onChange={() => formRef.current?.requestSubmit()} className="field-control min-h-11 w-auto max-w-[180px] py-1.5 pr-8 text-[12px] lg:min-h-9">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {!js ? (
        <button type="submit" className="btn-secondary btn-xs">
          Go <ArrowIcon />
        </button>
      ) : null}
    </Form>
  )
}

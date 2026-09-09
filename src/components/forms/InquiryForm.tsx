'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import { submitInquiry, type FormState } from '@/app/actions'
import { cn } from '@/lib/utils'

export type ProductOption = { id: number; name: string; category: string }

const TYPE_LABELS: Record<string, string> = {
  quote: 'Request a quote',
  evaluation: 'Request an evaluation',
  technical: 'Ask a technical question',
  partnership: 'Distribution / partnership',
  contact: 'Send a message',
}

export function InquiryForm({
  type: initialType = 'quote',
  products,
  preselected = [],
  allowTypeChange = true,
  responseTime,
}: {
  type?: string
  products: ProductOption[]
  preselected?: number[]
  allowTypeChange?: boolean
  responseTime?: string | null
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiry, null)
  const params = useSearchParams()
  const pathname = usePathname()
  const [type, setType] = React.useState(params.get('type') || initialType)
  const paramProducts = params.getAll('product').map(Number).filter(Boolean)
  const [selected, setSelected] = React.useState<number[]>(preselected.length ? preselected : paramProducts)
  const pageUrlRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    // Populated client-side only; the server action reads it from the form data.
    if (pageUrlRef.current) pageUrlRef.current.value = window.location.href
  }, [pathname])

  const err = (k: string) => state?.errors?.[k]
  const input = (k: string) =>
    cn('w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20', err(k) ? 'border-red-400' : 'border-line')

  if (state?.ok) {
    return (
      <div className="card p-8 text-center" role="status">
        <CircleCheck className="mx-auto h-10 w-10 text-teal-500" />
        <p className="heading-3 mt-4">Request received</p>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">{state.message}</p>
      </div>
    )
  }

  const byCategory = products.reduce<Record<string, ProductOption[]>>((acc, p) => {
    ;(acc[p.category] ||= []).push(p)
    return acc
  }, {})
  const showProducts = type === 'quote' || type === 'evaluation' || type === 'technical'

  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="pageUrl" defaultValue="" ref={pageUrlRef} />

      {allowTypeChange ? (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="inq-type">
            What can we help with?
          </label>
          <select id="inq-type" name="type" value={type} onChange={(e) => setType(e.target.value)} className={input('type')}>
            {Object.entries(TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="type" value={type} />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" error={err('name')}>
          <input id="name" name="name" required autoComplete="name" className={input('name')} />
        </Field>
        <Field label="Work email" name="email" error={err('email')}>
          <input id="email" name="email" type="email" required autoComplete="email" className={input('email')} />
        </Field>
        <Field label="Organisation" name="organization" error={err('organization')}>
          <input id="organization" name="organization" autoComplete="organization" className={input('organization')} />
        </Field>
        <Field label="Job title" name="jobTitle" optional error={err('jobTitle')}>
          <input id="jobTitle" name="jobTitle" autoComplete="organization-title" className={input('jobTitle')} />
        </Field>
        <Field label="Country" name="country" error={err('country')}>
          <input id="country" name="country" autoComplete="country-name" className={input('country')} placeholder="Where should we ship or quote to?" />
        </Field>
        <Field label="Phone / WhatsApp" name="phone" optional error={err('phone')}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={input('phone')} placeholder="+1 …" />
        </Field>
      </div>

      {showProducts && products.length ? (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">
            Products of interest <span className="font-normal text-muted">(select any)</span>
          </legend>
          <div className="max-h-56 space-y-3 overflow-y-auto rounded-lg border border-line bg-surface-2/50 p-3">
            {Object.entries(byCategory).map(([cat, list]) => (
              <div key={cat}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((p) => {
                    const on = selected.includes(p.id)
                    return (
                      <label key={p.id} className={cn('cursor-pointer select-none rounded-full border px-3 py-1 text-sm transition', on ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-line bg-white text-ink-soft hover:border-navy-900/30')}>
                        <input type="checkbox" name="productIds" value={p.id} checked={on} onChange={() => setSelected((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))} className="sr-only" />
                        {p.name}
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      ) : null}

      {showProducts ? (
        <Field label="Quantities, grades and pack sizes" name="requestedItems" optional error={err('requestedItems')}>
          <textarea id="requestedItems" name="requestedItems" rows={3} className={input('requestedItems')} placeholder="e.g. SP Agarose Precise — 2 × 1 L; Ni-NTA Agarose — 5 L bulk" />
        </Field>
      ) : null}

      {type !== 'partnership' && type !== 'contact' ? (
        <Field label="What are you purifying?" name="application" optional error={err('application')}>
          <input id="application" name="application" className={input('application')} placeholder="e.g. His-tagged recombinant enzyme, 5 L fermentation, capture step" />
        </Field>
      ) : null}

      <Field label="Message" name="message" optional={type !== 'contact' && type !== 'partnership'} error={err('message')}>
        <textarea id="message" name="message" rows={5} className={input('message')} placeholder={type === 'partnership' ? 'Tell us about your company, territories and the customers you serve.' : 'Anything else we should know — timelines, documentation needs, column formats…'} />
      </Field>

      <label className={cn('flex items-start gap-3 text-sm text-ink-soft', err('consent') && 'text-red-600')}>
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 rounded border-line accent-teal-500" />
        <span>I agree that Protpure may contact me about this request and store my details for that purpose. See our privacy policy.</span>
      </label>

      {state && !state.ok ? (
        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800" role="alert">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Sending…' : TYPE_LABELS[type] ?? 'Send'}
        </button>
        {responseTime ? <p className="text-sm text-muted">We reply {responseTime}.</p> : null}
      </div>
    </form>
  )
}

function Field({ label, name, optional, error, children }: { label: string; name: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor={name}>
        {label} {optional ? <span className="font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

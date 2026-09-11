'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import { submitInquiry, type FormState } from '@/app/actions'
import { useBasket } from '@/components/rfq/BasketProvider'
import { BasketTable, controlClass } from '@/components/rfq/BasketLines'
import { toInquiryItem, type BasketProduct, type PurposeValue } from '@/lib/rfq'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  quote: 'Request a quote',
  evaluation: 'Request an evaluation',
  technical: 'Ask a technical question',
  partnership: 'Distribution / partnership',
  contact: 'Send a message',
}

/** Default line purpose when a product is pre-added from a `?type=` link. */
const PURPOSE_FOR_TYPE: Record<string, PurposeValue> = { quote: 'production', evaluation: 'evaluation', technical: 'other' }

export function InquiryForm({
  type: initialType = 'quote',
  products,
  allowTypeChange = true,
  responseTime,
}: {
  type?: string
  /** Catalogue (slim) so the buyer can add products without leaving the form and `?product=` links can pre-fill the basket. */
  products: BasketProduct[]
  allowTypeChange?: boolean
  responseTime?: string | null
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiry, null)
  const params = useSearchParams()
  const pathname = usePathname()
  const basket = useBasket()
  const [type, setType] = React.useState(params.get('type') || initialType)
  const pageUrlRef = React.useRef<HTMLInputElement>(null)
  const addSelectId = React.useId()

  React.useEffect(() => {
    // Populated client-side only; the server action reads it from the form data.
    if (pageUrlRef.current) pageUrlRef.current.value = window.location.href
  }, [pathname])

  // `?product=ID` links (product pages, compare, category, AI surfaces) pre-add those products
  // to the basket once, then drop the parameter so a removed line does not come back on reload.
  const paramProducts = params.getAll('product').join(',')
  const preAdded = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!basket.ready || !paramProducts || preAdded.current === paramProducts) return
    preAdded.current = paramProducts
    const purpose = PURPOSE_FOR_TYPE[params.get('type') || initialType] ?? 'production'
    for (const id of paramProducts.split(',').map(Number)) {
      const product = products.find((p) => p.id === id)
      if (product && !basket.has(product.id)) basket.add({ product, purpose })
    }
    const url = new URL(window.location.href)
    url.searchParams.delete('product')
    window.history.replaceState(window.history.state, '', url)
  }, [basket, paramProducts, params, products, initialType])

  // Submitted: the basket has been turned into an inquiry.
  const clearedFor = React.useRef<unknown>(null)
  React.useEffect(() => {
    if (state?.ok && clearedFor.current !== state) {
      clearedFor.current = state
      basket.clear()
    }
  }, [state, basket])

  const err = (k: string) => state?.errors?.[k]
  const input = (k: string) => cn(controlClass, 'px-3.5 py-2.5 sm:py-2.5', err(k) && 'border-red-400')

  if (state?.ok) {
    return (
      <div className="card p-8 text-center" role="status">
        <CircleCheck className="mx-auto h-10 w-10 text-teal-500" />
        <p className="heading-3 mt-4">Request received</p>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">{state.message}</p>
      </div>
    )
  }

  const showProducts = type === 'quote' || type === 'evaluation' || type === 'technical'
  const items = basket.ready ? basket.items : []
  const itemsJson = JSON.stringify(items.map(toInquiryItem))

  return (
    <form
      action={action}
      // Submitting through the transition (rather than letting React run the form action) keeps
      // typed values and the basket selects intact when validation fails; without JS the plain
      // `action` still works.
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        React.startTransition(() => action(data))
      }}
      className="grid gap-5"
      noValidate
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="pageUrl" defaultValue="" ref={pageUrlRef} />
      {showProducts ? <input type="hidden" name="items" value={itemsJson} /> : null}

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

      {showProducts ? (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">
            {type === 'technical' ? 'Products this question is about' : 'Items to quote'}{' '}
            <span className="font-normal text-muted">{basket.ready && items.length ? `(${items.length})` : '(optional)'}</span>
          </legend>
          {basket.ready && items.length ? (
            <BasketTable />
          ) : (
            <p className="rounded-lg border border-dashed border-line bg-surface-2/50 px-4 py-3 text-sm text-ink-soft">
              {basket.ready ? 'Your RFQ basket is empty. Add a product below, or describe what you need in the message.' : 'Loading your basket…'}
            </p>
          )}
          {products.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label htmlFor={addSelectId} className="sr-only">
                Add a product
              </label>
              <select
                id={addSelectId}
                className={cn(controlClass, 'w-auto min-w-56 flex-1')}
                value=""
                onChange={(e) => {
                  const product = products.find((p) => p.id === Number(e.target.value))
                  if (product) basket.add({ product, purpose: PURPOSE_FOR_TYPE[type] ?? 'production' })
                }}
              >
                <option value="">+ Add a product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.category ? ` — ${p.category}` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </fieldset>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" error={err('name')}>
          <input id="name" name="name" required autoComplete="name" className={input('name')} />
        </Field>
        <Field label="Work email" name="email" error={err('email')}>
          <input id="email" name="email" type="email" required autoComplete="email" className={input('email')} />
        </Field>
        <Field label="Company / organisation" name="organization" error={err('organization')}>
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

      {type !== 'partnership' && type !== 'contact' ? (
        <Field label="What are you purifying?" name="application" optional error={err('application')}>
          <input id="application" name="application" className={input('application')} placeholder="e.g. His-tagged recombinant enzyme, 5 L fermentation, capture step" />
        </Field>
      ) : null}

      <Field label="Message" name="message" optional={type !== 'contact' && type !== 'partnership'} error={err('message')}>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={input('message')}
          placeholder={type === 'partnership' ? 'Tell us about your company, territories and the customers you serve.' : showProducts ? 'Anything else we should know — other items, timelines, documentation needs, column formats…' : 'How can we help?'}
        />
      </Field>

      <label className={cn('flex items-start gap-3 text-sm text-ink-soft', err('consent') && 'text-red-600')}>
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 rounded border-line accent-teal-500" />
        <span>I agree that Protpure may contact me about this request and store my details for that purpose. See our privacy policy.</span>
      </label>

      {state && !state.ok ? (
        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800" role="alert">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
          {err('items') ? <> Items: {err('items')}</> : null}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary min-h-11" disabled={pending}>
          {pending ? 'Sending…' : showProducts && items.length ? `${TYPE_LABELS[type] ?? 'Send'} (${items.length} item${items.length === 1 ? '' : 's'})` : TYPE_LABELS[type] ?? 'Send'}
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

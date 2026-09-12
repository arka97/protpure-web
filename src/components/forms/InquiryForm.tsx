'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { submitInquiry, type FormState } from '@/app/actions'
import { useBasket } from '@/components/rfq/BasketProvider'
import { BasketTable, controlClass } from '@/components/rfq/BasketLines'
import { AlertIcon, ArrowIcon, CheckIcon } from '@/components/visual/icons'
import { toInquiryItem, type BasketProduct, type PurposeValue } from '@/lib/rfq'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  quote: 'Request a quote',
  evaluation: 'Request an evaluation',
  technical: 'Ask a technical question',
  partnership: 'Distribution / partnership',
  contact: 'Send a message',
}

/**
 * Default line purpose when a product is pre-added from a `?type=` link. An evaluation request
 * is a paid sample kit (5–25 mL packs or a 1 mL pre-packed column, credited against the first
 * bulk order) — never a free sample.
 */
const PURPOSE_FOR_TYPE: Record<string, PurposeValue> = { quote: 'production', evaluation: 'sample-kit', technical: 'other' }

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
  const formRef = React.useRef<HTMLFormElement>(null)
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

  // Validation failed: move focus to the first invalid field so the error is read out.
  React.useEffect(() => {
    if (!state || state.ok || !state.errors) return
    const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    first?.focus()
  }, [state])

  const err = (k: string) => state?.errors?.[k]
  const inputClass = cn(controlClass, 'px-3.5 py-2.5 sm:py-2.5')
  const invalid = (k: string) => ({ 'aria-invalid': err(k) ? true : undefined, 'aria-describedby': err(k) ? `${k}-error` : undefined })

  if (state?.ok) {
    return (
      <div className="card p-8 text-center lg:p-10" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tint text-teal-deep">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="mt-5 font-display text-[32px] leading-[1.05] tracking-[-0.03em] text-ink">Request received.</p>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.6] text-text-2">{state.message}</p>
      </div>
    )
  }

  const showProducts = type === 'quote' || type === 'evaluation' || type === 'technical'
  const items = basket.ready ? basket.items : []
  const itemsJson = JSON.stringify(items.map(toInquiryItem))

  return (
    <form
      ref={formRef}
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
          <label className="mb-1.5 block text-[12px] font-medium text-ink" htmlFor="inq-type">
            What can we help with?
          </label>
          <select id="inq-type" name="type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
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
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-[12px] font-medium text-ink">
            {type === 'technical' ? 'Products this question is about' : 'Items to quote'}{' '}
            <span className="font-normal text-text-2">{basket.ready && items.length ? <span className="mono">({items.length})</span> : '(optional)'}</span>
          </legend>
          {basket.ready && items.length ? (
            <BasketTable />
          ) : (
            <p className="border border-dashed border-rule-strong bg-surface px-4 py-3 text-[13px] leading-[1.6] text-text-2">
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
          {err('items') ? (
            <p id="items-error" className="mt-2 text-[12px] text-error" role="alert">
              {err('items')}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" error={err('name')}>
          <input id="name" name="name" required autoComplete="name" className={inputClass} {...invalid('name')} />
        </Field>
        <Field label="Work email" name="email" error={err('email')}>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@company.com" {...invalid('email')} />
        </Field>
        <Field label="Company / organisation" name="organization" error={err('organization')}>
          <input id="organization" name="organization" autoComplete="organization" className={inputClass} placeholder="Company or institute" {...invalid('organization')} />
        </Field>
        <Field label="Job title" name="jobTitle" optional error={err('jobTitle')}>
          <input id="jobTitle" name="jobTitle" autoComplete="organization-title" className={inputClass} {...invalid('jobTitle')} />
        </Field>
        <Field label="Destination country" name="country" error={err('country')}>
          <input id="country" name="country" autoComplete="country-name" className={inputClass} placeholder="Where should we ship or quote to?" {...invalid('country')} />
        </Field>
        <Field label="Phone / WhatsApp" name="phone" optional error={err('phone')}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="+91 …" {...invalid('phone')} />
        </Field>
      </div>

      {type !== 'partnership' && type !== 'contact' ? (
        <Field label="What are you purifying?" name="application" optional error={err('application')}>
          <input id="application" name="application" className={inputClass} placeholder="e.g. His-tagged recombinant enzyme, 5 L fermentation, capture step" {...invalid('application')} />
        </Field>
      ) : null}

      <Field label={showProducts ? 'Process notes' : 'Message'} name="message" optional={type !== 'contact' && type !== 'partnership'} error={err('message')}>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={inputClass}
          placeholder={type === 'partnership' ? 'Tell us about your company, territories and the customers you serve.' : showProducts ? 'Target, scale, timeline, custom volume, documentation needs, column formats…' : 'How can we help?'}
          {...invalid('message')}
        />
      </Field>

      <label className={cn('flex items-start gap-3 text-[13px] leading-[1.55] text-text-2', err('consent') && 'text-error')}>
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0" aria-invalid={err('consent') ? true : undefined} />
        <span>
          I agree that Protpure may contact me about this request and store my details for that purpose. See our privacy policy.
          {err('consent') ? <span className="block text-[12px]">{err('consent')}</span> : null}
        </span>
      </label>

      {state && !state.ok ? (
        <p className="flex items-start gap-2.5 border border-[#e2c9a2] bg-[#fbf3e6] px-3.5 py-3 text-[13px] leading-[1.55] text-attention" role="alert">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary min-h-12" disabled={pending}>
          {pending ? 'Sending…' : showProducts && items.length ? `${TYPE_LABELS[type] ?? 'Send'} (${items.length} item${items.length === 1 ? '' : 's'})` : TYPE_LABELS[type] ?? 'Send'}
          <ArrowIcon />
        </button>
        {responseTime ? <p className="text-[13px] text-text-2">A scientist replies {responseTime}.</p> : null}
      </div>
    </form>
  )
}

function Field({ label, name, optional, error, children }: { label: string; name: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-[12px] font-medium text-ink" htmlFor={name}>
        {label} {optional ? <span className="font-normal text-text-2">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-[12px] text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

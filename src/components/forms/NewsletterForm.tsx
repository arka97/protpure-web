'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { subscribeNewsletter, type FormState } from '@/app/actions'
import { ArrowIcon, CheckIcon } from '@/components/visual/icons'
import { cn } from '@/lib/utils'

/**
 * Single labelled email field. `variant="underline"` is the footer treatment (hairline underline,
 * arrow submit); the default is a bordered field with a button for light surfaces.
 */
export function NewsletterForm({ compact, onDark, variant = 'default', label = 'Email address' }: { compact?: boolean; onDark?: boolean; variant?: 'default' | 'underline'; label?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, null)
  const id = React.useId()

  if (state?.ok) {
    return (
      <p className={cn('flex items-start gap-2 text-[13px]', onDark ? 'text-teal-lum' : 'text-teal-deep')} role="status">
        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
      </p>
    )
  }

  const error = state && !state.ok ? state.message : null

  if (variant === 'underline') {
    return (
      <form action={action}>
        <label htmlFor={`${id}-email`} className={cn('block text-[13px]', onDark ? 'text-surface' : 'text-ink')}>
          {label}
        </label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className={cn('mt-4 flex items-stretch border-b', onDark ? 'border-[#72918f] focus-within:border-teal-lum' : 'border-rule-strong focus-within:border-teal-deep')}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Your work email"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn('min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none focus-visible:outline-none', onDark ? 'text-surface placeholder:text-text-2-dark' : 'text-ink placeholder:text-text-2')}
          />
          <button type="submit" className={cn('icon-button -mr-2 min-h-[44px] min-w-[44px]', onDark ? 'text-teal-lum hover:bg-white/5' : 'text-teal-deep')} aria-label="Subscribe to newsletter" disabled={pending}>
            <ArrowIcon />
          </button>
        </div>
        {error ? (
          <p id={`${id}-error`} className={cn('mt-2 text-[12px]', onDark ? 'text-[#f0c9a0]' : 'text-error')} role="alert">
            {error}
          </p>
        ) : null}
      </form>
    )
  }

  return (
    <form action={action} className={cn('flex flex-col gap-3', !compact && 'sm:flex-row sm:items-start')}>
      <div className="min-w-0 flex-1">
        <label className="mb-1.5 block text-[13px] font-medium" htmlFor={`${id}-email`}>
          {label}
        </label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="field-control" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} />
        {error ? (
          <p id={`${id}-error`} className="mt-2 text-[12px] text-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <button type="submit" className="btn-primary shrink-0 sm:mt-[26px]" disabled={pending}>
        {pending ? 'Sending…' : 'Subscribe'} <ArrowIcon />
      </button>
    </form>
  )
}

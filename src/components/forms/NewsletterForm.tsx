'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { Send, CircleCheck } from 'lucide-react'
import { subscribeNewsletter, type FormState } from '@/app/actions'
import { cn } from '@/lib/utils'

export function NewsletterForm({ compact, onDark }: { compact?: boolean; onDark?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, null)

  if (state?.ok) {
    return (
      <p className={cn('flex items-start gap-2 text-sm', onDark ? 'text-teal-300' : 'text-teal-600')} role="status">
        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
      </p>
    )
  }

  return (
    <form action={action} className={cn('flex gap-2', compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row')}>
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="you@company.com"
        className={cn(
          'min-w-0 flex-1 rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2',
          onDark ? 'border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-teal-300 focus:ring-teal-300/30' : 'border-line bg-white text-ink focus:border-teal-500 focus:ring-teal-500/20',
        )}
      />
      <button type="submit" className="btn-primary btn-sm shrink-0" disabled={pending}>
        {pending ? 'Sending…' : 'Subscribe'} <Send className="h-4 w-4" aria-hidden />
      </button>
      {state && !state.ok ? (
        <p className={cn('basis-full text-xs', onDark ? 'text-amber-300' : 'text-amber-700')} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}

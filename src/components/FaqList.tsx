'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { RichText } from '@/components/RichText'
import { cn } from '@/lib/utils'
import type { Faq } from '@/payload-types'

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = React.useState<number | null>(faqs[0]?.id ?? null)
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((f) => {
        const isOpen = open === f.id
        return (
          <div key={f.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-navy-900 hover:bg-surface-2/60"
              aria-expanded={isOpen}
              aria-controls={`faq-${f.id}`}
              onClick={() => setOpen(isOpen ? null : f.id)}
            >
              <span>{f.question}</span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted transition-transform', isOpen && 'rotate-180')} />
            </button>
            <div id={`faq-${f.id}`} hidden={!isOpen} className="px-5 pb-5">
              <RichText data={f.answer} className="text-[0.95rem]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

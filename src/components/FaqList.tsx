import { RichText } from '@/components/RichText'
import { cn } from '@/lib/utils'
import type { Faq } from '@/payload-types'

/**
 * FAQ rows as native `<details>`: hairline-separated questions with a serif plus/minus, the first
 * one open. Works without JavaScript and follows the surface colours (light or dark).
 */
export function FaqList({ faqs, openFirst = true, className, invert }: { faqs: Faq[]; openFirst?: boolean; className?: string; invert?: boolean }) {
  return (
    <div className={className}>
      {faqs.map((f, i) => (
        <details key={f.id} className="faq-item group" open={openFirst && i === 0 ? true : undefined}>
          <summary>
            <span>{f.question}</span>
          </summary>
          <div className="faq-answer">
            <RichText data={f.answer} invert={invert} className={cn('text-[14px]', invert ? 'text-text-2-dark' : 'text-text-2')} />
          </div>
        </details>
      ))}
    </div>
  )
}

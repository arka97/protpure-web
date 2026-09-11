import Link from 'next/link'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { cn } from '@/lib/utils'
import type { NavItem } from './Header'

/**
 * Deep Field footer on the dark field: italic serif wordmark with the company line and contact,
 * CMS link columns, the newsletter field, and a hairline bottom row.
 */
export function Footer({
  siteName,
  legalName,
  tagline,
  columns,
  legalLinks,
  bottomText,
  newsletter,
  contact,
  linkedin,
}: {
  siteName: string
  legalName?: string | null
  tagline?: string | null
  columns: { title: string; links: NavItem[] }[]
  legalLinks: NavItem[]
  bottomText?: string | null
  newsletter?: { heading?: string | null; text?: string | null; note?: string | null } | null
  contact: { email?: string | null; phone?: string | null; address?: string | null; mapUrl?: string | null; city?: string | null; country?: string | null }
  linkedin?: string | null
}) {
  const cols = columns.slice(0, 3)
  const gridCols = cols.length >= 3 ? 'lg:grid-cols-[1.1fr_.65fr_.65fr_.65fr_1.2fr]' : cols.length === 2 ? 'lg:grid-cols-[1.1fr_.65fr_.65fr_1.2fr]' : 'lg:grid-cols-[1.1fr_.65fr_1.2fr]'
  const place = [contact.city, contact.country].filter(Boolean).join(', ')
  return (
    <footer className="surface-dark mt-auto">
      <div className="container-x pb-6 pt-10 lg:pb-[22px] lg:pt-[50px]">
        <div className={cn('grid grid-cols-2 gap-x-6 gap-y-8 lg:gap-x-[55px]', gridCols)}>
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block font-display text-[40px] italic leading-none tracking-[-0.02em] text-text-2-dark hover:text-surface" aria-label={`${siteName} home`}>
              {siteName}
            </Link>
            {tagline ? <p className="mt-4 max-w-[300px] text-[12px] leading-[1.6] text-text-2-dark">{tagline}</p> : null}
            {contact.email || contact.phone ? (
              <p className="mt-4 text-[12px] leading-[1.6] text-text-2-dark">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="hover:text-surface">
                    {contact.email}
                  </a>
                ) : null}
                {contact.email && contact.phone ? <br /> : null}
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="num hover:text-surface">
                    {contact.phone}
                  </a>
                ) : null}
              </p>
            ) : null}
            {contact.address ? (
              <p className="mt-4 whitespace-pre-line text-[11px] leading-[1.6] text-text-2-dark/80">
                {contact.mapUrl ? (
                  <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-surface">
                    {contact.address}
                  </a>
                ) : (
                  contact.address
                )}
              </p>
            ) : null}
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <h3 className="mb-4 text-[13px] font-medium text-surface">{col.title}</h3>
              <ul className="grid gap-2 text-[12px] text-text-2-dark">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link href={l.href} className="hover:text-surface" target={l.newTab ? '_blank' : undefined} rel={l.newTab ? 'noopener noreferrer' : undefined}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                {i === cols.length - 1 && linkedin ? (
                  <li>
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-surface">
                      LinkedIn
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-[13px] font-medium text-surface">{newsletter?.heading || 'Notes from the bench'}</h3>
            <NewsletterForm variant="underline" onDark label={newsletter?.text || 'Product updates, data and technical notes.'} />
            <p className="mt-4 text-[12px] leading-[1.6] text-text-2-dark">{newsletter?.note || `By subscribing, you agree to receive ${siteName} updates. You can unsubscribe at any time.`}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-rule-dark pt-5 text-[10px] leading-[1.6] text-text-2-dark sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:mt-[38px]">
          <span className="num">
            © {new Date().getFullYear()} {legalName || siteName}.
          </span>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((l, i) => (
              <li key={i}>
                <Link href={l.href} className="hover:text-surface">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/llms.txt" className="hover:text-surface" title="Machine-readable site summary for AI assistants">
                For AI assistants
              </Link>
            </li>
          </ul>
          <span>{[place ? `${place} · Supplying worldwide` : null, bottomText].filter(Boolean).join(' · ')}</span>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import type { NavItem } from './Header'

export function Footer({
  siteName,
  legalName,
  tagline,
  logoUrl,
  columns,
  legalLinks,
  bottomText,
  contact,
  linkedin,
}: {
  siteName: string
  legalName?: string | null
  tagline?: string | null
  logoUrl?: string | null
  columns: { title: string; links: NavItem[] }[]
  legalLinks: NavItem[]
  bottomText?: string | null
  contact: { email?: string | null; phone?: string | null; address?: string | null; mapUrl?: string | null }
  linkedin?: string | null
}) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy-950 text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${siteName} home`}>
            {logoUrl ? <Image src={logoUrl} alt={siteName} width={140} height={36} className="h-9 w-auto brightness-0 invert" unoptimized /> : <span className="font-display text-xl font-bold">{siteName}</span>}
          </Link>
          {tagline ? <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{tagline}</p> : null}
          <ul className="mt-6 space-y-2.5 text-sm text-white/75">
            {contact.email ? (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden />
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
            ) : null}
            {contact.phone ? (
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden />
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
            ) : null}
            {contact.address ? (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden />
                {contact.mapUrl ? (
                  <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="whitespace-pre-line hover:text-white">
                    {contact.address}
                  </a>
                ) : (
                  <span className="whitespace-pre-line">{contact.address}</span>
                )}
              </li>
            ) : null}
          </ul>
          {linkedin ? (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 hover:text-white">
              Follow on LinkedIn <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div className="grid gap-8 sm:grid-cols-3 lg:col-span-5">
          {columns.map((col, i) => (
            <div key={i}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link href={l.href} className="text-sm text-white/80 hover:text-white" target={l.newTab ? '_blank' : undefined}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Stay updated</h3>
          <p className="mt-4 text-sm text-white/70">New resins, performance data and application notes — a few emails a year.</p>
          <div className="mt-4">
            <NewsletterForm compact onDark />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {legalName || siteName}. {bottomText}
          </p>
          <ul className="flex flex-wrap gap-4">
            {legalLinks.map((l, i) => (
              <li key={i}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/llms.txt" className="hover:text-white" title="Machine-readable site summary for AI assistants">
                For AI assistants
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

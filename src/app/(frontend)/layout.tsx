import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import * as React from 'react'
import { MessageCircle } from 'lucide-react'
import { Header, type NavItem } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getFooter, getHeader, getSiteSettings } from '@/lib/data'
import { mediaUrl, resolveLink, SITE_URL, type LinkValue } from '@/lib/utils'
import { organizationJsonLd, JsonLd } from '@/lib/jsonld'
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import './globals.css'

// Pages render on demand against the cached data layer (src/lib/data.ts), so Docker builds never
// need database access and every edit in the admin is live immediately via tag revalidation.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  const og = mediaUrl(s.ogImage, 'og')
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.titleSuffix || s.name || 'Protpure', template: `%s | ${s.name || 'Protpure'}` },
    description: s.description || undefined,
    openGraph: { siteName: s.name || 'Protpure', type: 'website', images: og ? [{ url: og }] : undefined },
    twitter: { card: 'summary_large_image' },
    alternates: { types: { 'application/rss+xml': `${SITE_URL}/blog/rss.xml` } },
  }
}

function toNav(items: { link?: LinkValue | null; children?: { link?: LinkValue | null; description?: string | null }[] | null }[] | null | undefined): NavItem[] {
  return (items ?? [])
    .map((it) => {
      const r = resolveLink(it.link)
      if (!r) return null
      return {
        href: r.href,
        label: r.label,
        newTab: r.newTab,
        children: (it.children ?? [])
          .map((c) => {
            const cr = resolveLink(c.link)
            return cr ? { href: cr.href, label: cr.label, description: c.description } : null
          })
          .filter(Boolean) as NavItem['children'],
      }
    })
    .filter(Boolean) as NavItem[]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, header, footer, { isEnabled: isDraft }] = await Promise.all([getSiteSettings(), getHeader(), getFooter(), draftMode()])
  // Real intrinsic size of the logo file (the wordmark SVG is 508×179, 2.84:1) so next/image keeps its aspect.
  const logoUrl = mediaUrl(settings.logo)
  const logoMedia = settings.logo && typeof settings.logo === 'object' ? settings.logo : null
  const logo = logoUrl ? { url: logoUrl, width: logoMedia?.width || 128, height: logoMedia?.height || 45 } : null
  const cta = resolveLink(header.cta?.link)
  const announcementLink = resolveLink(settings.announcement?.link)

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {isDraft ? (
          <div className="bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-amber-950">
            Preview mode — showing draft content.{' '}
            <Link href="/next/exit-preview" className="underline" prefetch={false}>
              Exit preview
            </Link>
          </div>
        ) : null}
        <Header
          items={toNav(header.items)}
          cta={cta ? { href: cta.href, label: cta.label } : { href: '/request-quote', label: 'Request a quote' }}
          logo={logo}
          siteName={settings.name || 'Protpure'}
          announcement={settings.announcement?.enabled && settings.announcement.text ? { text: settings.announcement.text, href: announcementLink?.href } : null}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer
          siteName={settings.name || 'Protpure'}
          legalName={settings.legalName}
          tagline={footer.tagline}
          logo={logo}
          columns={(footer.columns ?? []).map((c) => ({ title: c.title, links: toNav((c.links ?? []).map((l) => ({ link: l.link }))) }))}
          legalLinks={toNav((footer.legalLinks ?? []).map((l) => ({ link: l.link })))}
          bottomText={footer.bottomText}
          contact={{ email: settings.email, phone: settings.phone, address: settings.address, mapUrl: settings.mapUrl }}
          linkedin={settings.social?.linkedin}
        />
        {settings.whatsapp ? (
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover transition hover:scale-105"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        ) : null}
        <JsonLd data={organizationJsonLd(settings)} />
      </body>
    </html>
  )
}

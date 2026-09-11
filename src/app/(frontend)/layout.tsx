import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import * as React from 'react'
import { Header, type NavItem } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BasketProvider } from '@/components/rfq/BasketProvider'
import { BasketDrawer } from '@/components/rfq/BasketDrawer'
import { getFooter, getHeader, getSiteSettings } from '@/lib/data'
import { mediaUrl, resolveLink, SITE_URL, type LinkValue } from '@/lib/utils'
import { OrganizationJsonLd } from '@/components/OrganizationJsonLd'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/dm-sans'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
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
        {/* RFQ basket state (localStorage) is shared by the header button, product cards and the quote form. */}
        <BasketProvider>
          {isDraft ? (
            <div className="bg-[#f3d9a4] px-4 py-1.5 text-center text-[12px] font-medium text-[#4a3306]">
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
            tagline={header.tagline}
            announcement={settings.announcement?.enabled && settings.announcement.text ? { text: settings.announcement.text, href: announcementLink?.href } : null}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer
            siteName={settings.name || 'Protpure'}
            legalName={settings.legalName}
            tagline={footer.tagline}
            columns={(footer.columns ?? []).map((c) => ({ title: c.title, links: toNav((c.links ?? []).map((l) => ({ link: l.link }))) }))}
            legalLinks={toNav((footer.legalLinks ?? []).map((l) => ({ link: l.link })))}
            bottomText={footer.bottomText}
            newsletter={footer.newsletter}
            contact={{ email: settings.email, phone: settings.phone, address: settings.address, mapUrl: settings.mapUrl, city: settings.city, country: settings.country }}
            linkedin={settings.social?.linkedin}
          />
          <BasketDrawer />
          {settings.whatsapp ? (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="fixed right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-rule-dark bg-field-raised text-teal-lum transition-colors hover:bg-field" style={{ bottom: 'calc(20px + env(safe-area-inset-bottom))' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                <path d="M21 12a9 9 0 0 1-13.2 7.9L3 21l1.2-4.6A9 9 0 1 1 21 12Z" />
                <path d="M9 10.5c.3 1.6 1.7 3.1 3.4 3.6l1-1 2 .9c-.3 1.3-1.3 1.9-2.6 1.6a7.6 7.6 0 0 1-5.1-5.2c-.3-1.3.4-2.3 1.7-2.5l.8 2z" />
              </svg>
            </a>
          ) : null}
        </BasketProvider>
        <OrganizationJsonLd settings={settings} />
      </body>
    </html>
  )
}

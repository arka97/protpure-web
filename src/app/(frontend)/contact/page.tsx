import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { QuoteCta } from '@/components/rfq/BasketButton'
import { Chapter } from '@/components/visual/Chapter'
import { ArrowUpRightIcon, ChatIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/visual/icons'
import { getPage, getProducts, getSiteSettings } from '@/lib/data'
import { toBasketProduct } from '@/lib/rfq'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('contact')
  return buildMetadata({ meta: page?.meta, title: 'Contact — talk to a scientist', description: page?.hero?.text || 'Talk to Protpure scientists about resins, evaluations, distribution and technical questions.', path: '/contact' })
}

export default async function ContactPage() {
  const [page, products, settings] = await Promise.all([getPage('contact'), getProducts(), getSiteSettings()])
  const options = products.map(toBasketProduct)
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Contact' }]
  const rows = [
    settings.email ? { key: 'email', label: 'Email', icon: MailIcon, value: <a href={`mailto:${settings.email}`} className="hover:text-teal-deep">{settings.email}</a> } : null,
    settings.phone ? { key: 'phone', label: 'Phone', icon: PhoneIcon, value: <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="mono hover:text-teal-deep">{settings.phone}</a> } : null,
    settings.whatsapp
      ? {
          key: 'whatsapp',
          label: 'WhatsApp',
          icon: ChatIcon,
          value: (
            <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-teal-deep">
              Chat on WhatsApp <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          ),
        }
      : null,
    settings.address
      ? {
          key: 'address',
          label: 'Manufacturing & R&D',
          icon: MapPinIcon,
          value: (
            <>
              <span className="block whitespace-pre-line">{settings.address}</span>
              {settings.mapUrl ? (
                <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link mt-3 text-[12px]">
                  Open in maps <ArrowUpRightIcon />
                </a>
              ) : null}
            </>
          ),
        }
      : null,
    settings.hours ? { key: 'hours', label: 'Hours', icon: ClockIcon, value: <span className="num">{settings.hours}</span> } : null,
  ].filter((r): r is NonNullable<typeof r> => r !== null)

  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Contact', title: 'Talk to a scientist, not a call centre', highlight: 'not a call centre', text: 'Questions about a resin, an evaluation, documentation or distribution — write to us and a member of the technical team will reply.' }} breadcrumbs={crumbs} />
      <Chapter id="contact" aria-label="Contact details and form">
        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px]">
          <div>
            <dl className="border-t border-rule-strong">
              {rows.map((r) => {
                const Icon = r.icon
                return (
                  <div key={r.key} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 border-b border-rule py-4">
                    <Icon className="mt-0.5 h-5 w-5 text-teal-deep" />
                    <div className="min-w-0">
                      <dt className="eyebrow text-[10px] tracking-[0.12em]">{r.label}</dt>
                      <dd className="mt-1.5 text-[13px] leading-[1.6] text-ink lg:text-[14px]">{r.value}</dd>
                    </div>
                  </div>
                )
              })}
            </dl>
            {/* Pricing is by quotation: the RFQ basket is the path for prices, this form for everything else. */}
            <div className="mt-6 border border-[#b6cfc4] bg-tint p-5 text-tint-ink">
              <p className="eyebrow text-[10px] tracking-[0.12em] text-[#174c46]">Looking for prices?</p>
              <p className="mt-2 text-[13px] leading-[1.6]">Pricing is by quotation. Add products, grades and pack sizes to the RFQ basket and send one request; a scientist replies {settings.responseTime || 'within 1–2 business days'}.</p>
              <QuoteCta href="/request-quote" label="Request a quote" className="btn-ink btn-sm mt-4" withArrow />
            </div>
          </div>
          <div className="border border-rule bg-white p-5 sm:p-8">
            <Suspense>
              <InquiryForm type="contact" products={options} responseTime={settings.responseTime} />
            </Suspense>
          </div>
        </div>
      </Chapter>
      <RenderBlocks blocks={page?.layout} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? '/contact' })))} />
    </>
  )
}

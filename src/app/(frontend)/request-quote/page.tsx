import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { ClipboardIcon, ClockIcon, GlobeIcon, ShieldIcon } from '@/components/visual/icons'
import { getPage, getProducts, getSiteSettings } from '@/lib/data'
import { SAMPLE_KIT_POLICY, toBasketProduct } from '@/lib/rfq'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('request-quote')
  return buildMetadata({ meta: page?.meta, title: 'Request a quote', description: page?.hero?.text || 'Get pricing, lead time and shipping options for Protpure agarose chromatography resins, pre-packed columns and services.', path: '/request-quote' })
}

/**
 * The one quote form: the RFQ basket lines (grade · pack · quantity · purpose) followed by the
 * contact fields. `?product=ID` pre-adds lines; `?type=evaluation` marks them as paid sample kits.
 */
export default async function RequestQuotePage() {
  const [page, products, settings] = await Promise.all([getPage('request-quote'), getProducts(), getSiteSettings()])
  const options = products.map(toBasketProduct)
  const steps = [
    { icon: ClipboardIcon, title: 'Tell us what you need', text: 'Add products to your RFQ basket with grade, pack size and whether you need a sample kit or production volume — one request covers all of them.' },
    { icon: ClockIcon, title: `We reply ${settings.responseTime || 'within 1–2 business days'}`, text: 'A scientist reviews every request. You get pricing, lead time and documentation, not a brochure.' },
    { icon: GlobeIcon, title: 'Shipped worldwide', text: settings.globalStatement || 'Ex-works from Anand, India; we work with your forwarder or ours.' },
    { icon: ShieldIcon, title: 'Paid sample kits, credited later', text: SAMPLE_KIT_POLICY },
  ]
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Get a quotation', title: 'Request a quote', text: 'Pricing is by quotation so we can match grade, pack size and destination. Review the items in your basket, tell us what you are purifying and we come back with one proposal.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Request a quote' }]} />
      <section className="bg-surface pb-16 pt-10 lg:pb-20 lg:pt-14">
        <div className="container-x grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px]">
          <aside className="order-2 lg:order-1">
            <p className="eyebrow mb-5">How it works</p>
            <ol className="divide-y divide-rule border-y border-rule">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4 py-5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-rule text-teal-deep">
                    <s.icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium leading-[1.4] text-ink">
                      <span className="mono mr-2 text-[11px] text-text-2">{String(i + 1).padStart(2, '0')}</span>
                      {s.title}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-text-2">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {settings.email ? (
              <p className="mt-6 text-[13px] leading-[1.6] text-text-2">
                Prefer email?{' '}
                <a href={`mailto:${settings.email}`} className="font-medium text-ink underline decoration-rule underline-offset-4 hover:text-teal-deep">
                  {settings.email}
                </a>
                {settings.phone ? (
                  <>
                    {' · '}
                    <span className="mono">{settings.phone}</span>
                  </>
                ) : null}
              </p>
            ) : null}
          </aside>
          <div className="order-1 min-w-0 lg:order-2">
            <div className="card p-5 sm:p-8 lg:p-10">
              <Suspense>
                <InquiryForm type="quote" products={options} responseTime={settings.responseTime} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <RenderBlocks blocks={page?.layout} />
    </>
  )
}

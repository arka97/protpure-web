import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Clock, FileCheck, Globe2, ShieldCheck } from 'lucide-react'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { getPage, getProducts, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import type { ProductCategory } from '@/payload-types'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('request-quote')
  return buildMetadata({ meta: page?.meta, title: 'Request a quote', description: page?.hero?.text || 'Get pricing, lead time and shipping options for Protpure agarose chromatography resins, pre-packed columns and services.', path: '/request-quote' })
}

export default async function RequestQuotePage() {
  const [page, products, settings] = await Promise.all([getPage('request-quote'), getProducts(), getSiteSettings()])
  const options = products.map((p) => ({ id: p.id, name: p.name, category: (p.category as ProductCategory)?.name ?? 'Products' }))
  const steps = [
    { icon: FileCheck, title: 'Tell us what you need', text: 'Products, grades, volumes and where you are — that’s enough to start.' },
    { icon: Clock, title: `We reply ${settings.responseTime || 'within 1–2 business days'}`, text: 'A scientist reviews every request. You get pricing, lead time and documentation, not a brochure.' },
    { icon: Globe2, title: 'Shipped worldwide', text: settings.globalStatement || 'Ex-works from Anand, India; we work with your forwarder or ours.' },
    { icon: ShieldCheck, title: 'Documentation included', text: 'Datasheets and certificates of analysis for qualification; custom documentation on request.' },
  ]
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Get a quotation', title: 'Request a quote', text: 'Pricing is by quotation so we can match grade, pack size and destination. Tell us what you are purifying and we will come back with a proposal.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Request a quote' }]} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-4">
            <ol className="space-y-6">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{s.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {settings.email ? (
              <p className="mt-8 text-sm text-muted">
                Prefer email? <a href={`mailto:${settings.email}`} className="font-medium text-navy-900 hover:underline">{settings.email}</a>
                {settings.phone ? <> · {settings.phone}</> : null}
              </p>
            ) : null}
          </div>
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="card p-6 sm:p-8">
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

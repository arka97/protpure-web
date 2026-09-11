import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Mail, MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { getPage, getProducts, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { categoryOf } from '@/lib/catalog'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('contact')
  return buildMetadata({ meta: page?.meta, title: 'Contact', description: page?.hero?.text || 'Talk to Protpure scientists about resins, evaluations, distribution and technical questions.', path: '/contact' })
}

export default async function ContactPage() {
  const [page, products, settings] = await Promise.all([getPage('contact'), getProducts(), getSiteSettings()])
  const options = products.map((p) => ({ id: p.id, name: p.name, category: categoryOf(p)?.name ?? 'Products' }))
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Contact', title: 'Talk to a scientist, not a call centre', text: 'Questions about a resin, an evaluation, documentation or distribution — write to us and a member of the technical team will reply.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ul className="space-y-5 text-sm">
              {settings.email ? (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
                  <div>
                    <p className="font-semibold text-navy-900">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-ink-soft hover:text-navy-900">{settings.email}</a>
                  </div>
                </li>
              ) : null}
              {settings.phone ? (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
                  <div>
                    <p className="font-semibold text-navy-900">Phone</p>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-ink-soft hover:text-navy-900">{settings.phone}</a>
                  </div>
                </li>
              ) : null}
              {settings.whatsapp ? (
                <li className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
                  <div>
                    <p className="font-semibold text-navy-900">WhatsApp</p>
                    <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-ink-soft hover:text-navy-900">{settings.whatsapp}</a>
                  </div>
                </li>
              ) : null}
              {settings.address ? (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
                  <div>
                    <p className="font-semibold text-navy-900">Manufacturing & R&D</p>
                    <p className="whitespace-pre-line text-ink-soft">{settings.address}</p>
                    {settings.mapUrl ? <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-medium text-navy-900 hover:underline">Open in maps ↗</a> : null}
                  </div>
                </li>
              ) : null}
              {settings.hours ? (
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
                  <div>
                    <p className="font-semibold text-navy-900">Hours</p>
                    <p className="text-ink-soft">{settings.hours}</p>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <div className="card p-6 sm:p-8">
              <Suspense>
                <InquiryForm type="contact" products={options} responseTime={settings.responseTime} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <RenderBlocks blocks={page?.layout} />
    </>
  )
}

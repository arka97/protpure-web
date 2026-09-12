import type { Metadata } from 'next'
import { StatusPage } from '@/components/StatusPage'
import { getPayloadClient } from '@/lib/data'
import { sendNewsletterWelcome } from '@/emails/send'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Confirm subscription', robots: { index: false } }

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  let ok = false
  if (token) {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'subscribers', where: { token: { equals: token } }, limit: 1, overrideAccess: true })
    const sub = res.docs[0]
    if (sub) {
      if (sub.status !== 'confirmed') {
        const updated = await payload.update({ collection: 'subscribers', id: sub.id, data: { status: 'confirmed', confirmedAt: new Date().toISOString() }, overrideAccess: true })
        await sendNewsletterWelcome({ payload, subscriber: updated })
      }
      ok = true
    }
  }
  return ok ? (
    <StatusPage eyebrow="Newsletter" heading="Subscription *confirmed.*" text="Thanks — you will hear from us when there is something worth reading: product updates, performance data and technical notes." links={[{ href: '/blog', label: 'Notes from the bench', appearance: 'primary' }, { href: '/', label: 'Back to homepage', appearance: 'secondary' }]} />
  ) : (
    <StatusPage tone="attention" eyebrow="Newsletter" heading="This link is *not valid.*" text="The confirmation link may have expired or was already used. Subscribe again from the footer and we will send a fresh one." links={[{ href: '/#newsletter', label: 'Subscribe again', appearance: 'primary' }, { href: '/contact', label: 'Contact us', appearance: 'secondary' }]} />
  )
}

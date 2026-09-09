import type { Metadata } from 'next'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
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
  return (
    <section className="section">
      <div className="container-x max-w-xl text-center">
        {ok ? <CircleCheck className="mx-auto h-12 w-12 text-teal-500" /> : <TriangleAlert className="mx-auto h-12 w-12 text-amber-500" />}
        <h1 className="heading-2 mt-6">{ok ? 'Subscription confirmed' : 'This link is not valid'}</h1>
        <p className="mt-3 text-ink-soft">{ok ? 'Thanks — you will hear from us when there is something worth reading.' : 'The confirmation link may have expired. Please subscribe again from the footer.'}</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/">Back to homepage</ButtonLink>
        </div>
      </div>
    </section>
  )
}

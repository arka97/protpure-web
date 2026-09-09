import type { Metadata } from 'next'
import { CircleCheck } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { getPayloadClient } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false } }

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  if (token) {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'subscribers', where: { token: { equals: token } }, limit: 1, overrideAccess: true })
    if (res.docs[0]) await payload.update({ collection: 'subscribers', id: res.docs[0].id, data: { status: 'unsubscribed' }, overrideAccess: true })
  }
  return (
    <section className="section">
      <div className="container-x max-w-xl text-center">
        <CircleCheck className="mx-auto h-12 w-12 text-teal-500" />
        <h1 className="heading-2 mt-6">You’re unsubscribed</h1>
        <p className="mt-3 text-ink-soft">You will not receive further newsletters. Transactional emails about your inquiries are unaffected.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/">Back to homepage</ButtonLink>
        </div>
      </div>
    </section>
  )
}

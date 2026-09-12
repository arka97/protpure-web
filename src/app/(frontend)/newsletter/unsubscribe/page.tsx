import type { Metadata } from 'next'
import { StatusPage } from '@/components/StatusPage'
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
  return <StatusPage eyebrow="Newsletter" heading="You’re *unsubscribed.*" text="You will not receive further newsletters. Transactional emails about your inquiries and quotes are unaffected." links={[{ href: '/', label: 'Back to homepage', appearance: 'primary' }, { href: '/products', label: 'Browse the catalogue', appearance: 'secondary' }]} />
}

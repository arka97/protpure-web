'use server'

import { headers } from 'next/headers'
import { randomBytes } from 'crypto'
import { getPayloadClient } from '@/lib/data'
import { createInquiry, inquirySchema, rateLimit } from '@/lib/inquiries'
import { sendNewsletterConfirm } from '@/emails/send'

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string>; id?: number | string } | null

/** The RFQ basket posts its lines as one JSON field (`items`); anything unparsable is ignored and validated as "no items". */
function parseItems(raw: FormDataEntryValue | null): unknown {
  if (typeof raw !== 'string' || !raw.trim()) return undefined
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : undefined
  } catch {
    return undefined
  }
}

async function requestMeta() {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? '').split(',')[0].trim() || null
  return { ip, userAgent: h.get('user-agent') }
}

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bots fill every field.
  if (formData.get('website')) return { ok: true, message: 'Thanks — we have received your request.' }

  // Fields a given form variant does not render come back as null; treat them as absent.
  const field = (k: string) => formData.get(k) ?? undefined
  const raw = {
    type: field('type'),
    name: field('name'),
    email: field('email'),
    organization: field('organization'),
    jobTitle: field('jobTitle'),
    phone: field('phone'),
    country: field('country'),
    items: parseItems(formData.get('items')),
    productIds: formData.getAll('productIds').filter(Boolean),
    requestedItems: field('requestedItems'),
    application: field('application'),
    message: field('message'),
    consent: formData.get('consent') === 'on',
    pageUrl: field('pageUrl'),
  }
  const parsed = inquirySchema.safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message
    return { ok: false, message: 'Please check the highlighted fields.', errors }
  }
  if (!parsed.data.consent) return { ok: false, message: 'Please confirm we may contact you about your request.', errors: { consent: 'Required' } }

  const meta = await requestMeta()
  if (!rateLimit(`inquiry:${meta.ip ?? 'anon'}`)) return { ok: false, message: 'Too many requests from this network. Please try again in a few minutes or email us directly.' }

  try {
    const payload = await getPayloadClient()
    const doc = await createInquiry(payload, parsed.data, { source: 'website', ...meta })
    const n = doc.items?.length ?? 0
    return { ok: true, id: doc.id, message: `Thank you. Your reference is #${doc.id}${n ? ` (${n} item${n === 1 ? '' : 's'})` : ''}. We have emailed a confirmation and will reply shortly.` }
  } catch (err) {
    console.error('[inquiry] failed', err)
    return { ok: false, message: 'Something went wrong on our side. Please email us directly and we will help right away.' }
  }
}

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get('website')) return { ok: true, message: 'Check your inbox to confirm.' }
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, message: 'Please enter a valid email address.' }

  const meta = await requestMeta()
  if (!rateLimit(`subscribe:${meta.ip ?? 'anon'}`, 5)) return { ok: false, message: 'Too many attempts. Please try again later.' }

  try {
    const payload = await getPayloadClient()
    const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
    let sub = existing.docs[0]
    if (sub?.status === 'confirmed') return { ok: true, message: 'You are already subscribed — thank you.' }
    const token = randomBytes(24).toString('hex')
    if (sub) {
      sub = await payload.update({ collection: 'subscribers', id: sub.id, data: { token, status: 'pending' }, overrideAccess: true })
    } else {
      sub = await payload.create({ collection: 'subscribers', data: { email, token, status: 'pending', source: 'website' }, overrideAccess: true })
    }
    await sendNewsletterConfirm({ payload, subscriber: sub })
    return { ok: true, message: 'Almost done — please check your inbox and confirm your subscription.' }
  } catch (err) {
    console.error('[newsletter] failed', err)
    return { ok: false, message: 'Something went wrong. Please try again later.' }
  }
}

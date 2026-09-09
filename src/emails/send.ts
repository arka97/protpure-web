import type { Payload } from 'payload'
import { render } from '@react-email/components'
import { InquiryConfirmation, InquiryNotification, NewsletterConfirm, NewsletterWelcome, type InquiryEmailData } from './templates'
import type { Brand } from './Layout'
import { INQUIRY_TYPES } from '@/collections/Inquiries'
import type { Inquiry, Product, Subscriber } from '@/payload-types'
import { absoluteUrl, mediaUrl } from '@/lib/utils'

export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export async function getBrand(payload: Payload): Promise<Brand & { notificationEmails: string[]; replyTo?: string | null; fromName: string; responseTime: string }> {
  const s = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  const logoPath = mediaUrl(s.logo)
  return {
    name: s.name || 'Protpure',
    legalName: s.legalName,
    siteUrl: SITE_URL,
    logoUrl: logoPath ? absoluteUrl(logoPath) : null,
    address: s.address,
    email: s.email,
    phone: s.phone,
    linkedin: s.social?.linkedin,
    notificationEmails: (s.notificationEmails ?? []).map((e) => e.email).filter(Boolean),
    replyTo: s.replyTo,
    fromName: s.fromName || 'Protpure Tech',
    responseTime: s.responseTime || 'within 1–2 business days',
  }
}

async function safeSend(payload: Payload, opts: Parameters<Payload['sendEmail']>[0], label: string) {
  try {
    await payload.sendEmail(opts)
    payload.logger.info(`[email] sent ${label} → ${String(opts.to)}`)
  } catch (err) {
    payload.logger.error({ err, msg: `[email] failed ${label}` })
  }
}

export async function sendInquiryEmails({ payload, inquiry }: { payload: Payload; inquiry: Inquiry }) {
  const brand = await getBrand(payload)
  const products = (inquiry.products ?? []).map((p) => (typeof p === 'object' ? (p as Product).name : String(p)))
  const data: InquiryEmailData = {
    id: inquiry.id,
    type: inquiry.type,
    typeLabel: INQUIRY_TYPES.find((t) => t.value === inquiry.type)?.label ?? 'Inquiry',
    name: inquiry.name,
    email: inquiry.email,
    organization: inquiry.organization,
    jobTitle: inquiry.jobTitle,
    phone: inquiry.phone,
    country: inquiry.country,
    productNames: products,
    requestedItems: inquiry.requestedItems,
    application: inquiry.application,
    message: inquiry.message,
    source: inquiry.meta?.source,
    pageUrl: inquiry.meta?.pageUrl,
    responseTime: brand.responseTime,
    adminUrl: `${SITE_URL}/admin/collections/inquiries/${inquiry.id}`,
  }

  await safeSend(
    payload,
    {
      to: inquiry.email,
      subject: `${brand.name}: we've received your ${data.typeLabel.toLowerCase()} (#${inquiry.id})`,
      html: await render(InquiryConfirmation({ brand, data })),
      replyTo: brand.replyTo || brand.email || undefined,
    },
    'inquiry confirmation',
  )

  if (brand.notificationEmails.length) {
    await safeSend(
      payload,
      {
        to: brand.notificationEmails,
        subject: `[${data.typeLabel}] ${inquiry.name}${inquiry.organization ? ` · ${inquiry.organization}` : ''}${inquiry.country ? ` · ${inquiry.country}` : ''}`,
        html: await render(InquiryNotification({ brand, data })),
        replyTo: inquiry.email,
      },
      'inquiry notification',
    )
  }
}

export async function sendNewsletterConfirm({ payload, subscriber }: { payload: Payload; subscriber: Subscriber }) {
  const brand = await getBrand(payload)
  const confirmUrl = `${SITE_URL}/newsletter/confirm?token=${subscriber.token}`
  await safeSend(
    payload,
    { to: subscriber.email, subject: `Confirm your subscription to ${brand.name} updates`, html: await render(NewsletterConfirm({ brand, confirmUrl })) },
    'newsletter confirm',
  )
}

export async function sendNewsletterWelcome({ payload, subscriber }: { payload: Payload; subscriber: Subscriber }) {
  const brand = await getBrand(payload)
  const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe?token=${subscriber.token}`
  await safeSend(
    payload,
    { to: subscriber.email, subject: `You're subscribed to ${brand.name} updates`, html: await render(NewsletterWelcome({ brand, unsubscribeUrl })) },
    'newsletter welcome',
  )
}

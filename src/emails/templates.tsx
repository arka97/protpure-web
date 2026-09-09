import * as React from 'react'
import { Button, Section, Text } from '@react-email/components'
import { EmailLayout, Field, styles, type Brand } from './Layout'

export type InquiryEmailData = {
  id: string | number
  type: string
  typeLabel: string
  name: string
  email: string
  organization?: string | null
  jobTitle?: string | null
  phone?: string | null
  country?: string | null
  productNames: string[]
  requestedItems?: string | null
  application?: string | null
  message?: string | null
  source?: string | null
  pageUrl?: string | null
  responseTime: string
  adminUrl: string
}

const intro: Record<string, string> = {
  quote: 'Thank you for your quote request. Our team is reviewing the products and quantities you listed and will reply with pricing, lead time and shipping options',
  evaluation: 'Thank you for your interest in evaluating Protpure resins. A scientist from our team will get in touch to discuss your process and the most suitable evaluation format',
  technical: 'Thank you for your question. One of our application scientists will review it and reply',
  partnership: 'Thank you for your interest in partnering with Protpure. Our team will review your message and get back to you',
  contact: 'Thank you for contacting Protpure. We have received your message and will reply',
}

export function InquiryConfirmation({ brand, data }: { brand: Brand; data: InquiryEmailData }) {
  const lead = intro[data.type] ?? intro.contact
  return (
    <EmailLayout brand={brand} preview={`We received your ${data.typeLabel.toLowerCase()}`} heading={`We've received your ${data.typeLabel.toLowerCase()}`}>
      <Text style={styles.p}>Dear {data.name},</Text>
      <Text style={styles.p}>{lead} {data.responseTime}.</Text>
      <Text style={styles.p}>For your records, here is a summary of what you sent us:</Text>
      <Section style={{ backgroundColor: '#f8fafc', borderRadius: 8, padding: '4px 16px 16px' }}>
        <Field label="Reference" value={`#${data.id}`} />
        <Field label="Products" value={data.productNames.join(', ')} />
        <Field label="Requested items" value={data.requestedItems} />
        <Field label="Application" value={data.application} />
        <Field label="Message" value={data.message} />
        <Field label="Organisation" value={[data.organization, data.country].filter(Boolean).join(', ')} />
      </Section>
      <Text style={{ ...styles.p, marginTop: 18 }}>
        If you need to add anything, simply reply to this email and quote reference #{data.id}.
      </Text>
      <Text style={styles.p}>
        Best regards,
        <br />
        The {brand.name} team
      </Text>
    </EmailLayout>
  )
}

export function InquiryNotification({ brand, data }: { brand: Brand; data: InquiryEmailData }) {
  return (
    <EmailLayout brand={brand} preview={`${data.typeLabel} from ${data.name}${data.organization ? ` (${data.organization})` : ''}`} heading={`New ${data.typeLabel.toLowerCase()} #${data.id}`}>
      <Section style={{ backgroundColor: '#f8fafc', borderRadius: 8, padding: '4px 16px 16px' }}>
        <Field label="Name" value={data.name} />
        <Field label="Email" value={data.email} />
        <Field label="Organisation" value={[data.organization, data.jobTitle].filter(Boolean).join(' · ')} />
        <Field label="Phone" value={data.phone} />
        <Field label="Country" value={data.country} />
        <Field label="Products" value={data.productNames.join(', ')} />
        <Field label="Requested items" value={data.requestedItems} />
        <Field label="Application" value={data.application} />
        <Field label="Message" value={data.message} />
        <Field label="Source" value={[data.source, data.pageUrl].filter(Boolean).join(' · ')} />
      </Section>
      <Section style={{ marginTop: 20 }}>
        <Button href={data.adminUrl} style={styles.button}>Open in admin</Button>
      </Section>
      <Text style={{ ...styles.muted, marginTop: 16 }}>Reply directly to this email to answer {data.name}.</Text>
    </EmailLayout>
  )
}

export function NewsletterConfirm({ brand, confirmUrl }: { brand: Brand; confirmUrl: string }) {
  return (
    <EmailLayout brand={brand} preview="Confirm your subscription" heading="Confirm your subscription">
      <Text style={styles.p}>Thanks for subscribing to updates from {brand.name}: new resins, technical notes and case studies, a few times a year.</Text>
      <Text style={styles.p}>Please confirm your email address to complete the subscription:</Text>
      <Section style={{ margin: '8px 0 20px' }}>
        <Button href={confirmUrl} style={styles.button}>Confirm subscription</Button>
      </Section>
      <Text style={styles.muted}>If you did not request this, you can ignore this email and you will not be subscribed.</Text>
    </EmailLayout>
  )
}

export function NewsletterWelcome({ brand, unsubscribeUrl }: { brand: Brand; unsubscribeUrl: string }) {
  return (
    <EmailLayout brand={brand} preview="You're subscribed" heading="You're subscribed">
      <Text style={styles.p}>Your subscription is confirmed. We&apos;ll only write when there&apos;s something worth reading: new products, performance data and application notes.</Text>
      <Section style={{ margin: '8px 0 20px' }}>
        <Button href={`${brand.siteUrl}/products`} style={styles.button}>Browse the catalog</Button>
      </Section>
      <Text style={styles.muted}>You can unsubscribe at any time: <a href={unsubscribeUrl} style={{ color: '#6b7280' }}>unsubscribe</a>.</Text>
    </EmailLayout>
  )
}

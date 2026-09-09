import * as React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components'

export type Brand = {
  name: string
  legalName?: string | null
  siteUrl: string
  logoUrl?: string | null
  address?: string | null
  email?: string | null
  phone?: string | null
  linkedin?: string | null
}

const colors = { navy: '#0b2545', teal: '#0fa3a3', text: '#1f2937', muted: '#6b7280', border: '#e5e7eb', bg: '#f4f6f8' }

export const styles = {
  body: { backgroundColor: colors.bg, fontFamily: 'Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', margin: 0, padding: '24px 0' },
  container: { backgroundColor: '#ffffff', border: `1px solid ${colors.border}`, borderRadius: 12, maxWidth: 600, margin: '0 auto', padding: '32px 36px' },
  h1: { color: colors.navy, fontSize: 22, fontWeight: 700, margin: '0 0 16px', lineHeight: '30px' },
  p: { color: colors.text, fontSize: 15, lineHeight: '24px', margin: '0 0 14px' },
  muted: { color: colors.muted, fontSize: 13, lineHeight: '20px', margin: '0 0 8px' },
  label: { color: colors.muted, fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '14px 0 2px' },
  value: { color: colors.text, fontSize: 15, lineHeight: '22px', margin: 0, whiteSpace: 'pre-wrap' as const },
  button: { backgroundColor: colors.teal, borderRadius: 8, color: '#ffffff', display: 'inline-block', fontSize: 15, fontWeight: 600, padding: '12px 20px', textDecoration: 'none' },
  hr: { borderColor: colors.border, margin: '24px 0' },
  footer: { color: colors.muted, fontSize: 12, lineHeight: '18px', margin: '0 0 4px' },
}

export function EmailLayout({ brand, preview, heading, children }: { brand: Brand; preview: string; heading: string; children: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {brand.logoUrl ? (
            <Img src={brand.logoUrl} alt={brand.name} height={36} style={{ marginBottom: 20 }} />
          ) : (
            <Text style={{ ...styles.h1, fontSize: 18, marginBottom: 20 }}>{brand.name}</Text>
          )}
          <Heading style={styles.h1}>{heading}</Heading>
          {children}
          <Hr style={styles.hr} />
          <Section>
            <Text style={styles.footer}>{brand.legalName || brand.name}{brand.address ? ` · ${brand.address.replace(/\n/g, ', ')}` : ''}</Text>
            <Text style={styles.footer}>
              {brand.email ? <Link href={`mailto:${brand.email}`} style={{ color: colors.muted }}>{brand.email}</Link> : null}
              {brand.phone ? ` · ${brand.phone}` : ''}
              {' · '}
              <Link href={brand.siteUrl} style={{ color: colors.muted }}>{brand.siteUrl.replace(/^https?:\/\//, '')}</Link>
              {brand.linkedin ? <> · <Link href={brand.linkedin} style={{ color: colors.muted }}>LinkedIn</Link></> : null}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </>
  )
}

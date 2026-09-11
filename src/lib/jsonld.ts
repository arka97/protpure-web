import * as React from 'react'
import { categoryOf } from './catalog'
import type { Application, Post, Product, SiteSetting, Faq } from '@/payload-types'
import { absoluteUrl, mediaUrl, SITE_URL } from './utils'
import { lexicalToText } from './lexical-md'

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return React.createElement('script', { type: 'application/ld+json', dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, '\\u003c') } })
}

export function organizationJsonLd(s: SiteSetting) {
  const logo = mediaUrl(s.logo)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: s.name || 'Protpure',
      legalName: s.legalName || undefined,
      url: SITE_URL,
      logo: logo ? absoluteUrl(logo) : undefined,
      description: s.description || undefined,
      foundingDate: s.foundedYear ? String(s.foundedYear) : undefined,
      email: s.email || undefined,
      telephone: s.phone || undefined,
      address: s.address
        ? { '@type': 'PostalAddress', streetAddress: s.address.replace(/\n/g, ', '), addressLocality: s.city || undefined, addressRegion: s.region || undefined, addressCountry: s.country || 'IN' }
        : undefined,
      sameAs: [s.social?.linkedin, s.social?.youtube, s.social?.x].filter(Boolean),
      knowsAbout: ['Agarose chromatography resins', 'Ion exchange chromatography', 'Immobilized metal affinity chromatography', 'Size exclusion chromatography', 'Downstream bioprocessing'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: s.name || 'Protpure',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/products?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
    },
  ]
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  }
}

export function productJsonLd(p: Product) {
  const cat = categoryOf(p)
  const img = mediaUrl(p.image, 'large')
  const props = [
    ...(p.chemistry?.ligand ? [{ '@type': 'PropertyValue', name: 'Ligand', value: p.chemistry.ligand }] : []),
    ...(p.chemistry?.matrix ? [{ '@type': 'PropertyValue', name: 'Matrix', value: p.chemistry.matrix }] : []),
    ...(p.specs ?? []).map((s) => ({ '@type': 'PropertyValue', name: s.parameter, value: s.value })),
    ...(p.grades ?? []).flatMap((g) => [
      ...(g.particleSizeRange ? [{ '@type': 'PropertyValue', name: `Particle size (${g.label || g.grade})`, value: g.particleSizeRange }] : []),
      ...(g.maxFlowVelocity ? [{ '@type': 'PropertyValue', name: `Max flow velocity (${g.label || g.grade})`, value: g.maxFlowVelocity }] : []),
      ...(g.dynamicBindingCapacity ? [{ '@type': 'PropertyValue', name: `Dynamic binding capacity (${g.label || g.grade})`, value: g.dynamicBindingCapacity }] : []),
    ]),
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/products/${p.slug}#product`,
    name: p.name,
    alternateName: p.subtitle || undefined,
    description: p.summary,
    image: img ? absoluteUrl(img) : undefined,
    url: `${SITE_URL}/products/${p.slug}`,
    category: cat?.name,
    brand: { '@type': 'Brand', name: 'Protpure' },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
    sku: p.packSizes?.find((ps) => ps.catalogNumber)?.catalogNumber || undefined,
    additionalProperty: props,
    offers: {
      '@type': 'Offer',
      availability: p.availability === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      priceCurrency: 'USD',
      priceSpecification: { '@type': 'PriceSpecification', description: 'Quotation on request. Bulk and custom pack sizes available.' },
      url: `${SITE_URL}/request-quote?product=${p.id}`,
      seller: { '@id': `${SITE_URL}/#organization` },
      businessFunction: 'http://purl.org/goodrelations/v1#Sell',
    },
  }
}

export function articleJsonLd(post: Post) {
  const author = post.author && typeof post.author === 'object' ? post.author : null
  const img = mediaUrl(post.heroImage, 'og')
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: img ? absoluteUrl(img) : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: author ? { '@type': 'Person', name: author.name, jobTitle: author.role, url: author.linkedinUrl || undefined } : { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  }
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: lexicalToText(f.answer as never) } })),
  }
}

export function applicationJsonLd(a: Application) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: a.name,
    description: a.summary,
    url: `${SITE_URL}/applications/${a.slug}`,
    about: { '@type': 'Thing', name: a.name },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }
}

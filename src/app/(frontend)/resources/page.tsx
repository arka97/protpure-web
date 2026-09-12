import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { DocumentRow, DOC_LABEL } from '@/components/product/cards'
import { PostCard } from '@/components/PostCard'
import { UpdateCard } from '@/components/UpdateCard'
import { ButtonLink, EmptyState } from '@/components/ui'
import { FilterChips } from '@/components/FilterChips'
import { Chapter } from '@/components/visual/Chapter'
import { ArrowIcon } from '@/components/visual/icons'
import { getDocuments, getPage, getPosts, getSiteSettings, getUpdates } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('resources')
  return buildMetadata({ meta: page?.meta, title: 'Resources — datasheets, performance data, case studies', description: page?.hero?.text || 'Download technical datasheets, brochures, performance data and case studies for Protpure agarose chromatography resins.', path: '/resources' })
}

const nn = (n: number) => String(n).padStart(2, '0')

/** Group headings and filter chips read as plurals; DOC_LABEL stays singular for each row's meta line. */
const PLURAL: Record<string, string> = { datasheet: 'Datasheets', brochure: 'Brochures', catalog: 'Catalogues', 'case-study': 'Case studies', 'application-note': 'Application notes', 'performance-data': 'Performance data', poster: 'Posters', presentation: 'Presentations', certificate: 'Certificates', other: 'Other documents' }

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const type = typeof sp.type === 'string' && sp.type in DOC_LABEL ? sp.type : undefined
  const [page, docs, posts, updates, settings] = await Promise.all([getPage('resources'), getDocuments(), getPosts({ limit: 3 }), getUpdates(3), getSiteSettings()])
  // Types in DOC_LABEL order, only those with at least one document; counts stay absolute.
  const types = Object.entries(DOC_LABEL).map(([value, label]) => ({ value, label: PLURAL[value] ?? label, items: docs.filter((d) => d.type === value) })).filter((t) => t.items.length)
  const shown = type ? docs.filter((d) => d.type === type) : docs
  const groups = type ? types.filter((t) => t.value === type) : types
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Resources' }]
  const totalMb = shown.reduce((sum, d) => sum + (d.filesize ?? 0), 0) / 1024 / 1024

  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Resources', title: 'The technical library.', highlight: 'library.', text: 'Datasheets, brochures, performance data and case studies — everything you need to evaluate and qualify Protpure resins.' }} breadcrumbs={crumbs} />

      <Chapter id="documents" aria-label="Documents" tight>
        <FilterChips
          label="Filter by document type"
          chips={[{ href: '/resources', label: 'All documents', count: docs.length, active: !type }, ...types.map((t) => ({ href: `/resources?type=${t.value}`, label: t.label, count: t.items.length, active: type === t.value }))]}
        />
        <p className="mono mt-6 border-b border-rule pb-3 text-[11px] text-text-2 lg:text-[12px]">
          {shown.length} {shown.length === 1 ? 'document' : 'documents'}
          {totalMb ? ` · ${totalMb.toFixed(1)} MB` : ''} <span className="font-sans">/ PDF, free to download; certificates of analysis ship with every lot</span>
        </p>

        {groups.length ? (
          <div className="mt-2">
            {groups.map((g, i) => (
              <section key={g.value} id={g.value} className="grid gap-4 border-b border-rule py-8 last:border-b-0 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px] lg:py-10" aria-labelledby={`doc-type-${g.value}`}>
                <div>
                  <p className="mono text-[12px] text-teal-deep">{nn(i + 1)}</p>
                  <h2 id={`doc-type-${g.value}`} className="serif-md mt-2">
                    {g.label}
                    <span className="mono ml-3 text-[13px] text-text-2">{g.items.length}</span>
                  </h2>
                </div>
                <div className="grid gap-x-8 md:grid-cols-2">
                  {g.items.map((d) => (
                    <DocumentRow key={d.id} doc={d} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState title="No documents in this category yet" text="Ask our team and we will send you what you need.">
              <ButtonLink href="/request-quote?type=technical">Request documents</ButtonLink>
            </EmptyState>
          </div>
        )}
      </Chapter>

      {posts.docs.length ? (
        <Chapter
          id="blog"
          tone="recessed"
          eyebrow="Notes from the bench"
          heading="From the blog"
          aside={
            <ButtonLink href="/blog" appearance="link">
              All articles <ArrowIcon />
            </ButtonLink>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {posts.docs.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </Chapter>
      ) : null}

      {updates.length ? (
        <Chapter
          id="updates"
          eyebrow="Updates"
          heading="Latest on LinkedIn"
          aside={
            <div className="flex flex-wrap gap-5">
              <ButtonLink href="/updates" appearance="link">
                All updates <ArrowIcon />
              </ButtonLink>
              {settings.social?.linkedin ? (
                <ButtonLink href={settings.social.linkedin} appearance="link" newTab>
                  Follow on LinkedIn <ArrowIcon />
                </ButtonLink>
              ) : null}
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {updates.map((u) => (
              <UpdateCard key={u.id} update={u} />
            ))}
          </div>
        </Chapter>
      ) : null}
      <RenderBlocks blocks={page?.layout} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? '/resources' })))} />
    </>
  )
}

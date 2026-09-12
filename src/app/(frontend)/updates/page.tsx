import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { FilterChips } from '@/components/FilterChips'
import { UpdateCard } from '@/components/UpdateCard'
import { ButtonLink, EmptyState } from '@/components/ui'
import { Chapter } from '@/components/visual/Chapter'
import { ArrowUpRightIcon } from '@/components/visual/icons'
import { UPDATE_KINDS } from '@/collections/Updates'
import { getPage, getSiteSettings, getUpdates } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('updates')
  return buildMetadata({ meta: page?.meta, title: 'Updates — latest from Protpure on LinkedIn', description: page?.hero?.text || 'Latest news, posters and posts from Protpure on LinkedIn.', path: '/updates' })
}

const nn = (n: number) => String(n).padStart(2, '0')

export default async function UpdatesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const kinds = [...UPDATE_KINDS, { label: 'Other updates', value: 'other' }] as { label: string; value: string }[]
  const kind = typeof sp.kind === 'string' && kinds.some((k) => k.value === sp.kind) ? sp.kind : undefined
  // Published updates only (drafts stay in the admin); grouped by kind in the collection's order.
  const [page, updates, settings] = await Promise.all([getPage('updates'), getUpdates(60), getSiteSettings()])
  const groups = kinds.map((k) => ({ ...k, items: updates.filter((u) => (u.kind ?? 'other') === k.value) })).filter((g) => g.items.length)
  const shown = kind ? groups.filter((g) => g.value === kind) : groups
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Updates' }]
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Updates', title: 'Latest from Protpure.', highlight: 'Protpure.', text: 'Posters, performance data and company milestones as we share them on LinkedIn.' }} breadcrumbs={crumbs}>
        {settings.social?.linkedin ? (
          <div className="mt-6 lg:mt-7">
            <ButtonLink href={settings.social.linkedin} appearance="onDark" newTab>
              Follow Protpure on LinkedIn <ArrowUpRightIcon />
            </ButtonLink>
          </div>
        ) : null}
      </ListingHero>
      <Chapter id="updates" aria-label="Updates">
        {groups.length > 1 ? (
          <FilterChips label="Filter by kind" chips={[{ href: '/updates', label: 'All updates', count: updates.length, active: !kind }, ...groups.map((g) => ({ href: `/updates?kind=${g.value}`, label: g.label, count: g.items.length, active: kind === g.value }))]} className="mb-6" />
        ) : null}
        {updates.length ? (
          <div className="border-t border-rule">
            {shown.map((g, i) => (
              <section key={g.value} id={g.value} className="border-b border-rule py-8 lg:py-10" aria-labelledby={`kind-${g.value}`}>
                <div className="mb-5 flex items-baseline gap-3 lg:mb-6">
                  <span className="mono text-[12px] text-teal-deep">{nn(i + 1)}</span>
                  <h2 id={`kind-${g.value}`} className="serif-md">
                    {g.label}
                  </h2>
                  <span className="mono text-[13px] text-text-2">{g.items.length}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((u) => (
                    <UpdateCard key={u.id} update={u} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="No updates yet" text="Published LinkedIn updates appear here; drafts stay in the admin panel until they are published." />
        )}
      </Chapter>
      <RenderBlocks blocks={page?.layout} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, href: c.href ?? '/updates' })))} />
    </>
  )
}

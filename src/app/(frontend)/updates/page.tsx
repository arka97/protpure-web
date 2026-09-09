import type { Metadata } from 'next'
import { ListingHero } from '@/components/PageHero'
import { UpdateCard } from '@/components/UpdateCard'
import { ButtonLink, EmptyState } from '@/components/ui'
import { getPage, getSiteSettings, getUpdates } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('updates')
  return buildMetadata({ meta: page?.meta, title: 'Updates from LinkedIn', description: page?.hero?.text || 'Latest news, posters and posts from Protpure on LinkedIn.', path: '/updates' })
}

export default async function UpdatesPage() {
  const [page, updates, settings] = await Promise.all([getPage('updates'), getUpdates(60), getSiteSettings()])
  return (
    <>
      <ListingHero page={page} fallback={{ eyebrow: 'Updates', title: 'Latest from Protpure', text: 'Posters, performance data and company milestones as we share them on LinkedIn.' }} breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Updates' }]}>
        {settings.social?.linkedin ? (
          <div className="mt-6">
            <ButtonLink href={settings.social.linkedin} appearance="secondary" newTab>
              Follow Protpure on LinkedIn
            </ButtonLink>
          </div>
        ) : null}
      </ListingHero>
      <section className="section-tight">
        <div className="container-x">
          {updates.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {updates.map((u) => (
                <UpdateCard key={u.id} update={u} />
              ))}
            </div>
          ) : (
            <EmptyState title="No updates yet" text="Add LinkedIn posts in the admin panel to show them here." />
          )}
        </div>
      </section>
    </>
  )
}

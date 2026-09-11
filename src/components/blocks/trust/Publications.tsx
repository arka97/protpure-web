import { ExternalLink } from 'lucide-react'
import { SectionHeader } from '@/components/ui'
import { getTeam } from '@/lib/data'
import type { Team } from '@/payload-types'
import type { TrustBlock } from './types'

/**
 * Peer-reviewed publications of one team member or of every member marked "featured". Each entry
 * links to the DOI / publisher page. Hidden when nobody has publications.
 */
export async function Publications({ block }: { block: TrustBlock<'publications'> }) {
  let members: Team[]
  if (block.member && typeof block.member === 'object') members = [block.member]
  else if (typeof block.member === 'number') members = (await getTeam()).filter((m) => m.id === block.member)
  else members = await getTeam({ featured: true })
  const withPubs = members.filter((m) => m.publications?.length)
  if (!withPubs.length) return null
  const multiple = withPubs.length > 1
  return (
    <section className="section-tight" data-block="publications">
      <div className="container-x">
        <SectionHeader eyebrow={block.eyebrow} heading={block.heading} />
        <div className="mt-8 grid gap-6">
          {withPubs.map((m) => (
            <div key={m.id} className="card p-6">
              {multiple ? <h3 className="heading-3">{m.name}</h3> : null}
              <ol className={multiple ? 'mt-4 space-y-4' : 'space-y-4'}>
                {(m.publications ?? []).map((p, i) => (
                  <li key={p.id ?? i} className="border-l-2 border-teal-400 pl-4">
                    <p className="font-medium text-navy-900">{p.title}</p>
                    <p className="mt-1 text-sm text-muted">{[p.journal, p.year ? String(p.year) : null].filter(Boolean).join(' · ')}</p>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 hover:text-teal-600">
                        Read <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only">{p.title}</span>
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

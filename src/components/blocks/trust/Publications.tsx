import { Chapter, type ChapterTone } from '@/components/visual/Chapter'
import { ArrowUpRightIcon } from '@/components/visual/icons'
import { getTeam } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Team } from '@/payload-types'
import type { TrustBlock, TrustMeta } from './types'

const RAIL = 'grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[75px]'
const nn = (n: number) => String(n).padStart(2, '0')

/**
 * Peer-reviewed publications of one team member, or of every member marked "featured", as a numbered
 * list: mono index, title, journal and year in mono, and the DOI / publisher link. Hidden when nobody
 * has publications. Numbered among the page's chapters when the block carries an eyebrow.
 */
export async function Publications({ block, meta }: { block: TrustBlock<'publications'>; meta?: TrustMeta }) {
  let members: Team[]
  if (block.member && typeof block.member === 'object') members = [block.member]
  else if (typeof block.member === 'number') members = (await getTeam()).filter((m) => m.id === block.member)
  else members = await getTeam({ featured: true })
  const withPubs = members.filter((m) => m.publications?.length)
  if (!withPubs.length) return null
  const multiple = withPubs.length > 1
  const tone: ChapterTone = meta?.tone ?? 'light'
  const dark = tone === 'dark' || tone === 'raised'
  let index = 0
  return (
    <Chapter tone={tone} attached={meta?.attached} tight={meta?.tight} data-block="publications" id="publications">
      <div className={RAIL}>
        <div>
          {block.eyebrow ? (
            <p className="eyebrow mb-5">
              {meta?.number ? <span className="num">{nn(meta.number)} / </span> : null}
              {block.eyebrow}
            </p>
          ) : null}
          {block.heading ? <h2 className="heading-2-sm max-w-[360px]">{block.heading}</h2> : null}
        </div>
        <div className="grid gap-8">
          {withPubs.map((m) => (
            <div key={m.id}>
              {multiple ? <h3 className="heading-4 mb-3">{m.name}</h3> : null}
              <ol className="border-t border-(--rule-current)">
                {(m.publications ?? []).map((p, i) => {
                  index++
                  return (
                    <li key={p.id ?? i} className="grid grid-cols-[38px_minmax(0,1fr)] gap-x-3 border-b border-(--rule-current) py-5 lg:grid-cols-[52px_minmax(0,1fr)_auto] lg:gap-x-5">
                      <span className={cn('mono pt-[3px] text-[12px]', dark ? 'text-teal-lum' : 'text-teal-deep')}>{nn(index)}</span>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium leading-[1.4] lg:text-[16px]">{p.title}</p>
                        {p.journal || p.year ? (
                          <p className="mono mt-1.5 text-[11px] leading-[1.5] text-secondary lg:text-[12px]">
                            {p.journal}
                            {p.journal && p.year ? ' · ' : ''}
                            {p.year ? String(p.year) : ''}
                          </p>
                        ) : null}
                      </div>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-link col-start-2 mt-3 self-start text-[12px] lg:col-start-3 lg:mt-[3px]">
                          Read <ArrowUpRightIcon />
                          <span className="sr-only">: {p.title}</span>
                        </a>
                      ) : null}
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </Chapter>
  )
}

import { CmsImage, SectionHeader } from '@/components/ui'
import { getCustomers, getSiteSettings, isDraftMode } from '@/lib/data'
import { displayableCustomers } from '@/lib/trust'
import type { Customer } from '@/payload-types'
import type { TrustBlock } from './types'

/**
 * Customer logo wall. Renders a row of logos for customers cleared with "Show logo"; while there
 * are none it renders the customers statement instead (a CMS slot, never hard-coded copy) and, in
 * admin preview only, a hint telling the editor where to add customers.
 */
export async function LogoWall({ block }: { block: TrustBlock<'logoWall'> }) {
  const pickedIds = (block.customers ?? []).map((c) => (typeof c === 'object' ? c.id : c))
  const [customers, settings, draft] = await Promise.all([
    block.source === 'picked' ? (pickedIds.length ? getCustomers({ ids: pickedIds }) : Promise.resolve([] as Customer[])) : getCustomers({ showLogo: true }),
    getSiteSettings(),
    isDraftMode(),
  ])
  const logos = displayableCustomers(customers)
  const statement = block.fallbackStatement || settings.proof?.customersStatement || null

  if (!logos.length && !statement && !draft) return null

  return (
    <section className="section-tight" data-block="logoWall">
      <div className="container-x">
        <SectionHeader eyebrow={block.eyebrow} heading={block.heading} />
        {logos.length ? (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8" aria-label="Customers">
            {logos.map((c) => (
              <li key={c.id} className="flex items-center">
                <LogoItem customer={c} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card mt-8 p-6 text-center">
            {statement ? <p className="text-ink-soft">{statement}</p> : null}
            {draft ? <p className="chip mt-3">Editor hint: add customers with logos under Sales → Customers and tick “Show logo”.</p> : null}
          </div>
        )}
      </div>
    </section>
  )
}

function LogoItem({ customer }: { customer: Customer }) {
  const img = customer.logo && typeof customer.logo === 'object' ? <CmsImage media={customer.logo} size="thumbnail" className="h-10 w-auto max-w-[160px] object-contain" fallbackAlt={customer.name} /> : null
  const label = [customer.name, customer.country].filter(Boolean).join(', ')
  return customer.website ? (
    <a href={customer.website} target="_blank" rel="noopener noreferrer" title={label} className="opacity-80 transition-opacity hover:opacity-100">
      {img}
    </a>
  ) : (
    <span title={label}>{img}</span>
  )
}

import { ButtonLink } from '@/components/ui'
import { BeadField } from '@/components/visual/BeadField'
import { Heading } from '@/components/visual/Heading'
import { ArrowIcon, AlertIcon, CheckCircleIcon } from '@/components/visual/icons'
import { cn } from '@/lib/utils'

/**
 * Full-width status page on the dark field (404, newsletter confirm / unsubscribe): eyebrow with a
 * mark, serif heading with an italic proposition, one line of text and up to two actions.
 */
export function StatusPage({
  eyebrow,
  heading,
  text,
  links,
  tone = 'ok',
}: {
  eyebrow: string
  heading: string
  text?: string
  links?: { href: string; label: string; appearance?: 'primary' | 'secondary' }[]
  tone?: 'ok' | 'attention' | 'plain'
}) {
  const Mark = tone === 'attention' ? AlertIcon : tone === 'ok' ? CheckCircleIcon : null
  return (
    <section className="surface-dark relative overflow-hidden border-b border-rule-dark" data-block="status">
      <BeadField density="normal" opacity={0.16} className="bottom-[-160px] right-[-80px] w-[420px] lg:bottom-[-200px] lg:right-[40px] lg:w-[680px]" seed={4} />
      <div className="container-x relative flex min-h-[60vh] flex-col justify-center py-16 lg:min-h-[640px] lg:py-24">
        <div className="relative z-[2] max-w-[720px]">
          <p className="eyebrow mb-5 flex items-center gap-3">
            {Mark ? <Mark className={cn('h-4 w-4', tone === 'attention' ? 'text-[#e2c9a2]' : 'text-teal-lum')} /> : <span className="dot" aria-hidden />}
            {eyebrow}
          </p>
          <h1 className="heading-2 text-wrap-initial">
            <Heading text={heading} dark />
          </h1>
          {text ? <p className="lede mt-6 max-w-[520px]">{text}</p> : null}
          {links?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((l, i) => (
                <ButtonLink key={l.href} href={l.href} appearance={l.appearance === 'secondary' ? 'onDark' : 'primary'}>
                  {l.label}
                  {i === 0 ? <ArrowIcon /> : null}
                </ButtonLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {
  Atom, BadgeCheck, Beaker, Boxes, ChartNoAxesCombined, Clock, Cpu, Factory, FileText, FlaskConical, Gauge, Globe, Handshake, Layers, Magnet,
  Microscope, Package, Ruler, ShieldCheck, Sparkles, Timer, Truck, Users, Waves, Zap, Droplets, Columns3, type LucideIcon,
} from 'lucide-react'
import { cn, mediaUrl, mediaAlt, resolveLink, type LinkValue } from '@/lib/utils'
import type { Media } from '@/payload-types'

/* ---------- Icons (CMS-selectable names → Lucide) ---------- */
export const ICONS: Record<string, LucideIcon> = {
  purity: Sparkles,
  reproducible: BadgeCheck,
  flow: Waves,
  delivery: Truck,
  factory: Factory,
  cost: ChartNoAxesCombined,
  globe: Globe,
  shield: ShieldCheck,
  support: Users,
  scale: Layers,
  beaker: FlaskConical,
  document: FileText,
  microscope: Microscope,
  chart: Gauge,
  handshake: Handshake,
  clock: Clock,
  // category icons
  'ion-exchange': Zap,
  affinity: Magnet,
  sec: Ruler,
  hic: Droplets,
  'mixed-mode': Atom,
  activated: Cpu,
  column: Columns3,
  kit: Package,
  magnetic: Boxes,
  timer: Timer,
  beakerAlt: Beaker,
}

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const C = (name && ICONS[name]) || Beaker
  return <C className={cn('h-5 w-5', className)} aria-hidden />
}

/* ---------- Buttons / links ---------- */
const appearanceClass: Record<string, string> = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', onDark: 'btn-on-dark' }

export function ButtonLink({ href, children, appearance = 'primary', className, newTab, size }: { href: string; children: React.ReactNode; appearance?: string; className?: string; newTab?: boolean; size?: 'sm' }) {
  const cls = cn(appearanceClass[appearance] ?? 'btn-primary', size === 'sm' && 'btn-sm', className)
  if (/^https?:\/\//.test(href) || newTab) {
    return (
      <a href={href} className={cls} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

export function CmsLinks({ links, onDark, className }: { links?: ({ link?: LinkValue | null } | LinkValue)[] | null; onDark?: boolean; className?: string }) {
  if (!links?.length) return null
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {links.map((l, i) => {
        const value = 'link' in (l as object) ? (l as { link?: LinkValue | null }).link : (l as LinkValue)
        const r = resolveLink(value)
        if (!r) return null
        const appearance = onDark && r.appearance !== 'primary' ? 'onDark' : r.appearance
        return (
          <ButtonLink key={i} href={r.href} newTab={r.newTab} appearance={appearance}>
            {r.label}
          </ButtonLink>
        )
      })}
    </div>
  )
}

/* ---------- Section header ---------- */
export function SectionHeader({ eyebrow, heading, intro, align = 'left', onDark, className, as: Tag = 'h2' }: { eyebrow?: string | null; heading?: string | null; intro?: string | null; align?: 'left' | 'center'; onDark?: boolean; className?: string; as?: 'h1' | 'h2' | 'h3' }) {
  if (!eyebrow && !heading && !intro) return null
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      {heading ? <Tag className={cn('heading-2', onDark && 'text-white')}>{heading}</Tag> : null}
      {intro ? <p className={cn('mt-4 text-lg leading-relaxed', onDark ? 'text-white/75' : 'text-ink-soft')}>{intro}</p> : null}
    </div>
  )
}

/* ---------- Media ---------- */
export function CmsImage({ media, size = 'card', className, sizes, priority, fill, fallbackAlt = '' }: { media?: Media | number | string | null; size?: 'thumbnail' | 'card' | 'large' | 'og'; className?: string; sizes?: string; priority?: boolean; fill?: boolean; fallbackAlt?: string }) {
  const url = mediaUrl(media, size) ?? mediaUrl(media)
  if (!url || typeof media !== 'object' || !media) return null
  const alt = mediaAlt(media, fallbackAlt)
  const m = media as Media
  if (fill) return <Image src={url} alt={alt} fill className={className} sizes={sizes ?? '100vw'} priority={priority} />
  const w = m.sizes?.[size]?.width ?? m.width ?? 1200
  const h = m.sizes?.[size]?.height ?? m.height ?? 800
  return <Image src={url} alt={alt} width={w} height={h} className={className} sizes={sizes} priority={priority} />
}

/* ---------- Misc ---------- */
export function Badge({ children, tone = 'neutral', className }: { children: React.ReactNode; tone?: 'neutral' | 'teal' | 'amber' | 'navy' | 'onDark'; className?: string }) {
  const tones = {
    neutral: 'bg-surface-2 text-ink-soft border-line',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    navy: 'bg-navy-50 text-navy-800 border-navy-100',
    onDark: 'bg-white/10 text-white border-white/15',
  }
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone], className)}>{children}</span>
}

export function StatusBadge({ status }: { status?: string | null }) {
  if (status === 'in-development') return <Badge tone="amber">In development</Badge>
  if (status === 'made-to-order') return <Badge tone="navy">Made to order</Badge>
  return (
    <Badge tone="teal">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Available
    </Badge>
  )
}

export function Breadcrumbs({ items, onDark }: { items: { label: string; href?: string }[]; onDark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', onDark ? 'text-white/60' : 'text-muted')}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {it.href ? (
              <Link href={it.href} className={cn('hover:underline', onDark ? 'hover:text-white' : 'hover:text-navy-900')}>
                {it.label}
              </Link>
            ) : (
              <span className={onDark ? 'text-white' : 'text-ink'} aria-current="page">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function KeyValue({ items, className }: { items: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn('divide-y divide-line rounded-xl border border-line bg-surface', className)}>
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,40%)_1fr] gap-3 px-4 py-3 text-sm">
          <dt className="text-muted">{it.label}</dt>
          <dd className="font-medium text-ink">{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function EmptyState({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="card p-10 text-center">
      <p className="heading-3">{title}</p>
      {text ? <p className="mx-auto mt-2 max-w-md text-ink-soft">{text}</p> : null}
      {children ? <div className="mt-6 flex justify-center gap-3">{children}</div> : null}
    </div>
  )
}

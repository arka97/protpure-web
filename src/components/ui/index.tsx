import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import {
  Atom, BadgeCheck, Beaker, Boxes, ChartNoAxesCombined, Clock, Cpu, Factory, FileText, FlaskConical, Gauge, Globe, Handshake, Layers, Magnet,
  Microscope, Package, Ruler, ShieldCheck, Sparkles, Timer, Truck, Users, Waves, Zap, Droplets, Columns3, type LucideIcon,
} from 'lucide-react'
import { cn, mediaUrl, mediaAlt, resolveLink, type LinkValue } from '@/lib/utils'
import type { Media } from '@/payload-types'

/* ---------- Icons (CMS-selectable names → Lucide, drawn at the system's 1.5 px stroke) ---------- */
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
  return <C className={cn('h-5 w-5', className)} strokeWidth={1.5} aria-hidden />
}

/* ---------- Buttons / links ---------- */
const appearanceClass: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  onDark: 'btn-on-dark',
  teal: 'btn-teal',
  ink: 'btn-ink',
  link: 'text-link',
}

export function ButtonLink({ href, children, appearance = 'primary', className, newTab, size }: { href: string; children: React.ReactNode; appearance?: string; className?: string; newTab?: boolean; size?: 'sm' | 'xs' }) {
  const cls = cn(appearanceClass[appearance] ?? 'btn-primary', size === 'sm' && 'btn-sm', size === 'xs' && 'btn-xs', className)
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

/** Inline arrow used after button and link labels. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn('h-[18px] w-[18px] flex-none', className)}>
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  )
}

export function CmsLinks({ links, onDark, className, arrow = true }: { links?: ({ link?: LinkValue | null } | LinkValue)[] | null; onDark?: boolean; className?: string; arrow?: boolean }) {
  if (!links?.length) return null
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map((l, i) => {
        const value = 'link' in (l as object) ? (l as { link?: LinkValue | null }).link : (l as LinkValue)
        const r = resolveLink(value)
        if (!r) return null
        const appearance = onDark && r.appearance !== 'primary' ? 'onDark' : r.appearance
        return (
          <ButtonLink key={i} href={r.href} newTab={r.newTab} appearance={appearance}>
            {r.label}
            {arrow && appearance === 'primary' ? <Arrow /> : null}
          </ButtonLink>
        )
      })}
    </div>
  )
}

/* ---------- Section header (legacy signature; chapters use components/visual/Chapter) ---------- */
export function SectionHeader({ eyebrow, heading, intro, align = 'left', onDark, className, as: Tag = 'h2', size = 'md' }: { eyebrow?: string | null; heading?: string | null; intro?: string | null; align?: 'left' | 'center'; onDark?: boolean; className?: string; as?: 'h1' | 'h2' | 'h3'; size?: 'md' | 'sm' }) {
  if (!eyebrow && !heading && !intro) return null
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
      {heading ? <Tag className={cn(size === 'sm' ? 'heading-2-sm' : 'heading-2', onDark && 'text-surface')}>{heading}</Tag> : null}
      {intro ? <p className={cn('text-body mt-5 max-w-[560px]', align === 'center' && 'mx-auto', onDark ? 'text-text-2-dark' : 'text-text-2')}>{intro}</p> : null}
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
    neutral: 'border-rule text-text-2',
    teal: 'border-[#b6cfc4] bg-tint text-tint-ink',
    amber: 'border-[#e2c9a2] text-attention',
    navy: 'border-rule text-ink',
    onDark: 'border-rule-dark text-text-2-dark',
  }
  return <span className={cn('chip', tones[tone], className)}>{children}</span>
}

/** Availability as a word plus a dot — colour is supplementary, never the only carrier. */
export function StatusBadge({ status, className }: { status?: string | null; className?: string }) {
  if (status === 'in-development') return <span className={cn('status-dot text-attention', className)}>In development</span>
  if (status === 'made-to-order') return <span className={cn('status-dot text-attention', className)}>Made to order</span>
  return <span className={cn('status-dot text-ok', className)}>Available</span>
}

export function Breadcrumbs({ items, onDark }: { items: { label: string; href?: string }[]; onDark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-[11px] tracking-[0.02em]', onDark ? 'text-text-2-dark' : 'text-text-2')}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {it.href ? (
              <Link href={it.href} className={cn('hover:underline', onDark ? 'hover:text-surface' : 'hover:text-ink')}>
                {it.label}
              </Link>
            ) : (
              <span className={onDark ? 'text-surface' : 'text-ink'} aria-current="page">
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
    <dl className={cn('divide-y divide-rule border-y border-rule', className)}>
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,40%)_1fr] gap-3 py-3 text-sm">
          <dt className="text-text-2">{it.label}</dt>
          <dd className="num font-medium text-ink">{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function EmptyState({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="card p-10 text-center">
      <p className="heading-3">{title}</p>
      {text ? <p className="mx-auto mt-2 max-w-md text-text-2">{text}</p> : null}
      {children ? <div className="mt-6 flex justify-center gap-3">{children}</div> : null}
    </div>
  )
}

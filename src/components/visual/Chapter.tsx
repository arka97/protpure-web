import * as React from 'react'
import { BeadField, type BeadFieldProps } from './BeadField'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

export type ChapterTone = 'light' | 'recessed' | 'dark' | 'raised' | 'accent'

export const TONE_CLASS: Record<ChapterTone, string> = {
  light: 'bg-surface text-ink',
  recessed: 'surface-recessed',
  dark: 'surface-dark',
  raised: 'surface-raised',
  accent: 'surface-accent',
}

export const isDarkTone = (tone: ChapterTone) => tone === 'dark' || tone === 'raised'

/** Numbered eyebrow: `01 / THE CATALOGUE`. The number is derived from the block's position; the text is CMS copy. */
export function ChapterEyebrow({ number, children, className, as: Tag = 'span' }: { number?: string | number | null; children: React.ReactNode; className?: string; as?: 'span' | 'p' }) {
  const n = number == null || number === '' ? null : typeof number === 'number' ? String(number).padStart(2, '0') : number
  return (
    <Tag className={cn('eyebrow', className)}>
      {n ? <span className="num">{n} / </span> : null}
      {children}
    </Tag>
  )
}

/**
 * Chapter head: eyebrow + serif heading on the left, short description on the right (stacked on
 * phones). `heading` may contain an `<em>` for the italic proposition.
 */
export function ChapterHead({
  number,
  eyebrow,
  heading,
  intro,
  aside,
  className,
  headingClassName,
  introClassName,
  as: Tag = 'h2',
  size = 'lg',
}: {
  number?: string | number | null
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  intro?: React.ReactNode
  aside?: React.ReactNode
  className?: string
  headingClassName?: string
  introClassName?: string
  as?: 'h1' | 'h2' | 'h3'
  /** `lg` is the primary chapter heading (64 px); `md` the product content heading (52 px). */
  size?: 'lg' | 'md'
}) {
  if (!eyebrow && !heading && !intro && !aside) return null
  return (
    <div className={cn('mb-7 flex flex-col gap-5 lg:mb-9 lg:flex-row lg:items-end lg:justify-between lg:gap-12', className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <ChapterEyebrow number={number} className="mb-5">
            {eyebrow}
          </ChapterEyebrow>
        ) : null}
        {heading ? <Tag className={cn(size === 'md' ? 'heading-2-md' : 'heading-2', 'max-w-[660px]', headingClassName)}>{heading}</Tag> : null}
      </div>
      {intro || aside ? (
        <div className="flex shrink-0 flex-col gap-4 lg:max-w-[380px] lg:items-start lg:pb-1">
          {intro ? <p className={cn('text-body text-secondary max-w-[520px]', introClassName)}>{intro}</p> : null}
          {aside}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Section wrapper for a homepage / long-page chapter. Renders the tone surface, optional bead field,
 * the numbered head and the content inside the 1440 container, with one reveal on entry.
 *
 * - `attached`: this block continues the previous chapter (no top padding, no own head spacing).
 * - `tight`: the next block continues this chapter (shorter bottom padding).
 */
export function Chapter({
  id,
  tone = 'light',
  number,
  eyebrow,
  heading,
  intro,
  aside,
  children,
  className,
  innerClassName,
  headClassName,
  headingClassName,
  attached,
  tight,
  beads,
  reveal = true,
  as: Tag = 'section',
  size,
  ...rest
}: {
  id?: string
  tone?: ChapterTone
  number?: string | number | null
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  intro?: React.ReactNode
  aside?: React.ReactNode
  children?: React.ReactNode
  className?: string
  innerClassName?: string
  headClassName?: string
  headingClassName?: string
  attached?: boolean
  tight?: boolean
  /** `true` for the default chapter-edge placement, or explicit BeadField props. */
  beads?: boolean | BeadFieldProps
  reveal?: boolean
  as?: 'section' | 'div' | 'aside'
  size?: 'lg' | 'md'
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children' | 'id'>) {
  const padding = cn(attached ? 'pt-0' : 'pt-12 lg:pt-20', tight ? 'pb-8 lg:pb-10' : 'pb-12 lg:pb-20')
  const beadProps: BeadFieldProps | null = beads ? (beads === true ? { density: 'normal', opacity: 0.12, className: 'right-[-120px] top-3 w-[470px] max-w-[70vw]' } : beads) : null
  const inner = (
    <div className={cn('container-x relative', innerClassName)}>
      <ChapterHead number={number} eyebrow={eyebrow} heading={heading} intro={intro} aside={aside} className={headClassName} headingClassName={headingClassName} size={size} />
      {children}
    </div>
  )
  return (
    <Tag id={id} className={cn('relative overflow-hidden', TONE_CLASS[tone], padding, className)} {...rest}>
      {beadProps ? <BeadField {...beadProps} /> : null}
      {reveal ? <Reveal>{inner}</Reveal> : inner}
    </Tag>
  )
}

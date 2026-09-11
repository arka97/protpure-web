import * as React from 'react'

/**
 * Deep Field icon language: one inline SVG family, 24 × 24 viewBox, 1.5 px stroke, round caps and
 * joins, no filled pictograms. Decorative by default (`aria-hidden`); pass `title` for a labelled icon.
 * Render at 20 px by default, 14–16 px in compact controls (set via className).
 */
type IconProps = React.SVGProps<SVGSVGElement> & { title?: string }

function Svg({ title, children, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={className ?? 'h-5 w-5'}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export const ArrowIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h15M13 5l7 7-7 7" />
  </Svg>
)
export const ArrowUpRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
)
export const BasketIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8h18l-2 12H5L3 8ZM8 8l4-6 4 6M9 12v4M15 12v4" />
  </Svg>
)
export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)
export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12 4 4L19 6" />
  </Svg>
)
export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v11m-5-4 5 5 5-5M4 20h16" />
  </Svg>
)
export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Svg>
)
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 5 14 14M5 19 19 5" />
  </Svg>
)
export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.2-4.2" />
  </Svg>
)
export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </Svg>
)
export const DocumentIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6V3ZM14 3v4h4M9 12h6M9 16h6" />
  </Svg>
)

/**
 * Chemistry emblems: the same circle construction at 60 × 60 with a 1.1 px stroke. Keyed by the
 * `icon` value of a product category (see CATEGORY_ICONS); unknown keys fall back to a single bead.
 */
const EMBLEMS: Record<string, React.ReactNode> = {
  'ion-exchange': (
    <>
      <circle cx="18" cy="18" r="9" />
      <circle cx="40" cy="18" r="9" />
      <circle cx="18" cy="40" r="9" />
      <circle cx="40" cy="40" r="9" />
    </>
  ),
  affinity: (
    <>
      <circle cx="30" cy="30" r="22" />
      <circle cx="30" cy="30" r="13" />
      <circle cx="30" cy="30" r="4" />
    </>
  ),
  sec: (
    <>
      <circle cx="12" cy="30" r="5" />
      <circle cx="30" cy="30" r="9" />
      <circle cx="51" cy="30" r="5" />
    </>
  ),
  hic: (
    <>
      <circle cx="21" cy="23" r="15" />
      <circle cx="39" cy="37" r="15" />
    </>
  ),
  'mixed-mode': (
    <>
      <circle cx="17" cy="17" r="8" />
      <circle cx="43" cy="17" r="8" />
      <circle cx="30" cy="42" r="13" />
    </>
  ),
  activated: (
    <>
      <circle cx="30" cy="30" r="23" />
      <circle cx="17" cy="24" r="3" />
      <circle cx="40" cy="23" r="4" />
      <circle cx="28" cy="40" r="5" />
    </>
  ),
  column: (
    <>
      <circle cx="30" cy="13" r="6" />
      <circle cx="30" cy="30" r="6" />
      <circle cx="30" cy="47" r="6" />
    </>
  ),
  kit: (
    <>
      <circle cx="30" cy="30" r="21" />
      <circle cx="22" cy="26" r="4" />
      <circle cx="37" cy="24" r="3" />
      <circle cx="31" cy="38" r="5" />
    </>
  ),
  magnetic: (
    <>
      <circle cx="22" cy="30" r="12" />
      <circle cx="38" cy="30" r="12" />
      <circle cx="30" cy="30" r="3" />
    </>
  ),
}

export function ModeEmblem({ icon, className }: { icon?: string | null; className?: string }) {
  const shape = (icon && EMBLEMS[icon]) || <circle cx="30" cy="30" r="20" />
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1.1} aria-hidden className={className ?? 'h-[58px] w-[58px]'}>
      {shape}
    </svg>
  )
}

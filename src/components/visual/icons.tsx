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
export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 9v4m0 4h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </Svg>
)
export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
)
export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.6 3.7 5.4 3.7 8.5s-1.2 5.9-3.7 8.5c-2.5-2.6-3.7-5.4-3.7-8.5s1.2-5.9 3.7-8.5Z" />
  </Svg>
)
export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.4 3.1 7.9 7.5 9.5 4.4-1.6 7.5-5.1 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)
export const ClipboardIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4h6v3H9zM9 5.5H6v15h12v-15h-3M9 12h6M9 16h4" />
  </Svg>
)
export const DocumentIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6V3ZM14 3v4h4M9 12h6M9 16h6" />
  </Svg>
)
export const ExternalLinkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 13v7H4V6h7" />
  </Svg>
)
export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18v12H3V6Zm0 1 9 6 9-6" />
  </Svg>
)
export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Svg>
)
export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16v11h-9l-5 4v-4H4V5Z" />
  </Svg>
)
export const MapPinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)
export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 5-5" />
  </Svg>
)
export const RssIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" />
    <circle cx="6" cy="18" r="1" />
  </Svg>
)

/**
 * CMS-selectable icons (the `icon` select of feature-grid items, see ICON_OPTIONS in src/blocks/config.ts),
 * drawn in the same 24-grid stroke language. Unknown names fall back to a single bead.
 */
const CMS_ICONS: Record<string, React.ReactNode> = {
  purity: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" />,
  reproducible: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 5-5" />
    </>
  ),
  flow: <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />,
  delivery: (
    <>
      <path d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6Z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </>
  ),
  factory: <path d="M3 20V9l5 3V9l5 3V9l5 3v8H3ZM17 9V4h3v5" />,
  cost: <path d="m3 17 5-5 4 4 8-8M15 8h5v5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  shield: <path d="m12 3 7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Zm-3 9 2 2 4-4" />,
  support: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M21 20c0-2.5-2-4.5-5-5" />
    </>
  ),
  scale: <path d="m12 4 9 5-9 5-9-5 9-5ZM3 14l9 5 9-5" />,
  beaker: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7 16h10" />,
  document: <path d="M6 3h8l4 4v14H6V3ZM14 3v4h4M9 12h6M9 16h6" />,
  microscope: <path d="M6 18h12M9 21h6M10 3l5 5-5 5-5-5 5-5ZM12.5 10.5 15 13a5 5 0 0 1-3 7" />,
  chart: (
    <>
      <path d="M4 15a8 8 0 1 1 16 0M12 15l4-5" />
      <circle cx="12" cy="15" r="1" />
    </>
  ),
  handshake: <path d="m3 9 4-3 4 3 4-3 4 3M3 9l5 6 4 3 4-3 5-6M9 12l3 3 3-3" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2M10 3h4" />
    </>
  ),
}

export function CmsIcon({ name, className }: { name?: string | null; className?: string }) {
  if (name && EMBLEMS[name]) return <ModeEmblem icon={name} className={className ?? 'h-5 w-5'} />
  const shape = (name && CMS_ICONS[name]) || <circle cx="12" cy="12" r="7" />
  return <Svg className={className}>{shape}</Svg>
}

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

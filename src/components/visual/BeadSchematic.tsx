import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * "FIG. 01 / SCHEMATIC": the annotated cross-section of a porous cross-linked agarose bead, carried
 * over from the Clean Room concept and redrawn in the Deep Field palette — luminous teal lines on the
 * dark field, deep teal on light surfaces. Labels are mono. It is a line drawing, not a micrograph;
 * the section line A—A, hatched matrix and open pores are qualitative.
 *
 * Use for the Technology page hero and the product-page chemistry panel.
 */
export function BeadSchematic({ tone = 'dark', className, showLabels = true, label = 'Schematic cross-section of a porous cross-linked agarose bead, with ligand and open pore structure annotations' }: { tone?: 'dark' | 'light'; className?: string; showLabels?: boolean; label?: string }) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '')
  const c =
    tone === 'dark'
      ? { line: '#83e6d1', faint: '#3a535b', hatch: '#3a535b', pore: '#081f29', text: '#b8caca' }
      : { line: '#00786d', faint: '#cbd5d0', hatch: '#cbd5d0', pore: '#ffffff', text: '#51666b' }
  return (
    <svg viewBox="0 0 560 370" role="img" aria-label={label} className={cn('h-auto w-full', className)}>
      <defs>
        <pattern id={`hatch-${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0v7" stroke={c.hatch} strokeWidth="1" />
        </pattern>
      </defs>
      {/* Section axes */}
      <path d="M260 24v315M89 191h343" stroke={c.faint} strokeDasharray="4 5" fill="none" />
      {/* Bead body: hatched 6 % matrix with an outer boundary */}
      <circle cx="260" cy="191" r="110" fill={`url(#hatch-${id})`} stroke={c.line} strokeWidth="1.5" />
      <circle cx="260" cy="191" r="123" fill="none" stroke={c.faint} strokeDasharray="2 5" />
      {/* Open pores */}
      <g fill={c.pore} stroke={c.line} strokeWidth="1">
        <circle cx="201" cy="128" r="15" />
        <circle cx="240" cy="113" r="12" />
        <circle cx="285" cy="129" r="18" />
        <circle cx="321" cy="155" r="12" />
        <circle cx="202" cy="175" r="20" />
        <circle cx="245" cy="165" r="16" />
        <circle cx="284" cy="181" r="13" />
        <circle cx="325" cy="204" r="17" />
        <circle cx="190" cy="220" r="12" />
        <circle cx="231" cy="219" r="19" />
        <circle cx="273" cy="232" r="16" />
        <circle cx="309" cy="246" r="11" />
        <circle cx="224" cy="263" r="12" />
        <circle cx="270" cy="273" r="13" />
      </g>
      {/* Leader lines */}
      <g fill="none" stroke={c.line} strokeWidth="1.2">
        <path d="m345 120 28-24h62m-74 132 43 25h39M158 157l-43-25H34M205 288v36h131" />
        <path d="m343 113 10-12m-2 17 14-7m-212 55-15-5m18 12-15 2" />
        <path d="M150 337h220m-220-5v10m220-10v10" />
      </g>
      {showLabels ? (
        <g fontFamily="var(--font-mono)" fontSize="10" fill={c.text} letterSpacing="0.06em">
          <text x="371" y="82">LIGAND</text>
          <text x="393" y="273">OPEN PORES</text>
          <text x="30" y="116">CROSS-LINKED</text>
          <text x="30" y="129">AGAROSE</text>
          <text x="226" y="358">6% MATRIX</text>
          <text x="465" y="32">A—A</text>
        </g>
      ) : null}
      <path d="M450 30h-25m12-12v25" stroke={c.line} fill="none" />
    </svg>
  )
}

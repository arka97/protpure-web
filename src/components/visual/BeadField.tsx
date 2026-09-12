import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * The bead field: Deep Field's replacement for the hexagon wallpaper. One inline `<svg>` of flat
 * circles in four diameters (8, 12, 20, 32 units) on an ordered lattice with a small deterministic
 * offset. Most are outlined, a few filled. No filters, gradients or motion; decorative only
 * (`aria-hidden`, non-interactive) and held at 10–17 % opacity. Use it at chapter edges on dark
 * surfaces, never behind long paragraphs or tables. Never more than 80 circles.
 */
export type BeadFieldProps = {
  /** Number of lattice columns / rows. `cols × rows` is capped at 80 circles. */
  cols?: number
  rows?: number
  /** Presets for cols/rows/spacing; explicit `cols`/`rows` win. */
  density?: 'sparse' | 'normal' | 'dense'
  /** Lattice pitch in SVG units. */
  spacing?: number
  /** Changes the offset pattern without changing the lattice. */
  seed?: number
  /** 0–1; the direction allows 0.10–0.17. */
  opacity?: number
  /** Every n-th circle is filled. */
  filledEvery?: number
  /** Stroke/fill colour; luminous teal by default. */
  color?: string
  /** Positioning classes — the field is `absolute` and `pointer-events-none` by default. */
  className?: string
  style?: React.CSSProperties
}

const RADII = [4, 16, 10, 6] // diameters 8, 32, 20, 12
const PRESETS = { sparse: { cols: 8, rows: 5, spacing: 56 }, normal: { cols: 11, rows: 7, spacing: 50 }, dense: { cols: 10, rows: 8, spacing: 44 } }
const MAX_CIRCLES = 80

/** Deterministic pseudo-random in [0, 1) — same output for the same (i, seed) on server and client. */
function noise(i: number, seed: number) {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function beadFieldCircles({ cols, rows, spacing, seed = 1, filledEvery = 11 }: { cols: number; rows: number; spacing: number; seed?: number; filledEvery?: number }) {
  const circles: { cx: number; cy: number; r: number; filled: boolean }[] = []
  const rowPitch = spacing * 0.94
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (circles.length >= MAX_CIRCLES) break
      const i = row * cols + col
      const r = RADII[(i + row) % RADII.length]
      const dx = (noise(i, seed) - 0.5) * spacing * 0.5
      const dy = (noise(i + 1000, seed) - 0.5) * rowPitch * 0.5
      circles.push({
        cx: Math.round((col * spacing + spacing / 2 + dx) * 10) / 10,
        cy: Math.round((row * rowPitch + rowPitch / 2 + dy) * 10) / 10,
        r,
        filled: (i + 3) % filledEvery === 0,
      })
    }
  }
  return circles
}

export function BeadField({ cols, rows, density = 'normal', spacing, seed = 1, opacity = 0.16, filledEvery = 11, color = 'var(--color-teal-lum)', className, style }: BeadFieldProps) {
  const preset = PRESETS[density]
  const c = cols ?? preset.cols
  const r = rows ?? preset.rows
  const s = spacing ?? preset.spacing
  const circles = beadFieldCircles({ cols: c, rows: r, spacing: s, seed, filledEvery })
  const width = c * s
  const height = Math.round(r * s * 0.94)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden
      focusable="false"
      className={cn('pointer-events-none absolute select-none', className)}
      style={{ opacity, ...style }}
    >
      {circles.map((k, i) => (
        <circle key={i} cx={k.cx} cy={k.cy} r={k.r} fill={k.filled ? color : 'none'} stroke={color} strokeWidth={0.7} />
      ))}
    </svg>
  )
}

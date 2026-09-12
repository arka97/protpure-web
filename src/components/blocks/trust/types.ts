import type { ChapterTone } from '@/components/visual/Chapter'
import type { Page } from '@/payload-types'

/** Narrow a page-layout block by its `blockType`, e.g. `TrustBlock<'logoWall'>`. */
export type TrustBlock<T extends NonNullable<Page['layout']>[number]['blockType']> = Extract<NonNullable<Page['layout']>[number], { blockType: T }>

/** Chapter placement computed by `planBlocks` in RenderBlocks.tsx: number among chapters, surface tone, attached / tight spacing. */
export type TrustMeta = { number: number | null; attached: boolean; tight: boolean; tone: ChapterTone }

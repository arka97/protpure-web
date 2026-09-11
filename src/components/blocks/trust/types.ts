import type { Page } from '@/payload-types'

/** Narrow a page-layout block by its `blockType`, e.g. `TrustBlock<'logoWall'>`. */
export type TrustBlock<T extends NonNullable<Page['layout']>[number]['blockType']> = Extract<NonNullable<Page['layout']>[number], { blockType: T }>

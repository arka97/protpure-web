import type { Field } from 'payload'
import { slugField as payloadSlugField } from 'payload'

/** Sidebar slug (auto-generated from `useAsSlug`, unique + indexed). */
export const slugField = (useAsSlug = 'title'): Field => payloadSlugField({ useAsSlug })

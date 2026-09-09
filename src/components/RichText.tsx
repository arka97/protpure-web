import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText, type JSXConvertersFunction, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import { cn, docPath } from '@/lib/utils'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const { relationTo, value } = linkNode.fields.doc ?? {}
      return docPath(relationTo as string, value as never)
    },
  }),
})

export function RichText({ data, className, invert }: { data?: SerializedEditorState | null; className?: string; invert?: boolean }) {
  if (!data) return null
  return <LexicalRichText data={data} converters={converters} className={cn('prose-protpure', invert && 'prose-invert-protpure', className)} />
}

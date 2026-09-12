import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText, type JSXConverters, type JSXConvertersFunction, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import { cn, docPath, mediaAlt, mediaUrl } from '@/lib/utils'
import type { Media } from '@/payload-types'

type TableCell = { type: 'tablecell'; headerState?: number; colSpan?: number; rowSpan?: number; children: unknown[] }
type TableRow = { type: 'tablerow'; children: TableCell[] }

/**
 * Editorial rich text: serif h2 / h3, a 680 px measure, mono figure captions and every table on the
 * site's `.spec-table` styling with scoped headers (first row of header cells → `<thead>`).
 */
const tableConverters: JSXConverters = {
  table: ({ node, nodesToJSX }) => {
    const rows = (node as unknown as { children: TableRow[] }).children ?? []
    const isHeaderRow = (r: TableRow) => r.children?.length > 0 && r.children.every((c) => (c.headerState ?? 0) > 0)
    const headRows = rows.length > 1 && isHeaderRow(rows[0]) ? [rows[0]] : []
    const bodyRows = headRows.length ? rows.slice(1) : rows
    return (
      <div className="overflow-x-auto">
        <table className="spec-table">
          {headRows.length ? <thead>{nodesToJSX({ nodes: headRows as never, parent: node as never })}</thead> : null}
          <tbody>{nodesToJSX({ nodes: bodyRows as never, parent: node as never })}</tbody>
        </table>
      </div>
    )
  },
  tablerow: ({ node, nodesToJSX }) => <tr>{nodesToJSX({ nodes: (node as unknown as TableRow).children as never, parent: node as never })}</tr>,
  tablecell: ({ node, nodesToJSX, parent }) => {
    const cell = node as unknown as TableCell
    const children = nodesToJSX({ nodes: cell.children as never, parent: node as never })
    const colSpan = cell.colSpan && cell.colSpan > 1 ? cell.colSpan : undefined
    const rowSpan = cell.rowSpan && cell.rowSpan > 1 ? cell.rowSpan : undefined
    if ((cell.headerState ?? 0) > 0) {
      // A header cell in the first (header) row labels a column; elsewhere it labels its row.
      const row = parent as unknown as TableRow
      const inHeadRow = row?.children?.every((c) => (c.headerState ?? 0) > 0)
      return (
        <th scope={inHeadRow ? 'col' : 'row'} colSpan={colSpan} rowSpan={rowSpan}>
          {children}
        </th>
      )
    }
    return (
      <td colSpan={colSpan} rowSpan={rowSpan}>
        {children}
      </td>
    )
  },
  upload: ({ node }) => {
    const value = (node as unknown as { value?: Media | number | null }).value
    if (!value || typeof value !== 'object') return null
    const url = mediaUrl(value, 'large') ?? mediaUrl(value)
    if (!url) return null
    if (!value.mimeType?.startsWith('image')) {
      return (
        <a href={url} rel="noopener noreferrer">
          {value.filename}
        </a>
      )
    }
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element -- Lexical uploads carry their own sizes; a plain img keeps the converter synchronous. */}
        <img src={url} alt={mediaAlt(value)} width={value.width ?? undefined} height={value.height ?? undefined} loading="lazy" />
        {value.caption ? <figcaption className="mono mt-3 text-[11px] leading-[1.5] text-text-2">{value.caption}</figcaption> : null}
      </figure>
    )
  },
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const { relationTo, value } = linkNode.fields.doc ?? {}
      return docPath(relationTo as string, value as never)
    },
  }),
  ...tableConverters,
})

export function RichText({ data, className, invert }: { data?: SerializedEditorState | null; className?: string; invert?: boolean }) {
  if (!data) return null
  return <LexicalRichText data={data} converters={converters} className={cn('prose-protpure', invert && 'prose-invert-protpure', className)} />
}

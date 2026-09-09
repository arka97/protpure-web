/**
 * Minimal Lexical → Markdown / plain text converters used for the AI-readable endpoints
 * (/md/*, llms-full.txt, MCP). Handles the node types the editor produces by default.
 */
type Node = {
  type: string
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  url?: string
  fields?: { url?: string; doc?: { relationTo?: string; value?: { slug?: string } } }
  children?: Node[]
  value?: { alt?: string; url?: string }
  [k: string]: unknown
}

export type LexicalData = { root?: { children?: Node[] } } | null | undefined

const BOLD = 1
const ITALIC = 2
const CODE = 16

function inline(nodes: Node[] = []): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') {
        let t = n.text ?? ''
        const f = typeof n.format === 'number' ? n.format : 0
        if (f & CODE) t = `\`${t}\``
        if (f & BOLD) t = `**${t}**`
        if (f & ITALIC) t = `*${t}*`
        return t
      }
      if (n.type === 'linebreak') return '\n'
      if (n.type === 'link' || n.type === 'autolink') {
        const href = n.fields?.url ?? (n.fields?.doc?.value?.slug ? `/${n.fields.doc.relationTo}/${n.fields.doc.value.slug}` : '#')
        return `[${inline(n.children)}](${href})`
      }
      return inline(n.children)
    })
    .join('')
}

function block(n: Node, depth = 0): string {
  switch (n.type) {
    case 'heading': {
      const level = Number(String(n.tag ?? 'h2').replace('h', '')) || 2
      return `${'#'.repeat(Math.min(level, 6))} ${inline(n.children)}`
    }
    case 'paragraph':
      return inline(n.children)
    case 'quote':
      return inline(n.children)
        .split('\n')
        .map((l) => `> ${l}`)
        .join('\n')
    case 'list': {
      const ordered = n.listType === 'number'
      return (n.children ?? [])
        .map((li, i) => {
          const nested = (li.children ?? []).filter((c) => c.type === 'list')
          const own = (li.children ?? []).filter((c) => c.type !== 'list')
          const marker = ordered ? `${i + 1}.` : '-'
          const line = `${'  '.repeat(depth)}${marker} ${inline(own)}`
          return [line, ...nested.map((c) => block(c, depth + 1))].join('\n')
        })
        .join('\n')
    }
    case 'horizontalrule':
      return '---'
    case 'upload':
      return n.value?.url ? `![${n.value.alt ?? ''}](${n.value.url})` : ''
    case 'table':
      return (n.children ?? [])
        .map((row, i) => {
          const cells = (row.children ?? []).map((cell) => inline(cell.children).replace(/\|/g, '\\|'))
          const line = `| ${cells.join(' | ')} |`
          return i === 0 ? `${line}\n| ${cells.map(() => '---').join(' | ')} |` : line
        })
        .join('\n')
    default:
      return inline(n.children)
  }
}

export function lexicalToMarkdown(data: LexicalData): string {
  const children = data?.root?.children ?? []
  return children
    .map((n) => block(n))
    .filter((s) => s.trim().length)
    .join('\n\n')
}

export function lexicalToText(data: LexicalData): string {
  return lexicalToMarkdown(data)
    .replace(/[#*`>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

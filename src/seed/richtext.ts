/**
 * Tiny Markdown-ish → Lexical converter for seeding. Supports paragraphs (blank-line separated),
 * `## h2` / `### h3`, `- bullets`, `1. numbered`, **bold**, *italic* and [links](url).
 */
type LexNode = Record<string, unknown>

const text = (t: string, format = 0): LexNode => ({ type: 'text', version: 1, text: t, format, mode: 'normal', style: '', detail: 0 })
const link = (children: LexNode[], url: string): LexNode => ({ type: 'link', version: 3, children, direction: 'ltr', format: '', indent: 0, fields: { linkType: 'custom', url, newTab: url.startsWith('http') } })

function inline(s: string): LexNode[] {
  const out: LexNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(text(s.slice(last, m.index)))
    if (m[1]) out.push(link([text(m[1])], m[2]))
    else if (m[3]) out.push(text(m[3], 1))
    else if (m[4]) out.push(text(m[4], 2))
    last = m.index + m[0].length
  }
  if (last < s.length) out.push(text(s.slice(last)))
  return out.length ? out : [text('')]
}

const block = (type: string, children: LexNode[], extra: LexNode = {}): LexNode => ({ type, version: 1, children, direction: 'ltr', format: '', indent: 0, ...extra })

export function rt(src: string) {
  const chunks = src
    .trim()
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean)
  const children: LexNode[] = []
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim())
    if (lines.every((l) => /^\|/.test(l))) {
      const rows = lines.filter((l) => !/^\|\s*-{3,}/.test(l)).map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
      children.push(
        block(
          'table',
          rows.map((cells, r) =>
            block(
              'tablerow',
              cells.map((c) => block('tablecell', [block('paragraph', inline(c), { textFormat: 0, textStyle: '' })], { headerState: r === 0 ? 1 : 0, colSpan: 1, rowSpan: 1, backgroundColor: null })),
            ),
          ),
        ),
      )
    } else if (lines.every((l) => /^- /.test(l))) {
      children.push(block('list', lines.map((l, i) => block('listitem', inline(l.slice(2)), { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' }))
    } else if (lines.every((l) => /^\d+\. /.test(l))) {
      children.push(block('list', lines.map((l, i) => block('listitem', inline(l.replace(/^\d+\. /, '')), { value: i + 1 })), { listType: 'number', start: 1, tag: 'ol' }))
    } else if (/^### /.test(lines[0])) {
      children.push(block('heading', inline(lines[0].slice(4)), { tag: 'h3' }))
    } else if (/^## /.test(lines[0])) {
      children.push(block('heading', inline(lines[0].slice(3)), { tag: 'h2' }))
    } else if (/^> /.test(lines[0])) {
      children.push(block('quote', inline(lines.map((l) => l.replace(/^> ?/, '')).join(' '))))
    } else {
      children.push(block('paragraph', inline(lines.join(' ')), { textFormat: 0, textStyle: '' }))
    }
  }
  return { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }
}

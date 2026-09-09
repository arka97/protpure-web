import { describe, expect, it } from 'vitest'
import { lexicalToMarkdown, lexicalToText } from '@/lib/lexical-md'
import { rt } from '@/seed/richtext'

describe('rt() → lexicalToMarkdown round trip', () => {
  it('renders headings, paragraphs, lists, bold and links', () => {
    const md = lexicalToMarkdown(rt(`## Heading

A paragraph with **bold** and a [link](https://example.com).

- one
- two`) as never)
    expect(md).toContain('## Heading')
    expect(md).toContain('**bold**')
    expect(md).toContain('[link](https://example.com)')
    expect(md).toContain('- one\n- two')
  })

  it('renders tables', () => {
    const md = lexicalToMarkdown(rt(`| A | B |
| --- | --- |
| 1 | 2 |`) as never)
    expect(md).toBe('| A | B |\n| --- | --- |\n| 1 | 2 |')
  })

  it('strips markup for plain text', () => {
    expect(lexicalToText(rt('**Bold** and [link](https://x.y)') as never)).toBe('Bold and link')
  })

  it('handles empty input', () => {
    expect(lexicalToMarkdown(null)).toBe('')
  })
})

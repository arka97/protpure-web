import { describe, expect, it } from 'vitest'
import { isSymbolPrefix, parseFigure, parseMax, parseNumber, parseRange, splitFigure, stripUnit } from '@/lib/figures'

describe('figure parsers', () => {
  it('parses ranges and numbers', () => {
    expect(parseRange('45–165 µm')).toEqual([45, 165])
    expect(parseRange('100 to 240 µm')).toEqual([100, 240])
    expect(parseRange('~90 µm')).toBeNull()
    expect(parseNumber('~90 µm')).toBe(90)
    expect(parseNumber('no digits')).toBeNull()
    expect(parseMax('800–1000 cm/h')).toBe(1000)
    expect(parseMax('~700 cm/h @ 0.1 MPa')).toBe(700)
    expect(parseMax(null)).toBeNull()
  })

  it('splits a figure into value, prefix and unit, keeping ranges whole', () => {
    expect(parseFigure('up to 1000 cm/h')).toEqual({ value: '1000', prefix: 'up to', unit: 'cm/h' })
    expect(parseFigure('≈100 mg lysozyme/mL')).toEqual({ value: '100', prefix: '≈', unit: 'mg lysozyme/mL' })
    expect(parseFigure('800–1000 cm/h')).toEqual({ value: '800–1000', prefix: '', unit: 'cm/h' })
    expect(parseFigure('')).toBeNull()
    expect(isSymbolPrefix('≈')).toBe(true)
    expect(isSymbolPrefix('up to')).toBe(false)
  })

  it('splits for the mono value / sans unit treatment', () => {
    expect(splitFigure('≈100 mg lysozyme/mL')).toEqual(['≈100', 'mg lysozyme/mL'])
    expect(splitFigure('800–1000 cm/h')).toEqual(['800–1000', 'cm/h'])
    expect(splitFigure('up to 700 cm/h (6%)')).toEqual(['up to 700', 'cm/h (6%)'])
    expect(splitFigure('~1000 cm/h @ 0.12 MPa')).toEqual(['~1000', 'cm/h @ 0.12 MPa'])
    expect(splitFigure('Up to 20 mg human IgG/mL resin')).toEqual(['Up to 20', 'mg human IgG/mL resin'])
    expect(splitFigure('Not applicable')).toEqual(['Not applicable', ''])
    expect(splitFigure(null)).toEqual(['', ''])
  })

  it('strips units from d50 values', () => {
    expect(stripUnit('~90 µm')).toBe('90')
    expect(stripUnit('60–65 µm')).toBe('60–65')
    expect(stripUnit('n/a')).toBe('n/a')
  })
})

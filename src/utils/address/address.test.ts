import { describe, it, expect } from 'vitest'
import { extractStreet, extractDistrict, normalizeStreet } from './address'

describe('address helpers', () => {
  it('extracts the street part', () => {
    expect(extractStreet('Bonner Str. 98 (50677 Neustadt/Süd)')).toBe('Bonner Str. 98')
  })

  it('returns the full address when no parentheses are present', () => {
    expect(extractStreet('Bonner Str. 98')).toBe('Bonner Str. 98')
  })

  it('extracts the district with PLZ', () => {
    expect(extractDistrict('Bonner Str. 98 (50677 Neustadt/Süd)')).toBe('50677 Neustadt/Süd')
  })

  it('returns empty string when no district pattern matches', () => {
    expect(extractDistrict('Bonner Str. 98')).toBe('')
  })

  it('normalizes Straße / Strasse to Str.', () => {
    expect(normalizeStreet('Bonner Straße')).toBe('bonner str.')
    expect(normalizeStreet('Bonner Strasse')).toBe('bonner str.')
    expect(normalizeStreet('Bonner Str.')).toBe('bonner str.')
  })
})

import { describe, it, expect } from 'vitest'
import en from '../dictionaries/en.json'
import tr from '../dictionaries/tr.json'

// Phase 2: verify all Phase 2 dictionary sections are populated (non-empty strings)
describe('Phase 2 dictionary values', () => {
  const phase2Sections = ['Hero', 'Features', 'WhyAstra', 'FinalCTA', 'Footer'] as const

  it('en.json Phase 2 sections have non-empty values', () => {
    for (const section of phase2Sections) {
      const sectionData = en[section] as Record<string, string>
      for (const [key, value] of Object.entries(sectionData)) {
        expect(value, `en.${section}.${key} must not be empty`).not.toBe('')
      }
    }
  })

  it('tr.json Phase 2 sections have non-empty values', () => {
    for (const section of phase2Sections) {
      const sectionData = tr[section] as Record<string, string>
      for (const [key, value] of Object.entries(sectionData)) {
        expect(value, `tr.${section}.${key} must not be empty`).not.toBe('')
      }
    }
  })
})

// I18N-01 + I18N-05: key parity between en.json and tr.json
describe('dictionary key parity', () => {
  it('tr.json has all top-level keys present in en.json', () => {
    const enKeys = Object.keys(en).sort()
    const trKeys = Object.keys(tr).sort()
    expect(trKeys).toEqual(enKeys)
  })

  it('each section in tr.json has all keys present in the corresponding en.json section', () => {
    for (const section of Object.keys(en) as Array<keyof typeof en>) {
      const enSection = en[section] as Record<string, unknown>
      const trSection = tr[section] as Record<string, unknown>
      if (typeof enSection === 'object' && enSection !== null) {
        const enSectionKeys = Object.keys(enSection).sort()
        const trSectionKeys = Object.keys(trSection ?? {}).sort()
        expect(trSectionKeys, `section "${section}" key mismatch`).toEqual(enSectionKeys)
      }
    }
  })
})

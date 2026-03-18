import { describe, it, expect } from 'vitest'
import en from '../dictionaries/en.json'
import tr from '../dictionaries/tr.json'

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

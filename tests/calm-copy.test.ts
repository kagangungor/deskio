import { describe, expect, test } from 'bun:test'
import { en } from '../src/lib/i18n/en'
import { tr } from '../src/lib/i18n/tr'

// Copy gate for the Sakin (Calm) module (spec 08 §9, ADR-0023 D7) — the same pattern as
// banned-colors: the words that would turn beauty into a generic cleaner are test-gated, and
// the per-item precision rules (hide ≠ disable; no ad-count claims) are pinned.

const calmKeys = (Object.keys(en) as (keyof typeof en)[]).filter(
  (k) => k.startsWith('Calm_') || k === 'Rail_Calm' || k === 'Panel_CalmTitle',
)

// Cleaner-register vocabulary is constitutionally banned for this module
// (ADR-0004 §1/§5 + ADR-0023 D7).
const BANNED_TR = ['temizle', 'optimize', 'hızlandır', 'risk', 'problem', 'reklam']
const BANNED_EN = [/\bclean\b/i, /\bcleaner\b/i, /\boptimi[sz]e/i, /\bboost/i, /\bscan/i, /\brisk/i, /\bproblem/i, /\bads?\b/i]
// Global user-copy bans (spec 01 §UI Language + the no-dash decree, ADR-0013).
const BANNED_GLOBAL_TR = ['kayıt defteri', 'önbellek', 'hklm', 'journal', '—']
const BANNED_GLOBAL_EN = [/registry/i, /snapshot/i, /HKLM/, /journal/i, /—/]
// Regression gate for the R1 hyphen finding: no hyphenated compounds in en copy
// (the two shipped violations were reworded; this keeps them out).
const EN_HYPHEN = /[A-Za-z]-[A-Za-z]/

describe('calm copy gate', () => {
  test('every calm key exists in both dictionaries', () => {
    for (const k of calmKeys) {
      expect(tr[k as keyof typeof tr], `tr missing ${k}`).toBeTruthy()
      expect(en[k], `en missing ${k}`).toBeTruthy()
    }
    expect(calmKeys.length).toBeGreaterThan(50)
  })

  test('cleaner/anxiety register is banned (tr)', () => {
    for (const k of calmKeys) {
      const v = (tr[k as keyof typeof tr] as string).toLowerCase()
      for (const w of [...BANNED_TR, ...BANNED_GLOBAL_TR]) {
        expect(v.includes(w), `${k} contains banned "${w}": ${v}`).toBe(false)
      }
    }
  })

  test('cleaner/anxiety register is banned (en)', () => {
    for (const k of calmKeys) {
      const v = en[k] as string
      for (const re of [...BANNED_EN, ...BANNED_GLOBAL_EN]) {
        expect(re.test(v), `${k} matches banned ${re}: ${v}`).toBe(false)
      }
      // Win+S / Win+Tab are key names, not hyphenated compounds.
      const stripped = v.replace(/Win\+\w+/g, '')
      expect(EN_HYPHEN.test(stripped), `${k} has hyphenated copy: ${v}`).toBe(false)
    }
  })

  test('precision: hiding taskbar entries never claims disabling the feature', () => {
    expect(tr.Calm_TaskbarSearch_Desc.toLowerCase().includes('gizle')).toBe(true)
    expect(tr.Calm_TaskbarSearch_Desc).toContain('Win+S')
    expect(tr.Calm_TaskbarSearch_Desc).toContain('çalışır')
    expect(tr.Calm_TaskbarSearch_Desc.includes('Aramayı kapat')).toBe(false)
    expect(en.Calm_TaskbarSearch_Desc.startsWith('Hide')).toBe(true)
    expect(en.Calm_TaskbarSearch_Desc).toContain('Win+S')
    expect(/still works/.test(en.Calm_TaskbarSearch_Desc)).toBe(true)
    expect(/disable/i.test(en.Calm_TaskbarSearch_Desc)).toBe(false)
    expect(tr.Calm_TaskView_Desc.toLowerCase().includes('gizle')).toBe(true)
    expect(tr.Calm_TaskView_Desc).toContain('Win+Tab')
    expect(tr.Calm_TaskView_Desc).toContain('çalışır')
    expect(tr.Calm_TaskView_Desc.includes('Görev görünümünü kapat')).toBe(false)
    expect(en.Calm_TaskView_Desc.startsWith('Hide')).toBe(true)
    expect(en.Calm_TaskView_Desc).toContain('Win+Tab')
    expect(/still works/.test(en.Calm_TaskView_Desc)).toBe(true)
    expect(/disable/i.test(en.Calm_TaskView_Desc)).toBe(false)
  })

  test('precision: Start copy is scoped and never promises removal of every promo/account surface', () => {
    // WHERE now lives in the row schematic; the desc keeps the honest scope note.
    expect(tr.Calm_StartRecs_Desc).toContain('kalır') // the honest keeps-your-files note
    expect(en.Calm_StartRecs_Desc).toContain('stay')
    for (const k of calmKeys) {
      const v = tr[k as keyof typeof tr] as string
      expect(v.includes('tüm önerileri kaldır'), `${k} overclaims: ${v}`).toBe(false)
      expect(v.includes('hesap uyarıları'), `${k} promises account-notice removal: ${v}`).toBe(false)
    }
  })

  test('precision: sync-provider collateral is disclosed', () => {
    expect(tr.Calm_SyncNotif_Collateral.toLowerCase()).toContain('eşitleme')
    expect(en.Calm_SyncNotif_Collateral.toLowerCase()).toContain('sync')
  })

  test('restore copy says Windows önerilerini geri yükle', () => {
    expect(tr.Calm_Restore).toBe('Windows önerilerini geri yükle')
  })

  test('manual-route copy names YOU as the actor — the app opens the page, never claims it flips the switch', () => {
    const routeKeys = calmKeys.filter((k) => k.endsWith('_Route'))
    expect(routeKeys.length).toBeGreaterThanOrEqual(12)
    for (const k of routeKeys) {
      expect((tr[k as keyof typeof tr] as string).includes('kendiniz'), `tr ${k} must name kendiniz as the actor`).toBe(true)
      expect(/yourself/i.test(en[k] as string), `en ${k} must name the reader as the actor`).toBe(true)
    }
  })

  test('the widgets family row names the whole family it attests (feed, hover, badges, announcements)', () => {
    const trFamily = tr.Calm_WidgetsFeed_Desc + tr.Calm_WidgetsFeed_Route
    for (const part of ['akış', 'üzerine gelme', 'rozet', 'duyuru']) {
      expect(tr.Calm_WidgetsFeed_Desc.includes(part) || trFamily.includes(part), `widgets family missing ${part}`).toBe(true)
    }
    for (const part of ['akış', 'üzerine gelme', 'rozet', 'duyuru']) {
      expect(tr.Calm_WidgetsFeed_Desc.includes(part), `visible desc missing ${part}`).toBe(true)
    }
  })
})

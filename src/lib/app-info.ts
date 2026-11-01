import type { AppInfoDto } from '@/bridge/types'
import { BRIDGE_SCHEMA_VERSION } from '@/bridge/types'

// The app's identity blob (links, product names, changelog) is FRONTEND content —
// single-sourced here so the browser mock and the Tauri host serve the same facts.
// Only `version` is host truth: the Tauri bridge overrides it with the real app
// version (the mock's 0.0.0 leaking into the About card was the owner's 2026-07-16
// "版本 0.0.0" report).
export const appInfo: AppInfoDto = {
  schemaVersion: BRIDGE_SCHEMA_VERSION,
  version: '1.0.0',
  productNameTr: 'Deskio',
  productNameEn: 'Deskio',
  effectiveDark: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  links: {
    repo: 'https://github.com/kagangungor/deskio',
    releases: 'https://github.com/kagangungor/deskio/releases',
    issues: 'https://github.com/kagangungor/deskio/issues',
    email: 'kagangungor@dlinemedia.com',
    homepage: 'https://github.com/kagangungor/deskio',
    githubProfile: 'https://github.com/kagangungor',
    x: 'https://x.com/kaganismy',
    bilibili: '',
    douyin: '',
  },
  changelogTr: [
    { version: 'Yayınlanmadı · Önizleme', items: ['Yeni v3 görsel dili: açık tema öncelikli, gömülü yazı tipleri', 'Yenilenen tuval araç çubuğu, dokunmatik yüzey hareketleri', 'Uygulama öncesi onay ve tamamlama akışı'] },
  ],
  changelogEn: [
    { version: 'Unreleased · Preview', items: ['New v3 visual language: light-first, bundled fonts', 'Reworked canvas toolbar, trackpad gestures', 'Apply consent & completion flow'] },
  ],
}

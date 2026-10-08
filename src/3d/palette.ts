/**
 * Scene colours, read once from the Avortyx Night tokens on :root so the 3D
 * stages always match the rest of the site. Hex fallbacks cover SSR/tests.
 */
function token(name: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
}

export const palette = {
  brand: token('--brand-400', '#60a5fa'),
  brandSoft: token('--brand-300', '#93c5fd'),
  brandDeep: token('--brand-600', '#2563eb'),
  ok: token('--ok', '#34c77b'),
  warn: token('--warn', '#f2b544'),
  crit: token('--crit', '#ef5a5a'),
  fg2: token('--fg-2', '#bbc2cf'),
  fg3: token('--fg-3', '#8a93a3'),
  fg4: token('--fg-4', '#646c7b'),
  canvas: token('--bg-canvas', '#0b0c10'),
  surface: token('--bg-surface', '#111318'),
  raised: token('--bg-raised', '#171a20'),
  overlay: token('--bg-overlay', '#1d2129'),
  /** --line / --line-strong are white-alpha in CSS; these are their opaque equivalents on the stage. */
  line: '#262a31',
  lineStrong: '#363b45',
  /** Chart series in fixed order: converted, not converted, no answer, blocked. */
  series: [
    token('--s1', '#3987e5'),
    token('--s2', '#d95926'),
    token('--s3', '#199e70'),
    token('--s4', '#c98500'),
  ],
} as const

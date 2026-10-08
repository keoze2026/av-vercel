# Avortyx (React + TypeScript + Tailwind + shadcn/ui)

The Avortyx pay-per-call marketing site in React 19, TypeScript, Tailwind CSS v4 and shadcn/ui.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

`vercel.json` rewrites every non-asset path to `index.html`, so client-side routes work when deployed to Vercel.

## Stack

- **Vite 7** with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **shadcn/ui** (Radix base, `components.json`): Button, Badge, Card, Tabs, Accordion, NavigationMenu, Sheet, Select, Slider, Input, Textarea, Label, Table, Breadcrumb, Tooltip, Sonner. Add more with `npx shadcn@latest add <name>`.
- **React Router 7** for routing: `/`, `/product/:id`, `/resources/*`, `/company/*`, `/enterprise-specs`
- **framer-motion** for the hero load sequence, page fades and one-time reveals; **Lenis** for inertial page scrolling
- **three.js + @react-three/fiber + drei** for the background animations in `src/3d`, lazy-loaded so they stay out of the page bundles
- **Geist + Geist Mono**, self-hosted via `@fontsource-variable/*`; **lucide-react** icons

## Layout

```
src/
  App.tsx                 routes, page transitions, scroll handling, toaster
  index.css               Avortyx Night tokens → shadcn roles → Tailwind theme; site utilities
  styles/signal.css       signal traces, gauge, live-row and waveform keyframes
  3d/                     three.js background scenes, kept apart from page code (see below)
  data/                   products, scenarios, engine (routing-engine, comparison, step mocks), site nav
  lib/utils.ts            cn() with the type scale registered for conflict resolution
  lib/motion.ts           reduced-motion helpers, useGoToSection()
  hooks/                  useReducedMotion, usePageTitle
  components/
    ui/                   shadcn/ui primitives, tuned to the tokens
    brand/                Section (chassis), StatusChip/SampleTag, BrowserFrame, Meter,
                          CircuitNode/RingNode, SignalBeams, Reveal
    layout/               Header (floating pill, mega menu, mobile sheet), Footer, PageShell
    home/                 home-page sections, RoutingEngine, ProductFragment, console preview
    product/              product hero (with its 3D backdrop), dashboard, chart
    generic/              integration logos, sales request form
  pages/                  Home, ProductPage, GenericPage
```

## Styling notes

The visual system is **Avortyx Night (design system v2)** from `docs/Avortyx-UI-Benchmark-and-Design-Principles.pdf` (Part III).

- **Tokens** live on `:root` in `src/index.css` and are mapped twice: onto shadcn's semantic roles (`background`, `primary`, `muted`, `accent`, `border`, `ring` …) and onto site utilities (`bg-canvas` / `surface` / `raised` / `inset`, `text-fg` / `fg-2` / `fg-3` / `fg-4`, `border-line` / `line-subtle` / `line-strong`, `text-brand`, `bg-ok` / `warn` / `risk` / `crit`, `s1`…`s4`).
- **One accent.** The blue lives in `--brand-*` (`text-brand`, `bg-brand/12` …). Note that shadcn's `accent` is the neutral hover surface, not the brand colour. To trial another accent, change the five `--brand-*` values.
- **Type scale** (12 px floor): `text-label` 12 · `text-caption` 13 · `sm` 14 · `base` 16 · `lg` 18 · `text-h3` 20 · `text-h2` 28 · `text-h1` 40 · `text-display` 56 · `text-display-xl` 72. Tracking tokens: `tracking-display`, `tracking-heading`, `tracking-label`. These are registered in `lib/utils.ts` so `cn()` doesn't treat them as colours; register any new scale token there too.
- **Radius:** `xs` 4 (tags) · `sm` 6 · `md` 9 (buttons, inputs) · `lg` 12 (cards) · `xl` 16 (panels, mock frames) · `2xl` 24 (hero frames). **Elevation:** `shadow-e1/e2/e3`, `shadow-glow` (one per view), `shadow-cta`.
- **Chassis:** sections render inside `<Section>`, a 1200 px column with hairline rails and registration marks where section rules meet them.
- **Status** colours describe states only and always come with a dot or icon plus a label (`<StatusChip>`). Every mock carries one `<SampleTag>`.
- **Mocks show the machine:** product tiles, product heroes and "Why Avortyx" use coded console fragments with sample data, rendered in their final state on first paint.
- **Motion:** live feeds tick no faster than every 2 s, pause when off-screen, and have a pause control. Under `prefers-reduced-motion` the hero engine starts paused with a Play control and decorative loops stop.
- **Grids:** responsive grids start from `grid-cols-1` (`minmax(0,1fr)`) so wide mono content can't push a column past the viewport on phones.
- **Mobile grids:** where items are short (workflow steps, capabilities, features, footer links, pickers), phones get two columns; with an odd count the last item spans both (`max-md:odd:last:col-span-2`).
- **Smooth scrolling:** `lib/smooth-scroll.ts` runs one Lenis instance (wheel input glides to a stop; touch keeps native momentum; off under reduced motion). It pauses while a dialog or sheet locks the page, and nested scrollers scroll natively. Use `scrollToTarget()` / `scrollToId()` for programmatic scrolls so they share the glide and respect the header offset (`scroll-padding-top`).
- **Scrollbars** are styled in the base layer of `index.css`: a thin rounded thumb in the line colours that turns brand blue while dragged (`::-webkit-scrollbar` for Chromium/Safari, `scrollbar-color` for Firefox).

## 3D (`src/3d`)

Every three.js file lives here, so the scenes can be maintained without touching page code. The scenes are **backgrounds**: the ambient call field sits behind the home hero, and each product hero shows its service's scene behind the (frosted) console card. There is no section dedicated to 3D.

```
src/3d/
  index.ts             public API: SceneBackdrop, backdropConfigs
  SceneBackdrop.tsx    the background layer + pause control; no three.js import, safe in any chunk
  BackdropCanvas.tsx   the WebGL canvas (lazy chunk): camera rig with pointer parallax, fog, lights, floor
  config.ts            per-scene camera, fog and still frame
  palette.ts           scene colours read from the design tokens on :root
  primitives.tsx       floor grid, chips, anti-aliased hairline traces, gates, glows, trailed packets
  scenes/              AmbientScene (home hero) and one scene per service; register in scenes/index.ts
```

- `<SceneBackdrop scene="…" className="…" />` is absolutely positioned (`-z-10`) inside an `isolate` section; size, mask and opacity it with `className`.
- Each scene is a pure function of scene time (`useStageTime()`), so loops are deterministic, light trails are the same function sampled slightly in the past, and the still frame under reduced motion is reproducible (`stillTime`). Backdrops run at 0.6× speed.
- Halos use `lightBlending` (additive colour, no alpha write) so they only ever brighten the page behind a transparent canvas.
- three.js loads when the area is within 300 px of the viewport and the browser is idle; the canvas fades in on its first frame, pauses off-screen or in a hidden tab, and holds a still frame under reduced motion. Phones get DPR ≤ 1.25, no MSAA and 30 fps.
- To add a scene: write `scenes/<Name>Scene.tsx`, register it in `scenes/index.ts`, add its entry to `config.ts`.

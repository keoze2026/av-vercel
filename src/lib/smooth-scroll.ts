import Lenis from 'lenis'

/**
 * Inertial page scrolling: wheel input eases to a stop instead of halting.
 * Touch keeps the device's native momentum; reduced motion turns smoothing off
 * (Lenis's `respectReducedMotion`). One instance for the whole app.
 */
let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis
  lenis = new Lenis({
    autoRaf: true,
    /** Glide: each frame closes 10% of the remaining distance. */
    lerp: 0.1,
    /** Chat logs, menus, selects and sheets scroll natively. */
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  })

  // Dialogs and sheets lock the page (Radix sets data-scroll-locked on <body>);
  // Lenis doesn't see that lock, so pause it while one is open.
  const syncLock = () => {
    if (document.body.hasAttribute('data-scroll-locked')) lenis?.stop()
    else lenis?.start()
  }
  new MutationObserver(syncLock).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-scroll-locked'],
  })
  return lenis
}

/** Room left above a scrolled-to element for the floating header (html scroll-padding-top). */
function headerOffset() {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 96
}

/**
 * Scrolls to an element (below the header) or a y position, through Lenis when
 * it is running so the motion matches the wheel glide. Lenis applies the page's
 * scroll-padding-top itself; the native fallback subtracts it explicitly.
 */
export function scrollToTarget(target: HTMLElement | number, { immediate = false } = {}) {
  if (lenis) {
    // Pages load lazily; re-measure so a jump right after a route change is not clamped.
    lenis.resize()
    lenis.scrollTo(target, { immediate, force: true, duration: immediate ? 0 : 1.1 })
    return
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top =
    typeof target === 'number'
      ? target
      : target.getBoundingClientRect().top + window.scrollY - headerOffset()
  window.scrollTo({ top, behavior: immediate || reduce ? 'auto' : 'smooth' })
}

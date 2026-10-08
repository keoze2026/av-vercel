import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import type { SceneId } from './config'

const BackdropCanvas = lazy(() => import('./BackdropCanvas'))

interface SceneBackdropProps {
  scene: SceneId
  /** Sizing, masking and opacity for the layer (it is absolutely positioned). */
  className?: string
  /** Where the pause control sits inside the parent. */
  controlClassName?: string
  /** Colour the scene fogs into; match the section background. */
  fog?: string
}

/**
 * A 3D scene as a quiet background layer. Nothing loads until the area is near
 * the viewport and the browser is idle; it fades in on its first frame, pauses
 * off-screen or in a hidden tab, and holds a still frame under reduced motion.
 * A small control lets anyone pause it.
 */
export function SceneBackdrop({ scene, className, controlClassName, fog }: SceneBackdropProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const [paused, setPaused] = useState(false)
  const [lite] = useState(() => window.matchMedia('(max-width: 768px)').matches)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let idle = 0
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        near.disconnect()
        // Never compete with the page's first paint.
        const start = () => setMounted(true)
        idle = window.requestIdleCallback
          ? window.requestIdleCallback(start, { timeout: 1500 })
          : window.setTimeout(start, 400)
      },
      { rootMargin: '300px' },
    )
    const visible = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    near.observe(el)
    visible.observe(el)
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      near.disconnect()
      visible.disconnect()
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const playing = !reducedMotion && !paused && inView && tabVisible

  return (
    <>
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
      >
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-1400 ease-out',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        >
          {mounted && (
            <Suspense fallback={null}>
              <BackdropCanvas
                scene={scene}
                playing={playing}
                lite={lite}
                fog={fog}
                onReady={() => setReady(true)}
              />
            </Suspense>
          )}
        </div>
      </div>
      {ready && !reducedMotion && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? 'Play background animation' : 'Pause background animation'}
          title={paused ? 'Play background animation' : 'Pause background animation'}
          className={cn(
            'absolute z-10 grid size-7 place-items-center rounded-full border border-line bg-canvas/60 text-fg-3 backdrop-blur transition-colors hover:border-line-strong hover:text-fg [&_svg]:size-3',
            controlClassName,
          )}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      )}
    </>
  )
}

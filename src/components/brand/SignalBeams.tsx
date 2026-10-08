import { useEffect, useState, type RefObject } from 'react'

export type BeamState = 'idle' | 'flow' | 'active' | 'muted'

export interface BeamLink {
  from: RefObject<HTMLElement | null>
  to: RefObject<HTMLElement | null>
}

interface SignalBeamsProps {
  containerRef: RefObject<HTMLElement | null>
  /** Endpoints; keep this array stable (module constant or useMemo). */
  links: BeamLink[]
  states: BeamState[]
  /** Restarts the packet animation on the active beam when it changes. */
  packetKey?: string | number
  showPacket?: boolean
}

/**
 * Signal traces drawn between real DOM nodes, measured relative to a container.
 * The trace runs from the right edge of `from` to the left edge of `to`.
 */
export function SignalBeams({
  containerRef,
  links,
  states,
  packetKey,
  showPacket = true,
}: SignalBeamsProps) {
  const [geometry, setGeometry] = useState({ w: 0, h: 0, paths: [] as string[] })

  // A passive effect: refs on the parent and on later siblings are attached by now.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const c = container.getBoundingClientRect()
      const paths = links.map(({ from, to }) => {
        const a = from.current?.getBoundingClientRect()
        const b = to.current?.getBoundingClientRect()
        if (!a || !b) return ''
        const x1 = a.right - c.left
        const y1 = a.top + a.height / 2 - c.top
        const x2 = b.left - c.left
        const y2 = b.top + b.height / 2 - c.top
        const dx = Math.max(24, (x2 - x1) * 0.55)
        return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
      })
      setGeometry({ w: c.width, h: c.height, paths })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    for (const { from, to } of links) {
      if (from.current) observer.observe(from.current)
      if (to.current) observer.observe(to.current)
    }
    window.addEventListener('resize', update)
    document.fonts?.ready.then(update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [containerRef, links])

  const { w, h, paths } = geometry
  if (!w) return null

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
    >
      {paths.map((d, i) =>
        d ? (
          <g key={i}>
            <path d={d} className="beam-base" />
            <path d={d} className="beam-signal" data-state={states[i] ?? 'idle'} />
            {showPacket && states[i] === 'active' && (
              <circle key={packetKey} r="3" className="beam-packet">
                <animateMotion path={d} dur="0.9s" repeatCount="1" fill="freeze" />
              </circle>
            )}
          </g>
        ) : null,
      )}
    </svg>
  )
}

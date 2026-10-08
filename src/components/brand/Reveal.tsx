import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Tag = 'div' | 'li' | 'p'
type Direction = 'up' | 'left' | 'right'

const tags = { div: motion.div, li: motion.li, p: motion.p }

/** Small offsets: the content slides a short way into place, never across the page. */
const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 16 },
  left: { x: -20 },
  right: { x: 20 },
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  as?: Tag
  direction?: Direction
  /** Seconds. For grid items use a small per-column step, e.g. (i % 3) * 0.07. */
  delay?: number
}

/**
 * Slides and fades a block into place once, as it scrolls into view (600ms, ease-out-expo).
 * Static under prefers-reduced-motion: content simply renders in place.
 */
export function Reveal({ children, className, as = 'div', direction = 'up', delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()
  const Component = tags[as] as typeof motion.div
  return (
    <Component
      className={className}
      initial={reduce ? false : { opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Component>
  )
}

/** Stagger step for item `i` in a grid with `columns` columns. */
export const stagger = (i: number, columns = 3, step = 0.07) => (i % columns) * step

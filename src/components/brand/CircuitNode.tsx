import { forwardRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CircuitNodeProps {
  icon: LucideIcon
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'size-9 rounded-md [&_svg]:size-4',
  md: 'size-11 rounded-lg [&_svg]:size-[18px]',
  lg: 'size-14 rounded-xl [&_svg]:size-6',
}

/** A chip on the signal path: neutral at rest, lit when the call is on it. */
export const CircuitNode = forwardRef<HTMLSpanElement, CircuitNodeProps>(function CircuitNode(
  { icon: Icon, active = false, size = 'md', className },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'relative grid shrink-0 place-items-center border bg-raised inner-highlight transition-[color,border-color,box-shadow] duration-320 ease-(--ease-standard)',
        sizes[size],
        active ? 'border-brand/55 text-brand-300 shadow-glow' : 'border-line-strong text-fg-3',
        className,
      )}
    >
      <Icon />
    </span>
  )
})

/** Concentric rings around a node: the hub of a diagram. */
export function RingNode({ icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative grid size-44 shrink-0 place-items-center rounded-full border border-line-subtle', className)}
    >
      <div className="absolute inset-5 rounded-full border border-line" />
      <div className="absolute inset-11 rounded-full border border-brand/30 bg-brand/5 shadow-[0_0_48px_-8px] shadow-brand/40" />
      <CircuitNode icon={icon} active size="lg" />
    </div>
  )
}

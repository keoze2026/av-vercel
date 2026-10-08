import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Tone = 'ok' | 'warn' | 'risk' | 'crit' | 'brand' | 'neutral'

export const toneVar: Record<Tone, string> = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  risk: 'var(--risk)',
  crit: 'var(--crit)',
  brand: 'var(--brand-400)',
  neutral: 'var(--fg-3)',
}

interface StatusChipProps {
  tone?: Tone
  /** Pulsing dot: reserved for genuinely live states. */
  live?: boolean
  /** Hide the dot when an icon is passed as a child. */
  dot?: boolean
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
}

/** A dot plus a label, always: status never relies on colour alone. */
export function StatusChip({
  tone = 'neutral',
  live = false,
  dot = true,
  size = 'md',
  className,
  children,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        'tone-chip inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap [&_svg]:size-3',
        size === 'md' ? 'h-6 px-2.5 text-label' : 'h-5 px-2 text-label',
        className,
      )}
      style={{ '--tone': toneVar[tone] } as CSSProperties}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn('size-1.5 shrink-0 rounded-full bg-current', live && 'animate-live')}
        />
      )}
      {children}
    </span>
  )
}

/** The one "Sample data" convention used on every mock. */
export function SampleTag({ children = 'Sample data', className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center rounded-xs border border-warn/30 bg-warn/10 px-1.5 font-mono text-label font-medium tracking-label whitespace-nowrap text-warn uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

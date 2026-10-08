import type { ReactNode } from 'react'
import { Reveal } from '@/components/brand/Reveal'
import { cn } from '@/lib/utils'

/** Mono eyebrow with a 16px leading rule. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-3 font-mono text-label font-medium tracking-widest text-fg-3 uppercase',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-4 bg-brand" />
      {children}
    </p>
  )
}

interface SectionHeaderProps {
  label: string
  title: ReactNode
  desc?: ReactNode
  align?: 'left' | 'center'
  /** Rendered beside the copy (left) or under it (center): usually one CTA. */
  actions?: ReactNode
  className?: string
}

/** Eyebrow, H2 and a one-line lede. */
export function SectionHeader({
  label,
  title,
  desc,
  align = 'left',
  actions,
  className,
}: SectionHeaderProps) {
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'mb-10 flex gap-6 md:mb-14',
        centered
          ? 'mx-auto max-w-3xl flex-col items-center text-center'
          : 'flex-col md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-4', centered ? 'items-center' : 'max-w-2xl')}>
        <Reveal>
          <Eyebrow>{label}</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-heading text-h2 font-semibold tracking-tight text-fg md:text-h1 md:tracking-heading">
            {title}
          </h2>
        </Reveal>
        {desc && (
          <Reveal as="p" delay={0.12} className="max-w-[62ch] text-base text-fg-2 md:text-lg">
            {desc}
          </Reveal>
        )}
      </div>
      {actions && (
        <Reveal delay={0.18} className="flex shrink-0 flex-wrap gap-3">
          {actions}
        </Reveal>
      )}
    </div>
  )
}

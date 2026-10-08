import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends ComponentProps<'section'> {
  /** Draw the hairline rule (with registration marks) above the section. */
  rule?: boolean
  innerClassName?: string
}

/**
 * A page section inside the chassis: a 1200px column with hairline rails.
 * Rhythm: 96px desktop · 64px tablet · 48px mobile.
 */
export function Section({ rule = true, className, innerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn('relative', rule && 'border-t border-line-subtle', className)} {...props}>
      <div className={cn('chassis py-12 md:py-16 lg:py-24', rule && 'rule-marks', innerClassName)}>
        {children}
      </div>
    </section>
  )
}

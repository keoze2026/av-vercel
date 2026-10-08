import { cn } from '@/lib/utils'

interface MeterProps {
  value: number
  max: number
  /** Printed beside the bar; never shown by colour alone. */
  label?: string
  className?: string
}

/** Cap bar: accent until 80%, then warn, crit at the cap. */
export function Meter({ value, max, label, className }: MeterProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const fill = pct >= 100 ? 'bg-crit' : pct >= 80 ? 'bg-warn' : 'bg-brand'
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-overlay">
        <div
          className={cn('h-full rounded-full transition-[width] duration-600 ease-out-expo', fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {label && <span className="shrink-0 font-mono text-label text-fg-3">{label}</span>}
    </div>
  )
}

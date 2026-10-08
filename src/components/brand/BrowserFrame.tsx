import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BrowserFrameProps {
  /** Path after the host, e.g. "routing / medicare-open-enrollment". */
  path: string
  /** Right side of the title bar: a status chip and/or the sample tag. */
  status?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}

/** Console fragment framed in app chrome with a real-looking URL. */
export function BrowserFrame({ path, status, className, bodyClassName, children }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line bg-surface shadow-e3 inner-highlight',
        className,
      )}
    >
      <div className="flex h-11 items-center gap-3 border-b border-line-subtle bg-inset/80 px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-fg-4/45" />
          <span className="size-2.5 rounded-full bg-fg-4/45" />
          <span className="size-2.5 rounded-full bg-fg-4/45" />
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <span className="truncate rounded-sm border border-line-subtle bg-raised/70 px-3 py-0.5 font-mono text-label text-fg-3">
            <span className="text-fg-2">app.avortyx.com</span> / {path}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">{status}</div>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

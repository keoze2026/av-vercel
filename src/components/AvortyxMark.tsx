import { useId } from 'react'
import { cn } from '@/lib/utils'

/** The Avortyx vortex mark (three open arcs), matching the live site's logo. */
export function AvortyxMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={cn('size-7', className)}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="55%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <radialGradient id={`${id}-c`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="20" fill={`url(#${id}-c)`} opacity="0.5" />
      <path d="M52 32a20 20 0 1 1-13.2-18.8" stroke={`url(#${id}-g)`} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M44.5 32a12.5 12.5 0 1 1-8.9-11.9" stroke={`url(#${id}-g)`} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M38 32a6 6 0 1 1-4.2-5.7" stroke={`url(#${id}-g)`} strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
      <circle cx="32" cy="32" r="1.9" fill="#93C5FD" />
    </svg>
  )
}

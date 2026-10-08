import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bot, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  role: 'ai' | 'user'
  text: string
}

export interface ChatWidgetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  greeting: string
  placeholder: string
  openLabel: string
  closeLabel: string
}

const AUTO_REPLY =
  'This AI assistant cannot access live product or account information. Contact hello@avortyx.io for an Avortyx response.'

export function ChatWidget({
  open,
  onOpenChange,
  greeting,
  placeholder,
  openLabel,
  closeLabel,
}: ChatWidgetProps) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ id: 1, role: 'ai', text: greeting }])
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: draft }])
    setDraft('')
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: AUTO_REPLY }])
    }, 1200)
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {/* Panel height leaves room for the floating navbar above (--header-height: 12px offset +
          56px pill + 12px gap) and for the 12px gap, 48px button and bottom inset below. */}
      {open && (
        <div className="flex h-[min(500px,calc(100dvh-var(--header-height)-76px))] w-[min(380px,calc(100vw-32px))] md:h-[min(500px,calc(100dvh-var(--header-height)-84px))] origin-bottom-right animate-in flex-col overflow-hidden rounded-xl border border-line bg-popover shadow-e3 duration-200 fade-in-0 zoom-in-95 slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-md border border-brand/35 bg-brand/12 text-brand-300">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">AI assistant</span>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Close support chat" onClick={() => onOpenChange(false)}>
              <X />
            </Button>
          </div>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label="AI assistant conversation"
            className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm',
                  m.role === 'ai'
                    ? 'self-start border border-line-subtle bg-raised text-fg-2'
                    : 'self-end bg-primary text-primary-foreground',
                )}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex gap-2 border-t border-line-subtle p-3">
            <Input
              aria-label="Message the AI assistant"
              placeholder={placeholder}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-9"
            />
            <Button type="submit" size="icon" className="size-9" aria-label="Send message">
              <Send />
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className="grid size-12 place-items-center rounded-full border border-line-strong bg-raised text-brand-300 shadow-e2 transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-brand/45"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Bot className="size-5" aria-hidden="true" />}
      </button>
    </div>
  )
}

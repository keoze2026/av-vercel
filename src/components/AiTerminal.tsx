import { useState, type PointerEvent } from 'react'
import { useNavigate } from 'react-router'
import { Minus, Terminal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scrollToId } from '@/lib/motion'

const MAX_LINES = 15

/** Draggable command terminal; collapsed to a round button bottom-left. Desktop only. */
export function AiTerminal() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [pos, setPos] = useState({ x: 24, y: 120 })
  const [lines, setLines] = useState([
    '[DEMO] Sample site controls.',
    '[HELP] Commands: pricing, compliance, clear',
  ])
  const [input, setInput] = useState('')

  const startDrag = (e: PointerEvent) => {
    if ((e.target as Element).closest('button')) return
    const dx = e.clientX - pos.x
    const dy = e.clientY - pos.y
    const move = (ev: globalThis.PointerEvent) => setPos({ x: ev.clientX - dx, y: ev.clientY - dy })
    const up = () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }

  const push = (line: string) => setLines((prev) => [...prev.slice(-MAX_LINES), line])

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    push(`> ${cmd}`)
    if (cmd.includes('pricing')) {
      push('[NAV] → Pricing...')
      navigate('/#pricing')
      setTimeout(() => {
        scrollToId('pricing')
      }, 100)
    } else if (cmd.includes('compliance') || cmd.includes('fraud')) {
      push('[NAV] → Compliance Screening...')
      navigate('/product/fraud')
    } else if (cmd === 'clear') {
      setLines(['[SYS] Buffer cleared.'])
    } else {
      push('[HELP] Available commands: pricing, compliance, clear')
    }
    setInput('')
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open terminal"
        className="fixed bottom-6 left-6 z-40 hidden size-11 place-items-center rounded-full border border-line bg-raised text-fg-3 shadow-e2 transition-colors hover:border-line-strong hover:text-fg md:grid"
      >
        <Terminal className="size-4" />
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      className="fixed z-40 hidden w-95 max-w-[90vw] flex-col overflow-hidden rounded-xl border border-line bg-popover font-mono shadow-e3 md:flex"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        onPointerDown={startDrag}
        className="flex cursor-grab touch-none items-center justify-between border-b border-line-subtle bg-inset/80 py-1.5 pr-1.5 pl-4 text-label tracking-widest text-fg-3 uppercase active:cursor-grabbing"
      >
        <span className="flex items-center gap-2">
          <Terminal className="size-3.5" aria-hidden="true" /> Terminal
        </span>
        <span className="flex">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={minimized ? 'Expand terminal' : 'Minimize terminal'}
            onClick={() => setMinimized(!minimized)}
          >
            <Minus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Close terminal" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </span>
      </div>

      {!minimized && (
        <>
          <div className="flex h-52 flex-col gap-1 overflow-y-auto px-4 py-3 text-caption text-fg-3">
            {lines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim()) run(input)
            }}
            className="flex items-center border-t border-line-subtle"
          >
            <span className="py-2.5 pl-4 text-caption text-brand" aria-hidden="true">
              $
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="pricing, compliance, clear..."
              aria-label="Terminal command"
              autoFocus
              className="flex-1 border-none bg-transparent p-2.5 text-caption text-fg outline-none placeholder:text-fg-4"
            />
          </form>
        </>
      )}
    </div>
  )
}

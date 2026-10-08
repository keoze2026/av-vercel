import type { ComponentType, CSSProperties } from 'react'
import { ArrowDown, Ear, Headphones, PhoneIncoming } from 'lucide-react'
import { Meter } from '@/components/brand/Meter'
import { StatusChip } from '@/components/brand/StatusChip'
import type { ProductId } from '@/data/products'
import { cn } from '@/lib/utils'

/* Small console fragments, one per product. Sample data; decorative (aria-hidden). */

const head = 'flex items-center justify-between gap-3 font-mono text-label tracking-widest whitespace-nowrap text-fg-3 uppercase [&>span:first-child]:truncate'
const row = 'flex items-center justify-between gap-3 rounded-md border border-line-subtle bg-surface px-3 py-2'

function NumberPool() {
  const numbers = [
    ['+1 (833) 555-0148', 'TX', 'Provisioned', 'ok'],
    ['+1 (844) 555-0192', 'CA', 'Provisioned', 'ok'],
    ['+1 (855) 555-0117', 'FL', 'Porting', 'warn'],
  ] as const
  return (
    <div className="flex flex-col gap-2">
      <div className={head}>
        <span>Number pool · medicare-oe</span>
        <span>24 active</span>
      </div>
      {numbers.map(([n, state, status, tone]) => (
        <div key={n} className={row}>
          <span className="font-mono text-caption whitespace-nowrap text-fg">{n}</span>
          <span className="flex items-center gap-2">
            <span className="hidden font-mono text-label text-fg-3 sm:inline">{state}</span>
            <StatusChip size="sm" tone={tone}>
              {status}
            </StatusChip>
          </span>
        </div>
      ))}
    </div>
  )
}

function RuleTree() {
  const rules = [
    ['Intent', '≥ 70'],
    ['State', 'TX · FL · OH'],
    ['Daypart', '09:00–21:00'],
    ['Buyer cap', '18 / 24'],
  ] as const
  return (
    <div className="flex flex-col gap-2">
      <div className={head}>
        <span>Routing rules</span>
        <span>4 active</span>
      </div>
      <div className="relative flex flex-col gap-1.5 pl-5">
        <span className="absolute top-2 bottom-2 left-1.5 w-px bg-linear-to-b from-brand to-line" />
        {rules.map(([k, v]) => (
          <div key={k} className={cn(row, 'relative py-1.5')}>
            <span className="absolute top-1/2 -left-4.25 size-2 -translate-y-1/2 rounded-full border border-brand bg-canvas" />
            <span className="text-caption text-fg-2">{k}</span>
            <span className="font-mono text-caption text-fg">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function IntentSlider() {
  return (
    <div className="flex flex-col gap-4">
      <div className={head}>
        <span>Intent threshold</span>
        <span>Ring 1</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-h1 font-medium tracking-tight text-fg">92</p>
          <p className="text-caption text-fg-3">Scored in 0.44 s</p>
        </div>
        <StatusChip tone="ok">Tier 1 · eligible</StatusChip>
      </div>
      <div className="relative pt-5 pb-5">
        <div className="h-1.5 rounded-full bg-linear-to-r from-overlay via-brand-600 to-brand" />
        <span className="absolute top-5 left-[92%] size-3.5 -translate-x-1/2 -translate-y-1 rounded-full border-2 border-canvas bg-brand-300 shadow-glow" />
        <span className="absolute top-0 left-[58%] -translate-x-1/2 font-mono text-label text-fg-3">default 58</span>
        <span className="absolute top-3.5 left-[58%] h-4 w-px bg-fg-3" />
        <span className="absolute bottom-0 left-[70%] -translate-x-1/2 font-mono text-label text-brand-300">70</span>
        <span className="absolute top-3.5 left-[70%] h-4 w-px bg-brand-300" />
      </div>
    </div>
  )
}

function BuyerBids() {
  const bids = [
    ['Apex Insurance', 'Your buyer', '$65.00', 'won'],
    ['Meridian Health', 'Marketplace', '$61.00', 'outbid'],
    ['Lakeside Benefits', 'Marketplace', '$58.00', 'cap'],
  ] as const
  return (
    <div className="flex flex-col gap-2">
      <div className={head}>
        <span>Live bids · 3 eligible</span>
        <span>41 ms</span>
      </div>
      {bids.map(([name, source, bid, outcome]) => (
        <div key={name} className={cn(row, 'py-1.5', outcome === 'won' && 'border-brand/40 bg-brand/6')}>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-caption font-medium text-fg">{name}</span>
            <span className="text-label text-fg-3">{source}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-caption text-fg">{bid}</span>
            {outcome === 'won' ? (
              <StatusChip size="sm" tone="ok">Won</StatusChip>
            ) : outcome === 'cap' ? (
              <StatusChip size="sm" tone="crit">Cap</StatusChip>
            ) : (
              <StatusChip size="sm">Outbid</StatusChip>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

function Wave({ className }: { className?: string }) {
  return (
    <span className={cn('wave flex h-4 items-center gap-0.5', className)}>
      {[6, 12, 8, 14, 9, 5, 11, 7].map((h, i) => (
        <i key={i} style={{ '--h': `${h}px`, '--d': `${i * -0.13}s` } as CSSProperties} />
      ))}
    </span>
  )
}

function LiveCalls() {
  const calls = [
    ['+1 (713) •••-4410', 'Apex Insurance', '02:14'],
    ['+1 (972) •••-3398', 'Meridian Health', '01:03'],
  ] as const
  return (
    <div className="flex flex-col gap-2">
      <div className={head}>
        <span>In flight</span>
        <StatusChip size="sm" tone="ok" live>
          18 live
        </StatusChip>
      </div>
      {calls.map(([caller, buyer, time]) => (
        <div key={caller} className={row}>
          <span className="flex min-w-0 items-center gap-2.5">
            <PhoneIncoming className="size-3.5 shrink-0 text-ok" />
            <span className="flex min-w-0 flex-col">
              <span className="font-mono text-caption text-fg">{caller}</span>
              <span className="truncate text-label text-fg-3">{buyer}</span>
            </span>
          </span>
          <span className="flex items-center gap-3">
            <Wave className="hidden text-brand sm:flex" />
            <span className="font-mono text-caption text-fg-2">{time}</span>
          </span>
        </div>
      ))}
      <div className="flex gap-2">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-sm border border-line-strong bg-raised px-2.5 text-label text-fg-2">
          <Headphones className="size-3.5" /> Barge
        </span>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-sm border border-line-strong bg-raised px-2.5 text-label text-fg-2">
          <Ear className="size-3.5" /> Whisper
        </span>
      </div>
    </div>
  )
}

function DecisionLog() {
  const checks = [
    ['DNC · federal, state, internal', 'Clear'],
    ['TCPA consent proof', 'On record'],
    ['VoIP & velocity', 'Clear'],
  ] as const
  return (
    <div className="flex flex-col gap-2">
      <div className={head}>
        <span>Screening · before ring</span>
        <span>c_9f31a2</span>
      </div>
      {checks.map(([check, result]) => (
        <div key={check} className={cn(row, 'py-1.5')}>
          <span className="truncate text-caption text-fg-2">{check}</span>
          <span className="font-mono text-caption text-ok">{result}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 text-label text-fg-3">
        <ArrowDown className="size-3" /> Decision stored on the call record
      </div>
    </div>
  )
}

function CapBoard() {
  const buyers = [
    ['Apex Insurance', 210, 500],
    ['Meridian Health', 88, 100],
    ['Summit Care', 120, 120],
  ] as const
  return (
    <div className="flex flex-col gap-3">
      <div className={head}>
        <span>Buyer capacity</span>
        <span>Today</span>
      </div>
      {buyers.map(([name, used, cap]) => (
        <div key={name} className="flex flex-col gap-1.5">
          <span className="text-caption text-fg-2">{name}</span>
          <Meter value={used} max={cap} label={used >= cap ? 'Cap hit' : `${used} / ${cap}`} />
        </div>
      ))}
    </div>
  )
}

const fragments: Record<ProductId, ComponentType> = {
  tracking: NumberPool,
  ivr: RuleTree,
  ringtree: IntentSlider,
  pingpost: BuyerBids,
  whitelabel: LiveCalls,
  fraud: DecisionLog,
}

/** Sample console fragment for a product. */
export function ProductFragment({ id, className }: { id: ProductId; className?: string }) {
  const Fragment = fragments[id]
  return (
    <div aria-hidden="true" className={className}>
      <Fragment />
    </div>
  )
}

export { CapBoard }

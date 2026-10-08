import type { ComponentType } from 'react'
import { Ban, Check, PhoneCall } from 'lucide-react'
import { Meter } from '@/components/brand/Meter'
import { StatusChip } from '@/components/brand/StatusChip'
import type { PowerFeature, PowerFeatureId } from '@/data/products'
import { cn } from '@/lib/utils'

/* One console fragment per "Why Avortyx" feature, each showing exactly what its copy says. */

const label = 'font-mono text-label tracking-widest text-fg-3 uppercase'

/** Score calls on the first ring: the decision timeline of one call. */
function FirstRingScene() {
  const events = [
    ['+0.00 s', 'Ring received', 'DID +1 (833) 555-0148 · Google Ads via MediaFlow'],
    ['+0.12 s', 'Screened · pass', 'TCPA consent · DNC clear · not VoIP'],
    ['+0.31 s', 'Intent scored 86', 'Geo eligible · peak hour · first-time caller'],
    ['+0.44 s', 'Auction · 3 buyers', 'Apex $65 won in 41 ms · Meridian $61'],
    ['+1.80 s', 'Connected · Apex Insurance', 'Caller never hears hold music'],
  ] as const
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex justify-between font-mono text-label text-fg-3">
          <span>Ring 1</span>
          <span>6.0 s</span>
        </div>
        <div className="relative mt-2 h-2 rounded-full bg-overlay">
          <div className="absolute inset-y-0 left-0 w-[30%] rounded-full bg-linear-to-r from-brand-600 to-brand" />
          {[0, 2, 5.2, 7.3, 30].map((left) => (
            <span
              key={left}
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-brand-300"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
      </div>
      <ol className="relative flex flex-col gap-3.5 border-l border-line pl-5">
        {events.map(([t, title, detail], i) => (
          <li key={t} className="relative">
            <span
              className={cn(
                'absolute top-1.5 -left-6.25 size-2 rounded-full border',
                i === events.length - 1 ? 'border-ok bg-ok' : 'border-brand bg-canvas',
              )}
            />
            <div className="flex items-baseline gap-3">
              <span className="w-14 shrink-0 font-mono text-label text-fg-3">{t}</span>
              <span className="text-sm font-medium text-fg">{title}</span>
            </div>
            <p className="ml-17 text-caption text-fg-3">{detail}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Screen before connecting: one call passes, one never rings a buyer. */
function ScreeningScene() {
  const checks = [
    'Federal DNC',
    'State DNC',
    'Internal DNC',
    'TCPA consent proof',
    'VoIP & velocity',
    'Two-party recording rule',
  ]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-caption text-fg">+1 (713) •••-4410</span>
          <StatusChip size="sm" tone="ok">Pass</StatusChip>
        </div>
        <ul className="mt-1 flex flex-col gap-1.5">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2 text-caption text-fg-2">
              <Check className="size-3.5 text-ok" /> {c}
            </li>
          ))}
        </ul>
        <p className="mt-auto border-t border-line-subtle pt-2 text-caption text-fg-3">Routed to an eligible buyer</p>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-crit/30 bg-crit/6 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-caption text-fg">+1 (212) •••-5520</span>
          <StatusChip size="sm" tone="crit">Blocked · DNC</StatusChip>
        </div>
        <ul className="mt-1 flex flex-col gap-1.5">
          {checks.map((c, i) => (
            <li key={c} className={cn('flex items-center gap-2 text-caption', i === 1 ? 'text-crit' : 'text-fg-3')}>
              {i === 1 ? <Ban className="size-3.5" /> : <span className="size-3.5 text-center">·</span>}
              {c}
              {i === 1 && <span className="ml-auto font-mono text-label">match</span>}
            </li>
          ))}
        </ul>
        <p className="mt-auto border-t border-crit/20 pt-2 text-caption text-fg-2">
          Never rang a buyer · decision logged
        </p>
      </div>
    </div>
  )
}

/** Bring your own buyers: your roster and the marketplace side by side. */
function BuyersScene() {
  const buyers = [
    ['Apex Insurance', 'Your buyer', '$65.00', 210, 500],
    ['Harbor Auto Group', 'Your buyer', '$42.00', 183, 300],
    ['Meridian Health', 'Marketplace', '$61.00', 88, 100],
    ['Lakeside Benefits', 'Marketplace', '$58.00', 58, 250],
  ] as const
  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit rounded-md border border-line bg-surface p-0.5 text-caption">
        {['Your buyers', 'Marketplace', 'Both'].map((t) => (
          <span
            key={t}
            className={cn(
              'rounded-sm px-3 py-1',
              t === 'Both' ? 'border border-line-strong bg-raised text-fg' : 'text-fg-3',
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-col divide-y divide-line-subtle rounded-lg border border-line bg-surface">
        {buyers.map(([name, source, bid, used, cap]) => (
          <div key={name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 py-3">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium text-fg">{name}</span>
              <span
                className={cn(
                  'rounded-xs border px-1.5 font-mono text-label',
                  source === 'Marketplace' ? 'border-brand/35 text-brand-300' : 'border-line-strong text-fg-3',
                )}
              >
                {source}
              </span>
            </span>
            <span className="font-mono text-caption text-fg">{bid}</span>
            <Meter value={used} max={cap} label={`${used} / ${cap}`} className="col-span-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Track calls through payout: the ledger generated from call records. */
function PayoutScene() {
  const rows = [
    ['MediaFlow', '3,412', '2,061', '$85,738', 'Paid Oct 8', 'ok'],
    ['Lone Star Digital', '1,288', '702', '$27,378', 'Pending', 'warn'],
    ['CallBridge Partners', '944', '515', '$17,881', 'Pending', 'warn'],
  ] as const
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line-subtle">
        {[
          ['Connected', '5,644'],
          ['Qualified', '3,278'],
          ['Payouts', '$130,997'],
        ].map(([k, v]) => (
          <div key={k} className="bg-surface px-3 py-3">
            <p className={label}>{k}</p>
            <p className="mt-1 font-mono text-lg font-medium text-fg">{v}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] gap-3 border-b border-line-subtle px-4 py-2 font-mono text-label text-fg-3 uppercase">
          <span>Publisher</span>
          <span className="text-right">Calls</span>
          <span className="text-right">Qualified</span>
          <span className="text-right">Payout</span>
        </div>
        {rows.map(([pub, calls, qual, payout, status, tone]) => (
          <div
            key={pub}
            className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] items-center gap-3 border-b border-line-subtle px-4 py-2.5 last:border-0"
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-caption font-medium text-fg">{pub}</span>
              <StatusChip size="sm" tone={tone} className="mt-1 w-fit">{status}</StatusChip>
            </span>
            <span className="text-right font-mono text-caption text-fg-2">{calls}</span>
            <span className="text-right font-mono text-caption text-fg-2">{qual}</span>
            <span className="text-right font-mono text-caption text-fg">{payout}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const scenes: Record<PowerFeatureId, ComponentType> = {
  arch: FirstRingScene,
  support: ScreeningScene,
  pricing: BuyersScene,
  scale: PayoutScene,
}

/** Console fragment for the selected "Why Avortyx" feature. */
export function PowerVisual({ feature }: { feature: PowerFeature }) {
  const Scene = scenes[feature.id]
  return (
    <div
      role="img"
      aria-label={`${feature.title}: sample console view`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-inset/70 shadow-e2"
    >
      <div className="flex items-center justify-between border-b border-line-subtle px-5 py-3">
        <span className={label}>Avortyx / {feature.title}</span>
        <PhoneCall className="size-4 text-fg-4" aria-hidden="true" />
      </div>
      <div className="flex-1 bg-dots p-5 sm:p-6">
        <Scene />
      </div>
    </div>
  )
}

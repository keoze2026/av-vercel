import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, PhoneIncoming, Play } from 'lucide-react'
import { BrowserFrame } from '@/components/brand/BrowserFrame'
import { Meter } from '@/components/brand/Meter'
import { SignalBeams, type BeamLink, type BeamState } from '@/components/brand/SignalBeams'
import { SampleTag, StatusChip, type Tone } from '@/components/brand/StatusChip'
import { Button } from '@/components/ui/button'
import {
  PUBLISHER_SHARE,
  ROUTED_TODAY,
  engineScenarios,
  money,
  outcomeLabel,
  type BuyerOutcome,
  type EngineScenario,
} from '@/data/engine'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const PHASES = ['Inbound', 'Screening', 'Scoring intent', 'Live bidding', 'Connected'] as const
const CONNECTED = PHASES.length - 1
/** How long each phase holds, ms. The connected state holds longest. */
const HOLD = [1200, 1600, 1400, 1800, 4200]

const CHECKS = ['TCPA consent', 'DNC', 'VoIP'] as const

const outcomeTone: Record<BuyerOutcome, Tone> = {
  won: 'ok',
  cap: 'crit',
  outbid: 'neutral',
  geo: 'warn',
}

const formatTime = (d: Date) =>
  d.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'UTC' })

const RING = 70
const CIRCUMFERENCE = 2 * Math.PI * RING
const THRESHOLD = 70

/** Intent gauge with a visible threshold detent. */
function IntentGauge({ score, scored }: { score: number; scored: boolean }) {
  const offset = CIRCUMFERENCE * (1 - (scored ? score : 0) / 100)
  const tickAngle = (THRESHOLD / 100) * 2 * Math.PI - Math.PI / 2
  return (
    <svg viewBox="0 0 168 168" className="size-full">
      <circle cx="84" cy="84" r="80" className="trace" />
      <circle cx="84" cy="84" r={RING} strokeWidth="8" className="gauge-track" />
      <circle
        cx="84"
        cy="84"
        r={RING}
        strokeWidth="8"
        className="gauge-value"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 84 84)"
      />
      <line
        x1={84 + Math.cos(tickAngle) * 60}
        y1={84 + Math.sin(tickAngle) * 60}
        x2={84 + Math.cos(tickAngle) * 80}
        y2={84 + Math.sin(tickAngle) * 80}
        stroke="var(--fg-2)"
        strokeWidth="1.5"
      />
    </svg>
  )
}

interface CallStats {
  scenario: EngineScenario
  routed: number
  at: Date
}

/** Hero product proof: one call screened, scored and auctioned, on a loop you can pause. */
export function RoutingEngine() {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<number>(CONNECTED)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [inView, setInView] = useState(true)
  const [last, setLast] = useState<CallStats>(() => ({
    scenario: engineScenarios[0],
    routed: ROUTED_TODAY,
    at: new Date(),
  }))

  const [checksPassed, setChecksPassed] = useState<number>(CHECKS.length)
  const scenario = engineScenarios[index]

  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const callRef = useRef<HTMLDivElement>(null)
  const gaugeRef = useRef<HTMLDivElement>(null)
  const buyerRefs = useMemo(() => [0, 1, 2, 3].map(() => createRef<HTMLDivElement>()), [])
  const links = useMemo<BeamLink[]>(
    () => [
      { from: callRef, to: gaugeRef },
      ...buyerRefs.map((to) => ({ from: gaugeRef, to })),
    ],
    [buyerRefs],
  )

  useEffect(() => {
    if (reducedMotion) setPlaying(false)
  }, [reducedMotion])

  // Only run while on screen and the tab is visible.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(el)
    const onVisibility = () => setInView(!document.hidden && el.getBoundingClientRect().top < window.innerHeight)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!playing || !inView) return
    const timer = window.setTimeout(() => {
      if (phase < CONNECTED) {
        const next = phase + 1
        setPhase(next)
        if (next === CONNECTED) {
          setLast((prev) => ({ scenario, routed: prev.routed + 1, at: new Date() }))
        }
      } else {
        setIndex((i) => (i + 1) % engineScenarios.length)
        setPhase(0)
      }
    }, HOLD[phase])
    return () => window.clearTimeout(timer)
  }, [playing, inView, phase, scenario])

  // Screening ticks the checks off one after another.
  useEffect(() => {
    if (phase !== 1) {
      setChecksPassed(phase === 0 ? 0 : CHECKS.length)
      return
    }
    setChecksPassed(0)
    const timer = window.setInterval(
      () => setChecksPassed((n) => Math.min(CHECKS.length, n + 1)),
      420,
    )
    return () => window.clearInterval(timer)
  }, [phase])

  const scored = phase >= 2
  const bidding = phase >= 3
  const connected = phase === CONNECTED

  const states: BeamState[] = [
    phase === 2 ? 'flow' : phase > 2 ? 'active' : 'idle',
    ...scenario.buyers.map((b): BeamState => {
      if (phase === 3) return 'flow'
      if (connected) return b.outcome === 'won' ? 'active' : 'muted'
      return 'idle'
    }),
  ]

  const lastWinner = last.scenario.buyers.find((b) => b.outcome === 'won')!
  const stats = [
    { label: 'Time to connect', value: `${last.scenario.connect.toFixed(1)} s` },
    { label: 'Buyer payout', value: money(lastWinner.bid) },
    { label: 'Publisher earns', value: money(lastWinner.bid * PUBLISHER_SHARE) },
    { label: 'Routed today', value: last.routed.toLocaleString('en-US') },
  ]

  return (
    <div ref={rootRef}>
      <BrowserFrame
        path={`routing / ${scenario.campaign}`}
        className="rounded-2xl"
        status={
          <>
            <StatusChip tone={connected ? 'ok' : 'brand'} live={connected && playing} className="hidden sm:inline-flex">
              {PHASES[phase]}
            </StatusChip>
            <SampleTag />
          </>
        }
      >
        <p className="sr-only">
          Sample routing engine. An inbound call is screened for TCPA consent, DNC and VoIP, scored
          for intent, and auctioned to four buyers; the highest eligible bid connects.
        </p>

        <div
          ref={stageRef}
          aria-hidden="true"
          className="relative grid grid-cols-1 gap-6 bg-dots p-5 sm:p-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,330px)] lg:gap-x-14 lg:p-8"
        >
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <SignalBeams
              containerRef={stageRef}
              links={links}
              states={states}
              packetKey={`${scenario.id}-${phase}`}
            />
          </div>

          {/* Inbound call */}
          <div
            ref={callRef}
            className={cn(
              'relative self-center rounded-lg border bg-surface p-4 transition-[border-color,box-shadow] duration-320',
              phase <= 1 ? 'border-brand/45 shadow-glow' : 'border-line',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-label tracking-widest text-fg-3 uppercase">Inbound</span>
              <PhoneIncoming className="size-4 text-brand" />
            </div>
            <p className="mt-3 font-mono text-lg font-medium text-fg">{scenario.caller}</p>
            <p className="mt-1 text-caption text-fg-2">
              {scenario.state} · {scenario.source}
            </p>
            <p className="text-caption text-fg-3">via {scenario.publisher}</p>
            <ul className="mt-4 flex flex-col gap-2 border-t border-line-subtle pt-3">
              {CHECKS.map((check, i) => {
                const passed = i < checksPassed
                return (
                  <li key={check} className="flex items-center justify-between text-caption">
                    <span className="text-fg-2">{check}</span>
                    <span
                      className={cn(
                        'font-mono transition-colors duration-200',
                        passed ? 'text-ok' : 'text-fg-4',
                      )}
                    >
                      {passed ? 'clear' : phase === 1 ? 'checking' : 'pending'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Intent */}
          <div className="flex items-center justify-center gap-6 lg:flex-col lg:gap-4">
            <div ref={gaugeRef} className="relative size-36 shrink-0 lg:size-42">
              <IntentGauge score={scenario.intent} scored={scored} />
              <div className="absolute inset-0 grid place-content-center text-center">
                <span className="font-mono text-h1 font-medium tracking-tight text-fg tabular-nums">
                  {scored ? scenario.intent : '··'}
                </span>
                <span className="font-mono text-label tracking-widest text-fg-3 uppercase">intent</span>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-caption lg:text-center">
              <dt className="text-fg-3">Threshold</dt>
              <dt className="text-fg-3">Decision</dt>
              <dd className="font-mono whitespace-nowrap text-fg-2">{THRESHOLD} · Tier 1</dd>
              <dd className="font-mono text-fg-2">{bidding ? `${scenario.decisionMs} ms` : '··'}</dd>
            </dl>
          </div>

          {/* Buyers */}
          {/* Two buyers a row below desktop; one column beside the gauge on desktop. */}
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
            <div className="col-span-2 flex items-center justify-between px-1 font-mono text-label tracking-widest text-fg-3 uppercase">
              <span>Ring tree · Tier 1</span>
              <span>Bid</span>
            </div>
            {scenario.buyers.map((b, i) => {
              const won = connected && b.outcome === 'won'
              return (
                <div
                  key={b.name}
                  ref={buyerRefs[i]}
                  className={cn(
                    'min-w-0 rounded-lg border bg-surface px-3 py-3 transition-[border-color,background-color] duration-320 sm:px-3.5',
                    won ? 'border-brand/45 bg-brand/6' : 'border-line',
                  )}
                >
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="truncate text-sm font-medium text-fg">{b.name}</span>
                    <span className="font-mono text-sm text-fg-2">{bidding ? money(b.bid) : '··'}</span>
                  </div>
                  <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <Meter value={b.cap} max={100} label={`${b.cap}% cap`} className="w-full flex-1" />
                    {connected && (
                      <StatusChip size="sm" tone={outcomeTone[b.outcome]} live={won && playing}>
                        {outcomeLabel[b.outcome]}
                      </StatusChip>
                    )}
                    {phase === 3 && <StatusChip size="sm" tone="brand">Bidding</StatusChip>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <dl className="grid grid-cols-2 border-t border-line-subtle md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'flex flex-col gap-1 px-5 py-4 sm:px-6',
                i % 2 === 1 && 'border-l border-line-subtle',
                i >= 2 && 'border-t border-line-subtle md:border-t-0',
                i === 2 && 'md:border-l',
              )}
            >
              <dt className="font-mono text-label tracking-widest text-fg-3 uppercase">{s.label}</dt>
              <dd className="font-mono text-h2 font-medium tracking-tight text-fg tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line-subtle bg-inset/60 px-5 py-3 sm:px-6">
          <p className="flex min-w-0 items-center gap-2 text-caption text-fg-2" aria-live="polite">
            <span className="hidden font-mono text-label tracking-widest text-fg-3 uppercase sm:inline">Latest route event</span>
            <span className="truncate">
              {lastWinner.name} won · {money(lastWinner.bid)} · decided in {last.scenario.decisionMs} ms
            </span>
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-label text-fg-3">Updated {formatTime(last.at)} UTC</span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={!playing}
              aria-label={playing ? 'Pause the sample routing feed' : 'Play the sample routing feed'}
            >
              {playing ? <Pause /> : <Play />}
              {playing ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>
      </BrowserFrame>
      <p className="mt-3 text-center text-caption text-fg-3">
        Illustrative demo telemetry · not production data
      </p>
    </div>
  )
}

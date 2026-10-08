import { useEffect, useId, useRef, useState } from 'react'
import { Download, Pause, Play } from 'lucide-react'
import { toast } from 'sonner'
import { StatusChip, type Tone } from '@/components/brand/StatusChip'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import type { ConsoleModule, ConsoleModuleId } from '@/data/products'

type Severity = 'info' | 'success' | 'warning'
type EventFilter = 'all' | Severity
type Strategy = 'intent' | 'balanced' | 'value'
type Risk = 'low' | 'medium' | 'high'

interface Scenario {
  load: number
  strategy: Strategy
  risk: Risk
}

interface StreamEvent {
  id: string
  message: string
  status: Severity
  time: string
}

const eventTemplates: Record<ConsoleModuleId, [string, Severity][]> = {
  routing: [
    ['Sample call received · campaign match found', 'info'],
    ['Intent score calculated · Buyer A selected', 'success'],
    ['Buyer capacity checked · within sample cap', 'success'],
    ['Call geography matched · sample campaign', 'info'],
    ['Buyer schedule checked · eligible', 'success'],
  ],
  fraud: [
    ['Federal DNC check · sample passed', 'success'],
    ['Consent record checked · sample present', 'success'],
    ['VoIP signal flagged · sample review', 'warning'],
    ['State recording rule checked · sample clear', 'success'],
    ['Screening decision stored · sample call', 'info'],
  ],
  analytics: [
    ['Qualified call recorded · sample campaign', 'success'],
    ['Buyer payout updated · sample record', 'info'],
    ['Campaign totals refreshed · synthetic data', 'info'],
    ['Publisher report prepared · sample session', 'success'],
    ['Call outcome recorded · sample record', 'info'],
  ],
}

const initialSeries = [
  42, 48, 45, 57, 53, 62, 58, 67, 61, 72, 66, 74, 69, 79, 71, 76, 68, 82, 74, 87, 78, 84, 73, 81,
]

const initialMetrics: Record<ConsoleModuleId, number[]> = {
  routing: [3492, 82, 5],
  fraud: [14092, 0, 98],
  analytics: [846, 18.42, 84],
}

const riskLevel: Record<Risk, number> = { low: 0, medium: 1, high: 2 }

const strategyLabel: Record<Strategy, string> = {
  intent: 'intent-first preference',
  balanced: 'balanced buyer preference',
  value: 'value-first preference',
}

const strategyOptions: [Strategy, string][] = [
  ['intent', 'Intent first'],
  ['balanced', 'Balanced'],
  ['value', 'Value first'],
]

const riskOptions: [Risk, string][] = [
  ['low', 'Low'],
  ['medium', 'Elevated'],
  ['high', 'High'],
]

const filterOptions: [EventFilter, string][] = [
  ['all', 'All events'],
  ['info', 'Info'],
  ['success', 'Success'],
  ['warning', 'Warnings'],
]

const severityTone: Record<Severity, Tone> = { info: 'brand', success: 'ok', warning: 'warn' }
const severityLabel: Record<Severity, string> = { info: 'Info', success: 'Success', warning: 'Warning' }

const chartGridLines = [25, 60, 95, 130]

/** Live ticks no faster than every 2 s. */
const TICK_MS = 2000

/** Random walk around `value`, clamped to [min, max] and rounded to `digits`. */
function jitter(value: number, spread: number, min: number, max: number, digits = 0) {
  const delta = (Math.random() * 2 - 1) * spread
  return Math.min(max, Math.max(min, Number((value + delta).toFixed(digits))))
}

function simulateMetrics(id: ConsoleModuleId, prev: number[], scenario: Scenario) {
  const next = [...prev]
  const risk = riskLevel[scenario.risk]
  if (id === 'routing') {
    next[0] = Math.round(jitter((5000 * scenario.load) / 100, 18, 0, 5000))
    const intent = { intent: 88, balanced: 82, value: 76 }[scenario.strategy]
    next[1] = Math.round(jitter(intent - risk * 4, 2, 40, 100))
    next[2] = Math.round(jitter(6 - risk - scenario.load * 0.02, 1, 1, 6))
  } else if (id === 'fraud') {
    next[0] += Math.floor((Math.random() * (risk + 2) * scenario.load) / 50)
    next[2] = Math.round(jitter(12 + scenario.load * 0.45 + risk * 8, 3, 0, 100))
  } else {
    const factor = { intent: 1.08, balanced: 1, value: 0.92 }[scenario.strategy]
    next[0] = Math.round(jitter((1200 * scenario.load) / 100, 24, 0, 1200))
    next[1] = jitter((18 + scenario.load * 0.095) * factor, 0.24, 1, 40, 2)
    next[2] = jitter(84 - risk * 4, 2, 10, 100, 0)
  }
  return next
}

function formatMetric(id: ConsoleModuleId, index: number, value: number, scenario: Scenario) {
  if (id === 'fraud' && index === 1) return scenario.risk.toUpperCase()
  if (id === 'analytics' && index === 1) return `$${value.toFixed(2)}`
  if (id === 'analytics' && index === 2) return value.toFixed(2)
  return Math.round(value).toLocaleString()
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

const panelLabel = 'font-mono text-label tracking-widest text-fg-3 uppercase'

/** Simulated telemetry for one console module; remount (key) to reset. */
export function ConsoleLiveStream({ module }: { module: ConsoleModule }) {
  const uid = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const tick = useRef(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const [filter, setFilter] = useState<EventFilter>('all')
  const [scenario, setScenario] = useState<Scenario>({ load: 70, strategy: 'balanced', risk: 'low' })
  const [series, setSeries] = useState(initialSeries)
  const [metrics, setMetrics] = useState(() => initialMetrics[module.id])
  const [events, setEvents] = useState<StreamEvent[]>(() =>
    eventTemplates[module.id].slice(0, 3).map(([message, status], i) => ({
      id: `${module.id}-${i}`,
      message,
      status,
      time: formatTime(new Date(Date.now() - (2 - i) * 5000)),
    })),
  )

  const updateScenario = (patch: Partial<Scenario>) => {
    const next = { ...scenario, ...patch }
    setScenario(next)
    setMetrics((prev) => simulateMetrics(module.id, prev, next))
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || paused || reducedMotion) return
    const templates = eventTemplates[module.id]
    const risk = riskLevel[scenario.risk]
    const preference = strategyLabel[scenario.strategy]
    const timer = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1]
        const step = Math.round((scenario.load - last) * 0.18 + Math.random() * 12 - 6)
        return [...prev.slice(1), Math.max(18, Math.min(92, last + step))]
      })
      setMetrics((prev) => simulateMetrics(module.id, prev, scenario))
      const [message, status] = templates[tick.current % templates.length]
      tick.current += 1
      setEvents((prev) => [
        ...prev.slice(-29),
        {
          id: `${module.id}-${Date.now()}`,
          message: `${message} · ${preference}`,
          status: risk === 2 ? 'warning' : status,
          time: formatTime(new Date()),
        },
      ])
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [inView, paused, reducedMotion, module.id, scenario])

  const points = series
    .map((v, i) => `${(i / (series.length - 1)) * 700},${130 - v * 1.2}`)
    .join(' ')
  const area = `M ${points.replaceAll(' ', ' L ')} L 700,140 L 0,140 Z`
  const filtered = filter === 'all' ? events : events.filter((e) => e.status === filter)
  const visible = filtered.slice(-4).reverse()
  const halted = paused || reducedMotion

  const exportCsv = () => {
    const rows: string[][] = [
      ['module', module.title],
      ['exported_at', new Date().toISOString()],
      [],
      ['time', 'severity', 'event'],
      ...filtered.map((e) => [e.time, e.status, e.message]),
      [],
      ['metric', 'value', 'unit'],
      ...module.stats.map((stat, i) => [
        stat.label,
        formatMetric(module.id, i, metrics[i], scenario),
        stat.unit,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    const filename = `avortyx-${module.id}-telemetry.csv`
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    toast.success('CSV exported', { description: `${filtered.length} events · ${filename}` })
  }

  return (
    <div ref={rootRef} className="flex min-w-0 flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className={panelLabel}>Sample call session</span>
        <StatusChip tone={paused ? 'warn' : reducedMotion ? 'neutral' : 'ok'} live={!halted}>
          {paused ? 'Paused' : reducedMotion ? 'Motion reduced' : 'Live demo · simulated'}
        </StatusChip>
      </div>

      <dl
        className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line-subtle"
        aria-label={`${module.title} simulated live metrics`}
      >
        {module.stats.map((stat, i) => (
          <div key={stat.label} className="flex min-w-0 flex-col gap-2 bg-surface px-4 py-3.5">
            <dt className="truncate font-mono text-label tracking-widest text-fg-3 uppercase">{stat.label}</dt>
            <dd className="flex items-baseline gap-1.5 font-mono text-h2 font-medium tracking-tight text-fg tabular-nums">
              {formatMetric(module.id, i, metrics[i], scenario)}
              {stat.unit && <span className="truncate font-sans text-caption font-normal text-fg-3">{stat.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="rounded-lg border border-line bg-surface px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <span className={panelLabel}>Sample activity</span>
          <span className="font-mono text-label text-fg-3">calls / min</span>
        </div>
        <svg
          viewBox="0 0 700 140"
          role="img"
          aria-label={`Simulated live ${module.title} activity chart`}
          preserveAspectRatio="none"
          className="mt-2 block h-28 w-full overflow-visible"
        >
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-400)" stopOpacity="0.24" />
              <stop offset="100%" stopColor="var(--brand-400)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {chartGridLines.map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="700"
              y2={y}
              stroke="var(--line-subtle)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={area} fill={`url(#${uid}-fill)`} />
          <polyline
            points={points}
            fill="none"
            stroke="var(--brand-400)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-1 flex justify-between font-mono text-label text-fg-3">
          <span>−48 sec</span>
          <span>−24 sec</span>
          <span>Sample</span>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className={panelLabel}>Sample event log</span>
            <Select value={filter} onValueChange={(v) => setFilter(v as EventFilter)}>
              <SelectTrigger size="sm" aria-label="Filter events by severity" className="text-caption">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="grid h-5 min-w-5 place-items-center rounded-full border border-line px-1.5 font-mono text-label text-fg-3">
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={halted}
              aria-label={
                reducedMotion
                  ? 'Telemetry updates paused to respect reduced motion'
                  : paused
                    ? 'Resume live telemetry'
                    : 'Pause live telemetry'
              }
              disabled={reducedMotion}
            >
              {halted ? <Play /> : <Pause />}
              {reducedMotion ? 'Motion reduced' : paused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} aria-label="Export telemetry as CSV">
              <Download /> Export CSV
            </Button>
          </div>
        </div>
        <ol aria-live="polite" aria-label="Simulated recent console activity" className="flex flex-col">
          {visible.length ? (
            visible.map((e) => (
              <li
                key={e.id}
                className="row-enter grid min-w-0 grid-cols-[64px_84px_minmax(0,1fr)] items-center gap-3 border-b border-line-subtle px-4 py-2 last:border-0"
              >
                <time className="font-mono text-label text-fg-3">{e.time}</time>
                <StatusChip size="sm" tone={severityTone[e.status]} className="w-fit">
                  {severityLabel[e.status]}
                </StatusChip>
                <span className="truncate font-mono text-caption text-fg-2">{e.message}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-caption text-fg-3">No {filter} events in the recent stream.</li>
          )}
        </ol>
      </div>

      <fieldset className="grid min-w-0 grid-cols-2 gap-4 rounded-lg border border-line-subtle bg-inset/60 p-4 sm:grid-cols-[1.3fr_1fr_1fr]">
        <legend className={cn(panelLabel, 'px-1.5')}>Simulation scenario</legend>
        <div className="col-span-2 flex min-w-0 flex-col gap-2.5 sm:col-span-1">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${uid}-load`} className="text-caption font-normal text-fg-2">
              Sample call volume
            </Label>
            <output htmlFor={`${uid}-load`} className="font-mono text-caption text-brand">
              {scenario.load}%
            </output>
          </div>
          <Slider
            id={`${uid}-load`}
            min={10}
            max={100}
            step={5}
            value={[scenario.load]}
            onValueChange={([load]) => updateScenario({ load })}
            aria-label="Sample call volume"
          />
          <div className="flex justify-between text-label text-fg-3">
            <span>Light</span>
            <span>Peak</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Label className="text-caption font-normal text-fg-2" id={`${uid}-strategy`}>
            Buyer preference
          </Label>
          <Select value={scenario.strategy} onValueChange={(v) => updateScenario({ strategy: v as Strategy })}>
            <SelectTrigger aria-labelledby={`${uid}-strategy`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {strategyOptions.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Label className="text-caption font-normal text-fg-2" id={`${uid}-risk`}>
            Screening risk
          </Label>
          <Select value={scenario.risk} onValueChange={(v) => updateScenario({ risk: v as Risk })}>
            <SelectTrigger aria-labelledby={`${uid}-risk`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {riskOptions.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>
    </div>
  )
}

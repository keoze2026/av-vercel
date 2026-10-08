import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, SlidersHorizontal, Waypoints, type LucideIcon } from 'lucide-react'
import { BrowserFrame } from '@/components/brand/BrowserFrame'
import { Reveal } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { SampleTag, StatusChip, type Tone } from '@/components/brand/StatusChip'
import { SectionHeader } from '@/components/SectionHeader'
import { LiveChart } from './LiveChart'

interface DemoEvent {
  text: string
  tone: Tone
  time: string
}

const timestamp = () => new Date().toISOString().substring(11, 23)

const initialEvents: Omit<DemoEvent, 'time'>[] = [
  { text: 'Sample call received · Campaign A', tone: 'neutral' },
  { text: 'Intent scored · eligible buyer found', tone: 'neutral' },
  { text: 'Sample call connected to Buyer A', tone: 'ok' },
  { text: 'Sample attempt received · Campaign B', tone: 'neutral' },
  { text: 'DNC screening · sample attempt held', tone: 'crit' },
  { text: 'Sample call completed · qualification pending', tone: 'neutral' },
  { text: 'Sample qualification recorded', tone: 'brand' },
  { text: 'Sample payout record updated', tone: 'neutral' },
]

const streamEvents: Omit<DemoEvent, 'time'>[] = [
  { text: 'Sample call received · Campaign A', tone: 'neutral' },
  { text: 'Intent evaluated · eligible buyer matched', tone: 'neutral' },
  { text: 'Sample call connected · Buyer A', tone: 'ok' },
  { text: 'Compliance check complete · sample passed', tone: 'brand' },
  { text: 'Sample qualification recorded', tone: 'ok' },
  { text: 'Sample payout record updated', tone: 'neutral' },
]

const dotTone: Record<Tone, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  risk: 'bg-risk',
  crit: 'bg-crit',
  brand: 'bg-brand',
  neutral: 'bg-fg-4',
}

const tags: { icon: LucideIcon; label: string }[] = [
  { icon: SlidersHorizontal, label: 'Campaign rules' },
  { icon: Waypoints, label: 'Buyer matching' },
  { icon: ShieldCheck, label: 'Compliance checks' },
]

const panelLabel = 'font-mono text-label tracking-widest text-fg-3 uppercase'

/** "Illustrative Call Activity": synthetic stats, chart and event log. */
export function ProductDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)
  const [stats, setStats] = useState({ calls: 1284, buyers: 12, qualified: 846, review: 17 })
  const [events, setEvents] = useState<DemoEvent[]>(() =>
    initialEvents.map((e) => ({ ...e, time: timestamp() })),
  )

  // Only tick while the dashboard is on screen, the tab is visible and motion is allowed.
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const sync = () => setLive(visible && !document.hidden && !motionQuery.matches)
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { rootMargin: '100px' },
    )
    if (dashboardRef.current) observer.observe(dashboardRef.current)
    document.addEventListener('visibilitychange', sync)
    motionQuery.addEventListener('change', sync)
    sync()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motionQuery.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!live) return
    const statsTimer = setInterval(() => {
      setStats((s) => ({
        calls: s.calls + Math.floor(Math.random() * 4),
        buyers: s.buyers,
        qualified: s.qualified + +(Math.random() > 0.7),
        review: s.review + +(Math.random() > 0.9),
      }))
    }, 2500)
    const eventsTimer = setInterval(() => {
      const next = streamEvents[Math.floor(Math.random() * streamEvents.length)]
      setEvents((list) => [{ ...next, time: timestamp() }, ...list.slice(0, -1)])
    }, 2400)
    return () => {
      clearInterval(statsTimer)
      clearInterval(eventsTimer)
    }
  }, [live])

  const statTiles = [
    { label: 'Sample calls', value: stats.calls.toLocaleString() },
    { label: 'Sample buyers', value: stats.buyers },
    { label: 'Sample qualified', value: stats.qualified.toLocaleString() },
    { label: 'Sample for review', value: stats.review },
  ]

  return (
    <Section>
      <SectionHeader
        align="center"
        label="Sample data"
        title="Illustrative Call Activity"
        desc="A simulated product view with sample calls, buyers, qualification, screening, and event activity. These values update for demonstration only and are not live Avortyx data."
      />
      <Reveal>
      <div ref={dashboardRef}>
        <BrowserFrame
          path="monitoring / today"
          status={
            <>
              <StatusChip tone={live ? 'ok' : 'neutral'} live={live} className="hidden sm:inline-flex">
                {live ? 'Live demo' : 'Paused'}
              </StatusChip>
              <SampleTag />
            </>
          }
        >
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line-subtle lg:grid-cols-4">
              {statTiles.map((tile) => (
                <div key={tile.label} className="flex flex-col gap-2 bg-surface px-5 py-4">
                  <dt className={panelLabel}>{tile.label}</dt>
                  <dd className="font-mono text-h2 font-medium tracking-tight text-fg tabular-nums">{tile.value}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="flex min-h-72 flex-col rounded-lg border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <span className={panelLabel}>Sample call activity · synthetic</span>
                  <span className="font-mono text-label text-fg-3">calls / min</span>
                </div>
                <div className="flex flex-1 items-center pt-4">
                  <LiveChart />
                </div>
              </div>
              <div className="flex min-h-72 flex-col rounded-lg border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
                  <span className={panelLabel}>Illustrative events</span>
                  <span className="font-mono text-label text-fg-3">UTC</span>
                </div>
                <ol className="flex flex-1 flex-col overflow-hidden" aria-label="Illustrative events">
                  {events.map((event, i) => (
                    <li
                      key={`${event.time}-${i}`}
                      className={`${i === 0 ? 'row-enter ' : ''}flex items-center gap-3 border-b border-line-subtle px-4 py-2 last:border-0`}
                    >
                      <span className="shrink-0 font-mono text-label text-fg-3">{event.time.slice(0, 8)}</span>
                      <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${dotTone[event.tone]}`} />
                      <span className="truncate font-mono text-caption text-fg-2">{event.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
      </Reveal>

      <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {tags.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-sm text-fg-2">
            <Icon className="size-4 text-brand" aria-hidden="true" /> {label}
          </li>
        ))}
      </ul>
    </Section>
  )
}

import type { ReactNode } from 'react'
import { Activity, ArrowRight, CircleCheck, Scale, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { SampleTag, StatusChip, type Tone } from '@/components/brand/StatusChip'
import { SectionHeader } from '@/components/SectionHeader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { scenarios, type Scenario, type SignalTone } from '@/data/scenarios'
import { cn } from '@/lib/utils'

const signalTone: Record<SignalTone, string> = {
  success: 'text-ok',
  warning: 'text-warn',
  neutral: 'text-fg-2',
}

/** Status tone for a candidate's policy result (shared with SampleProof). */
export const actionTone = (action: string): Tone =>
  action === 'Selected' || action === 'Preferred' ? 'ok' : action === 'Unavailable' ? 'warn' : 'neutral'

interface StageProps {
  icon: LucideIcon
  step: string
  title: string
  children: ReactNode
  className?: string
}

function Stage({ icon: Icon, step, title, children, className }: StageProps) {
  return (
    <section className={cn('flex min-w-0 flex-col gap-4 rounded-lg border border-line bg-surface p-5', className)}>
      <header className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-md border border-line-strong bg-raised text-fg-2 [&_svg]:size-4">
          <Icon />
        </span>
        <div>
          <p className="font-mono text-label tracking-widest text-fg-3 uppercase">{step}</p>
          <h4 className="text-sm font-medium text-fg">{title}</h4>
        </div>
      </header>
      {children}
    </section>
  )
}

function Connector() {
  return (
    <div aria-hidden="true" className="hidden place-items-center text-fg-4 lg:grid">
      <ArrowRight className="size-4" />
    </div>
  )
}

function ScenarioPanel({ scenario }: { scenario: Scenario }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas shadow-e2">
      <div className="flex flex-col gap-3 border-b border-line-subtle px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-label tracking-widest text-brand uppercase">
            Mock session · {scenario.category}
          </p>
          <h3 className="mt-2 max-w-[60ch] text-lg font-medium text-fg">{scenario.summary}</h3>
        </div>
        <SampleTag className="self-start" />
      </div>

      <div className="grid grid-cols-1 gap-3 bg-dots p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20px_minmax(0,1.15fr)_20px_minmax(0,1fr)]">
        <Stage icon={Activity} step="01 · Input" title="Observed signals">
          <dl className="flex flex-col divide-y divide-line-subtle rounded-md border border-line-subtle bg-inset/60">
            {scenario.signals.map((signal) => (
              <div key={signal.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <dt className="text-caption text-fg-2">{signal.label}</dt>
                <dd className={cn('font-mono text-caption font-medium', signalTone[signal.tone])}>
                  {signal.value}
                </dd>
              </div>
            ))}
          </dl>
        </Stage>
        <Connector />
        <Stage icon={Scale} step="02 · Policy" title="Decision rationale">
          <div className="rounded-md border border-brand/30 bg-brand/6 p-4">
            <p className="font-mono text-label tracking-widest text-brand-300 uppercase">Sample action</p>
            <p className="mt-2 text-base font-medium text-fg">{scenario.decision}</p>
            <p className="mt-2 text-caption text-fg-2">{scenario.rationale}</p>
          </div>
          <div className="mt-auto flex items-center justify-between text-caption">
            <span className="text-fg-3">{scenario.scoreLabel}</span>
            <span className="font-mono font-medium text-fg">{scenario.score}</span>
          </div>
        </Stage>
        <Connector />
        <Stage icon={CircleCheck} step="03 · Outcome" title="Proposed route">
          <div className="flex items-center gap-3 rounded-md border border-ok/30 bg-ok/8 p-3">
            <CircleCheck className="size-5 shrink-0 text-ok" aria-hidden="true" />
            <div>
              <p className="font-mono text-label tracking-widest text-ok uppercase">Selected path</p>
              <p className="mt-0.5 text-sm font-medium text-fg">{scenario.route}</p>
            </div>
          </div>
          <p className="text-caption text-fg-2">{scenario.outcome}</p>
        </Stage>
      </div>

      <div className="border-t border-line-subtle">
        <div className="flex flex-col gap-1 px-5 pt-5 pb-2 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-mono text-label tracking-widest text-fg-3 uppercase">Route comparison</p>
            <h4 className="text-sm font-medium text-fg">Candidate paths</h4>
          </div>
          <p className="text-caption text-fg-3">Sample values · not live network data</p>
        </div>
        <div className="px-2 pb-2 sm:px-3">
          <Table>
            <TableHeader>
              <TableRow className="border-line-subtle hover:bg-transparent">
                {['Buyer', 'Campaign fit', 'Availability', 'Sample policy result'].map((h) => (
                  <TableHead key={h} className="h-9 font-mono text-label tracking-widest text-fg-3 uppercase">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenario.candidates.map((c) => (
                <TableRow key={c.name} className="border-line-subtle hover:bg-raised/60">
                  <TableCell className="font-medium text-fg">{c.name}</TableCell>
                  <TableCell className="text-fg-2">{c.fit}</TableCell>
                  <TableCell className="text-fg-2">{c.availability}</TableCell>
                  <TableCell>
                    <StatusChip size="sm" tone={actionTone(c.action)}>
                      {c.action}
                    </StatusChip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="border-t border-line-subtle px-5 py-4 text-caption text-fg-3 sm:px-6">
        This is a front-end demonstration using synthetic mock data. It does not connect to live
        traffic, production routes, or an AI inference service.
      </p>
    </div>
  )
}

interface WalkthroughProps {
  scenario: Scenario
  onSelect: (s: Scenario) => void
}

export function Walkthrough({ scenario, onSelect }: WalkthroughProps) {
  return (
    <Section id="interactive-walkthrough">
      <SectionHeader
        label="Interactive product walkthrough"
        title="See how a call finds its buyer"
        desc="Explore illustrative scenarios for intent scoring, campaign schedules, and buyer capacity. Values are synthetic and do not represent live traffic."
      />
      <Reveal>
      <Tabs
        value={scenario.id}
        onValueChange={(id) => onSelect(scenarios.find((s) => s.id === id) ?? scenarios[0])}
        className="gap-4"
      >
        {/* Navigation tabs: every scenario always visible. Equal columns on phones, inline above. */}
        <TabsList
          variant="line"
          aria-label="Choose an illustrative call scenario"
          className="grid w-full grid-cols-3 items-stretch gap-2 rounded-none border-b border-line bg-transparent p-0 group-data-horizontal/tabs:h-auto sm:flex sm:justify-start sm:gap-8"
        >
          {scenarios.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="h-auto rounded-none border-0 px-1 pt-1 pb-3.5 text-center text-sm font-medium whitespace-normal sm:flex-none sm:px-0 sm:text-left group-data-horizontal/tabs:after:-bottom-px after:bg-brand"
            >
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {scenarios.map((s) => (
          <TabsContent key={s.id} value={s.id} className="animate-in duration-300 fade-in-0">
            <ScenarioPanel scenario={s} />
          </TabsContent>
        ))}
      </Tabs>
      </Reveal>
    </Section>
  )
}

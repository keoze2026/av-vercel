import type { ReactNode } from 'react'
import { Reveal } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { StatusChip, type Tone } from '@/components/brand/StatusChip'
import { actionTone } from '@/components/home/Walkthrough'
import { Eyebrow } from '@/components/SectionHeader'
import type { Scenario, SignalTone } from '@/data/scenarios'

const signalTone: Record<SignalTone, Tone> = {
  success: 'ok',
  warning: 'warn',
  neutral: 'neutral',
}

interface EvidenceRowProps {
  index: string
  note: string
  delay: number
  children: ReactNode
}

function EvidenceRow({ index, note, delay, children }: EvidenceRowProps) {
  return (
    <Reveal
      delay={delay}
      className="grid grid-cols-1 gap-3 border-b border-line py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:gap-6"
    >
      <dt className="flex flex-col gap-1">
        <span className="font-mono text-label tracking-widest text-fg-3 uppercase">{index}</span>
        <span className="text-sm text-fg-2">{note}</span>
      </dt>
      <dd className="flex flex-wrap gap-1.5 sm:justify-end">{children}</dd>
    </Reveal>
  )
}

/** The evidence behind the walkthrough's selected scenario: inputs, options, action. */
export function SampleProof({ scenario }: { scenario: Scenario }) {
  return (
    <Section>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal direction="left" className="flex flex-col gap-4">
          <Eyebrow>Sample session · synthetic data</Eyebrow>
          <h2 className="text-h2 font-semibold tracking-tight text-fg md:text-h1 md:tracking-heading">
            Every recommendation comes with context.
          </h2>
          <p className="max-w-[48ch] text-base text-fg-2">
            This example shows the evidence an operator can inspect—not a customer result, service
            benchmark, or live AI prediction.
          </p>
        </Reveal>

        <dl key={scenario.id} className="flex animate-in flex-col border-t border-line duration-300 fade-in-0">
          <EvidenceRow
            index="01 / Signals"
            note={`${scenario.signals.length} sample inputs inspected`}
            delay={0.08}
          >
            {scenario.signals.map((signal) => (
              <StatusChip key={signal.label} tone={signalTone[signal.tone]}>
                <span>
                  {signal.label} · <span className="font-mono">{signal.value}</span>
                </span>
              </StatusChip>
            ))}
          </EvidenceRow>
          <EvidenceRow
            index="02 / Options"
            note={`${scenario.candidates.length} candidate paths compared`}
            delay={0.16}
          >
            {scenario.candidates.map((c) => (
              <StatusChip key={c.name} tone={actionTone(c.action)}>
                {c.name} · {c.action}
              </StatusChip>
            ))}
          </EvidenceRow>
          <EvidenceRow index="03 / Policy action" note={scenario.outcome} delay={0.24}>
            <span className="text-h3 font-semibold tracking-tight text-fg sm:text-right">
              {scenario.decision}
            </span>
          </EvidenceRow>
        </dl>
      </div>
    </Section>
  )
}

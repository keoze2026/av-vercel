import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CircleDollarSign,
  Network,
  Phone,
  ShieldCheck,
  Waypoints,
  type LucideIcon,
} from 'lucide-react'
import { CircuitNode, RingNode } from '@/components/brand/CircuitNode'
import { Reveal, stagger } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { Button } from '@/components/ui/button'
import { PLATFORM_PATH } from '@/data/site'
import { cn } from '@/lib/utils'

interface WorkflowStep {
  icon: LucideIcon
  stage: string
  label: string
  detail: string
}

const steps: WorkflowStep[] = [
  { icon: Phone, stage: 'Campaign', label: 'Set up numbers', detail: 'Buy, port, or pool numbers' },
  { icon: ShieldCheck, stage: 'Screening', label: 'Check compliance', detail: 'Screen before buyer routing' },
  { icon: Waypoints, stage: 'Routing', label: 'Match a buyer', detail: 'Use intent and campaign rules' },
  { icon: CircleDollarSign, stage: 'Outcome', label: 'Track the payout', detail: 'Review calls and qualification' },
]

/** A short trace with a chip at its end, used either side of the statement. */
function Spur({ icon, flip = false }: { icon: LucideIcon; flip?: boolean }) {
  return (
    <Reveal
      direction={flip ? 'right' : 'left'}
      delay={0.15}
      className={cn('absolute top-1/2 hidden -translate-y-1/2 xl:block', flip ? 'right-0' : 'left-0')}
    >
      <div aria-hidden="true" className={cn('flex items-center', flip && 'flex-row-reverse')}>
        <RingNode icon={flip ? Waypoints : Network} className="-mx-10" />
        <span
          className="h-px w-16 bg-linear-to-r from-brand/60 to-line"
          style={flip ? { transform: 'scaleX(-1)' } : undefined}
        />
        <CircuitNode icon={icon} size="sm" />
      </div>
    </Reveal>
  )
}

/** "One connected platform" statement, then the four-stage path a call takes. */
export function WorkflowStrip() {
  return (
    <Section id="platform" innerClassName="overflow-hidden">
      <div className="relative flex flex-col items-center text-center xl:py-6">
        <Spur icon={Phone} />
        <Spur icon={CircleDollarSign} flip />
        <Reveal>
          <span className="inline-flex h-7 items-center rounded-full border border-line bg-raised px-3 text-caption text-fg-2">
            One connected platform
          </span>
        </Reveal>
        <Reveal
          as="p"
          delay={0.08}
          className="mt-6 max-w-[30ch] text-h2 font-medium tracking-tight text-fg md:max-w-[34ch]"
        >
          Avortyx brings call tracking, first-ring intent scoring, buyer routing, compliance
          screening, live monitoring, reporting, and payouts into one pay-per-call platform.
        </Reveal>
        <Reveal as="p" delay={0.16} className="mt-5 font-mono text-label tracking-widest text-fg-3 uppercase">
          Campaigns · Buyers · Compliance · Payouts
        </Reveal>
      </div>

      <div className="mt-16 md:mt-20">
        <Reveal>
          <h2 className="text-center font-mono text-label tracking-widest text-fg-3 uppercase">
            From campaign setup to a qualified, payable call
          </h2>
        </Reveal>
        <div className="relative mt-10">
          {/* The trace draws left to right; each step arrives as the signal reaches it. */}
          <div aria-hidden="true" className="absolute top-5.5 right-[12.5%] left-[12.5%] hidden h-px bg-line md:block">
            <motion.div
              className="h-full origin-left bg-brand shadow-[0_0_8px] shadow-brand"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <ol
            aria-label="Pay-per-call workflow"
            className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6"
          >
            {steps.map((step, i) => (
              <Reveal
                as="li"
                key={step.label}
                delay={stagger(i, 4, 0.15)}
                className="relative flex flex-col items-center gap-2 text-center"
              >
                <CircuitNode icon={step.icon} active className="mb-3 bg-surface" />
                <span className="font-mono text-label tracking-widest text-fg-3 uppercase">
                  {String(i + 1).padStart(2, '0')} · {step.stage}
                </span>
                <span className="text-base font-medium text-fg">{step.label}</span>
                <span className="text-caption text-fg-3">{step.detail}</span>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal delay={0.3} className="mt-12 flex justify-center md:mt-14">
          <Button variant="outline" size="lg" asChild>
            <Link to={PLATFORM_PATH} aria-label="Know more about how Avortyx works">
              Know more <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </Section>
  )
}

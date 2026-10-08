import { useNavigate } from 'react-router'
import {
  Activity,
  ArrowRight,
  Check,
  Download,
  Gauge,
  ListFilter,
  Minus,
  Phone,
  PhoneCall,
  ShieldCheck,
  SlidersHorizontal,
  Waypoints,
  X,
  type LucideIcon,
} from 'lucide-react'
import { CircuitNode } from '@/components/brand/CircuitNode'
import { Meter } from '@/components/brand/Meter'
import { Reveal, stagger } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { StatusChip } from '@/components/brand/StatusChip'
import { Eyebrow, SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  comparisonRows,
  coverage,
  money,
  sampleConnectedCall,
  sampleNumber,
  sampleRules,
  type Coverage,
} from '@/data/engine'
import { cn } from '@/lib/utils'

/* ── Capabilities ───────────────────────────────────────────────────────── */

const capabilities: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Phone,
    title: 'Campaigns & numbers',
    desc: 'Buy or port local and toll-free numbers, attach them to campaigns, and manage number pools.',
  },
  {
    icon: Waypoints,
    title: 'Intent-based matching',
    desc: 'Score calls as they ring and match them against campaign rules and eligible buyers.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance screening',
    desc: 'Screen DNC, consent, VoIP, call velocity, and recording-rule signals before connecting.',
  },
  {
    icon: Activity,
    title: 'Monitoring & payouts',
    desc: 'Monitor calls in progress and review connected, qualified, and payout reporting.',
  },
]

export function CapabilitiesSection() {
  return (
    <Section id="capabilities">
      <SectionHeader label="Capabilities" title="Built around how pay-per-call works" />
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle lg:grid-cols-4">
        {capabilities.map((cap, i) => (
          <li key={cap.title} className="bg-canvas">
            <Reveal delay={stagger(i, 4)} className="flex h-full flex-col gap-3 p-4 sm:gap-4 sm:p-6">
              <CircuitNode icon={cap.icon} size="sm" />
              <h3 className="text-base font-semibold tracking-tight text-fg sm:text-h3">{cap.title}</h3>
              <p className="text-caption text-fg-3 sm:text-sm">{cap.desc}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* ── How it works ───────────────────────────────────────────────────────── */

const mockPanel = 'mt-auto rounded-lg border border-line-subtle bg-inset/70 bg-dots p-4'

function NumberMock() {
  return (
    <div aria-hidden="true" className={mockPanel}>
      <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface px-3 py-2.5">
        <span className="flex flex-col">
          <span className="font-mono text-label text-fg-3 uppercase">Tracking number</span>
          <span className="font-mono text-sm text-fg">{sampleNumber.number}</span>
        </span>
        <StatusChip size="sm" tone="ok">Provisioned</StatusChip>
      </div>
      <p className="mt-3 text-caption text-fg-3">
        Attached to <span className="font-mono text-fg-2">{sampleNumber.campaign}</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {sampleNumber.chips.map((chip) => (
          <span key={chip} className="rounded-xs border border-line bg-raised px-1.5 py-0.5 font-mono text-label text-fg-2">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

function RulesMock() {
  return (
    <div aria-hidden="true" className={mockPanel}>
      <div className="mb-2 flex items-center justify-between font-mono text-label text-fg-3 uppercase">
        <span>Routing rules</span>
        <span>{sampleRules.length} active</span>
      </div>
      <dl className="flex flex-col divide-y divide-line-subtle rounded-md border border-line bg-surface">
        {sampleRules.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 px-3 py-2 text-caption">
            <dt className="text-fg-3">{k}</dt>
            <dd className="font-mono text-fg">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ConnectedMock() {
  return (
    <div aria-hidden="true" className={mockPanel}>
      <div className="flex items-center gap-3 rounded-md border border-brand/35 bg-brand/6 px-3 py-2.5">
        <PhoneCall className="size-4 text-brand" />
        <span className="flex min-w-0 flex-col">
          <span className="text-label text-fg-3">Answered by</span>
          <span className="truncate text-sm font-medium text-fg">{sampleConnectedCall.buyer}</span>
        </span>
        <span className="ml-auto font-mono text-sm text-fg-2">{sampleConnectedCall.duration}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <StatusChip size="sm" tone="ok">{sampleConnectedCall.qualification}</StatusChip>
        <span className="font-mono text-sm text-fg">
          {money(sampleConnectedCall.payout)} <span className="text-fg-3">payout</span>
        </span>
      </div>
      <Meter value={42} max={100} label="Cap 42%" className="mt-3" />
    </div>
  )
}

const decisionSteps = [
  {
    icon: Activity,
    number: '01',
    title: 'Configure a campaign',
    desc: 'Attach phone numbers, set geographies and schedules, and define intent thresholds and buyer caps.',
    mock: NumberMock,
  },
  {
    icon: Waypoints,
    number: '02',
    title: 'Screen and route calls',
    desc: 'Check compliance before routing, then match the call to an eligible buyer using intent and campaign rules.',
    mock: RulesMock,
  },
  {
    icon: Gauge,
    number: '03',
    title: 'Monitor and settle',
    desc: 'Follow calls in progress, review qualification outcomes, and track the resulting payouts.',
    mock: ConnectedMock,
  },
]

export function DecisionModelSection() {
  return (
    <Section id="decision-model">
      <SectionHeader
        label="How it works"
        title="From campaign setup to payout"
        desc="Configure who can receive a call, screen it before connection, then follow the outcome through qualification and payout."
      />
      <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle lg:grid-cols-3">
        {decisionSteps.map((step, i) => (
          <li key={step.number} className="bg-canvas">
            <Reveal delay={stagger(i)} className="flex h-full flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <CircuitNode icon={step.icon} size="sm" active />
              <span className="font-mono text-label tracking-widest text-fg-3">Step {step.number}</span>
            </div>
            <h3 className="text-h3 font-semibold tracking-tight text-fg">{step.title}</h3>
            <p className="text-sm text-fg-3">{step.desc}</p>
            <step.mock />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/* ── Comparison (ported from the live site) ─────────────────────────────── */

function CoverageCell({ value, note }: { value: Coverage; note: string }) {
  const icon =
    value === 'yes' ? (
      <Check className="size-4 text-ok" aria-label="Yes" />
    ) : value === 'partial' ? (
      <Minus className="size-4 text-warn" aria-label="Partial" />
    ) : (
      <X className="size-4 text-fg-4" aria-label="No" />
    )
  return (
    <span className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="text-fg-3">{note}</span>
    </span>
  )
}

export function ComparisonSection() {
  const columns = [
    { name: 'Avortyx', sub: 'Routing engine, all in one' },
    { name: 'Legacy trackers', sub: 'Tracking + manual ops' },
    { name: 'DIY carrier', sub: 'Carrier APIs + your code' },
  ]
  const totals = [coverage(() => 'all'), coverage((r) => r.legacy[0]), coverage((r) => r.diy[0])]
  const highlight = 'bg-brand/5'

  return (
    <Section id="comparison">
      <SectionHeader
        label="Comparison"
        title="Why networks choose Avortyx"
        desc="Everything a pay-per-call network needs, without stitching a tracker to a carrier to a spreadsheet."
      />
      {/* Phones: one card per capability. */}
      <ul className="flex flex-col gap-3 md:hidden">
        {comparisonRows.map((row) => (
          <Reveal as="li" key={row.capability} className="rounded-xl border border-line bg-surface p-4">
            <h3 className="text-base font-medium text-fg">{row.capability}</h3>
            <div className="mt-3 flex items-start gap-2.5 rounded-md border border-brand/20 bg-brand/5 p-3 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-label="Yes" />
              <span>
                <span className="block font-medium text-brand-300">Avortyx</span>
                <span className="text-fg-2">{row.avortyx}</span>
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-caption">
              <div>
                <dt className="mb-1 text-fg-2">Legacy trackers</dt>
                <dd>
                  <CoverageCell value={row.legacy[0]} note={row.legacy[1]} />
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-fg-2">DIY carrier</dt>
                <dd>
                  <CoverageCell value={row.diy[0]} note={row.diy[1]} />
                </dd>
              </div>
            </dl>
          </Reveal>
        ))}
        <li className="flex items-center justify-between rounded-xl border border-line bg-surface p-4 font-mono text-sm">
          {columns.map((col, i) => (
            <span key={col.name} className="flex flex-col">
              <span className="font-sans text-caption text-fg-3">{col.name}</span>
              <span className={i === 0 ? 'text-fg' : 'text-fg-2'}>
                {totals[i]} / {comparisonRows.length}
              </span>
            </span>
          ))}
        </li>
      </ul>

      <Reveal className="hidden overflow-hidden rounded-xl border border-line md:block">
        <Table className="min-w-190 table-fixed">
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              <TableHead className="h-auto w-[28%] py-4 pl-5 align-bottom font-mono text-label tracking-widest text-fg-3 uppercase">
                Capability
              </TableHead>
              {columns.map((col, i) => (
                <TableHead
                  key={col.name}
                  className={cn('h-auto py-4 align-bottom whitespace-normal', i === 0 && cn(highlight, 'border-x border-brand/20'))}
                >
                  <span className={cn('block text-sm font-semibold', i === 0 ? 'text-brand-300' : 'text-fg')}>
                    {col.name}
                  </span>
                  <span className="block text-caption font-normal text-fg-3">{col.sub}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonRows.map((row) => (
              <TableRow key={row.capability} className="border-line-subtle hover:bg-raised/40">
                <TableCell className="py-4 pl-5 align-top font-medium whitespace-normal text-fg">
                  {row.capability}
                </TableCell>
                <TableCell className={cn('border-x border-brand/20 py-4 align-top whitespace-normal', highlight)}>
                  <span className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-label="Yes" />
                    <span className="text-fg-2">{row.avortyx}</span>
                  </span>
                </TableCell>
                <TableCell className="py-4 align-top whitespace-normal">
                  <CoverageCell value={row.legacy[0]} note={row.legacy[1]} />
                </TableCell>
                <TableCell className="py-4 align-top whitespace-normal">
                  <CoverageCell value={row.diy[0]} note={row.diy[1]} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-line bg-surface">
            <TableRow className="hover:bg-transparent">
              <TableCell className="py-4 pl-5 whitespace-normal">
                <span className="block text-sm font-medium text-fg">Coverage</span>
                <span className="block text-caption font-normal text-fg-3">Partial counts as half</span>
              </TableCell>
              {totals.map((t, i) => (
                <TableCell
                  key={i}
                  className={cn('py-4 font-mono text-h3 font-medium', i === 0 ? cn(highlight, 'border-x border-brand/20 text-fg') : 'text-fg-2')}
                >
                  {t} <span className="text-caption text-fg-3">/ {comparisonRows.length}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </Reveal>
      <p className="mt-4 text-caption text-fg-3">Avortyx's assessment of typical setups in each category.</p>
    </Section>
  )
}

/* ── Pricing ───────────────────────────────────────────────────────────── */

interface Plan {
  tier: string
  tagline: string
  price: string
  period?: string
  features: string[]
  cta: string
  featured?: boolean
}

const plans: Plan[] = [
  {
    tier: 'Starter',
    tagline: 'For running your first campaigns end to end',
    price: '$49',
    period: '/mo',
    features: [
      '500 routed calls / month',
      '3 campaigns',
      'Up to 10 buyers',
      'Numbers and basic reporting',
      'Email support',
    ],
    cta: 'Get started',
  },
  {
    tier: 'Growth',
    tagline: 'For networks routing real volume',
    price: '$199',
    period: '/mo',
    features: [
      '5,000 routed calls / month',
      'Unlimited campaigns and buyers',
      'Intent scoring and real-time bidding',
      'Live monitoring and compliance screening',
      'Automated payouts and priority support',
    ],
    cta: 'Choose Growth',
    featured: true,
  },
  {
    tier: 'Enterprise',
    tagline: 'For agencies and carriers at scale',
    price: 'Custom',
    features: [
      'Unlimited routed calls',
      'Dedicated number pools and private routing',
      '24/7 support and SLA',
      'SOC 2 / HIPAA controls',
      'Custom integrations and dedicated manager',
    ],
    cta: 'Contact sales',
  },
]

export function PricingSection() {
  const navigate = useNavigate()

  return (
    <Section id="pricing">
      <SectionHeader
        align="center"
        label="Pricing"
        title="Plans that scale with routed calls"
        desc="Published monthly plans include routed-call allowances. Only calls that reach a buyer are billed; see the workspace for additional-call rates."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal
            key={plan.tier}
            delay={stagger(i)}
            className={cn(
              'relative flex flex-col rounded-xl border p-6 inner-highlight sm:p-7',
              plan.featured
                ? 'border-brand/40 bg-[radial-gradient(120%_60%_at_50%_0%,rgb(59_130_246/0.14),transparent_70%)] bg-surface shadow-glow'
                : 'border-line bg-surface',
            )}
          >
            <div className="flex h-6 items-center justify-between">
              <h3 className="font-mono text-label tracking-widest text-fg-2 uppercase">{plan.tier}</h3>
              {plan.featured && <StatusChip tone="brand">Most popular</StatusChip>}
            </div>
            <p className="mt-3 text-sm text-fg-3">{plan.tagline}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-display font-semibold tracking-display text-fg">{plan.price}</span>
              {plan.period && <span className="text-base text-fg-3">{plan.period}</span>}
            </p>
            <Button
              size="lg"
              variant={plan.featured ? 'default' : 'outline'}
              className="mt-6 w-full"
              onClick={() => navigate(`/company/contact?intent=onboarding&plan=${plan.tier}`)}
            >
              {plan.cta}
            </Button>
            <ul className="mt-7 flex flex-col gap-3 border-t border-line-subtle pt-6 text-sm text-fg-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-4">
        <p className="text-caption text-fg-3">
          Transparent per-call billing · Only pay for calls that reach a buyer · Cancel anytime
        </p>
        <Button variant="link" size="sm" onClick={() => navigate('/enterprise-specs')}>
          Need an enterprise plan? Explore Enterprise <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </Section>
  )
}

/* ── Transparency ──────────────────────────────────────────────────────── */

const transparencyItems: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ListFilter,
    title: 'Readable event trail',
    text: 'Review timestamped events with severity filters instead of relying on a headline status.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Scenario controls',
    text: 'Adjust sample load, routing preference, and risk level to see how the demo responds.',
  },
  {
    icon: Download,
    title: 'Portable telemetry',
    text: 'Export the visible sample events and metric values as a CSV for closer inspection.',
  },
]

export function TransparencySection() {
  return (
    <Section id="product-transparency">
      <SectionHeader
        label="Built for technical evaluation"
        title="Inspect the controls, not just the claims"
        desc="Explore the operator-facing details that make a routing workflow easier to evaluate."
      />
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle md:grid-cols-3">
        {transparencyItems.map((item, i) => (
          <li key={item.title} className="bg-canvas max-md:odd:last:col-span-2">
            <Reveal delay={stagger(i)} className="flex h-full flex-col gap-3 p-4 sm:gap-4 sm:p-6">
              <CircuitNode icon={item.icon} size="sm" />
              <h3 className="text-base font-semibold tracking-tight text-fg sm:text-h3">{item.title}</h3>
              <p className="text-caption text-fg-3 sm:text-sm">{item.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* ── Closing call to action ────────────────────────────────────────────── */

export function LandingClose() {
  const navigate = useNavigate()

  return (
    <Section innerClassName="pb-28 lg:pb-36">
      <Reveal className="relative isolate overflow-hidden rounded-2xl border border-brand/25 bg-surface px-6 py-16 text-center sm:px-12 md:py-20">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-70" />
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -z-10 h-64 w-[min(720px,90%)] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
        />
        <Eyebrow className="justify-center">Build what comes next</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-[18ch] text-h1 font-semibold tracking-heading text-fg md:text-display md:tracking-display">
          Make every connection count.
        </h2>
        <p className="mx-auto mt-5 max-w-[48ch] text-base text-fg-2 md:text-lg">
          Score, screen, route, monitor, and pay for the calls your buyers want.
        </p>
        <Button size="xl" className="mt-9" onClick={() => navigate('/company/contact?intent=demo')}>
          Talk to our team <ArrowRight data-icon="inline-end" />
        </Button>
      </Reveal>
      {/* The signal settles: a single point of light between the call to action and the footer. */}
      <div aria-hidden="true" className="pointer-events-none relative mx-auto -mb-20 h-40 w-40">
        <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-24 w-px -translate-1/2 bg-linear-to-b from-transparent via-brand-300 to-transparent" />
        <div className="absolute top-1/2 left-1/2 h-px w-24 -translate-1/2 bg-linear-to-r from-transparent via-brand-300 to-transparent" />
        <div className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-white shadow-[0_0_16px_4px] shadow-brand-300" />
      </div>
    </Section>
  )
}

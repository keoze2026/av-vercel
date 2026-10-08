import type { ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building,
  CircleCheck,
  Code,
  Mail,
  Server,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { CircuitNode } from '@/components/brand/CircuitNode'
import { Reveal } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { SampleTag } from '@/components/brand/StatusChip'
import { IntegrationLogo } from '@/components/generic/IntegrationLogo'
import { SalesRequestForm } from '@/components/generic/SalesRequestForm'
import { PageShell } from '@/components/layout/PageShell'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { CONTACT_EMAIL } from '@/data/site'
import { usePageTitle } from '@/hooks/usePageTitle'

export type GenericPageType =
  | 'blogs'
  | 'integrations'
  | 'case-studies'
  | 'about'
  | 'careers'
  | 'contact'
  | 'enterprise-specs'

const tile = 'rounded-xl border border-line bg-surface inner-highlight'
const monoLabel = 'font-mono text-label tracking-widest text-fg-3 uppercase'

/* ── Blogs ─────────────────────────────────────────────────────────────── */

const guides = [
  {
    title: 'Designing a pay-per-call campaign',
    snippet:
      'A checklist for defining geography, schedules, intent thresholds, buyer eligibility, and caps before launch.',
    topic: 'Campaign setup',
  },
  {
    title: 'Choosing the right buyer',
    snippet:
      'How to think about buyer fit, availability, bids, qualification criteria, and fallback options.',
    topic: 'Buyer routing',
  },
  {
    title: 'Building a compliance review',
    snippet:
      'Questions to ask about DNC screening, consent records, state recording rules, and decision history.',
    topic: 'Compliance',
  },
  {
    title: 'Following calls through payout',
    snippet:
      'A guide to reviewing connected and qualified calls and reconciling outcomes across campaigns and partners.',
    topic: 'Reporting',
  },
]

function BlogsContent() {
  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-[68ch] text-base text-fg-2">
        These supplemental guides are informational content on this demo site, not published
        Avortyx articles or product documentation.
      </p>
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle sm:grid-cols-2">
        {guides.map((g) => (
          <li key={g.title} className="flex flex-col gap-4 bg-canvas p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className={monoLabel}>Supplemental guide</span>
              <span className="rounded-full border border-line bg-raised px-2.5 py-0.5 text-label text-fg-2">
                {g.topic}
              </span>
            </div>
            <h2 className="text-h3 font-semibold tracking-tight text-fg">{g.title}</h2>
            <p className="flex-1 text-sm text-fg-2">{g.snippet}</p>
            <span className="text-caption text-fg-3">Guide preview</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Integrations ──────────────────────────────────────────────────────── */

const integrations = [
  'Salesforce',
  'HubSpot',
  'Datadog',
  'Stripe',
  'Zendesk',
  'Tableau',
  'Snowflake',
  'Custom Webhooks',
  'Retool',
  'Slack',
]

const planningCards = [
  {
    title: 'Campaign setup',
    text: 'Plan how number inventory, campaign geography and schedules, buyer eligibility, and capacity limits fit your operating workflow.',
    points: ['Numbers and campaign inventory', 'Buyer rules and caps'],
  },
  {
    title: 'Reporting & data',
    text: 'Map the call, qualification, and payout fields your team needs across campaigns, buyers, and publishers.',
    points: ['Connected and qualified calls', 'Payout reporting'],
  },
]

function IntegrationsContent() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle sm:grid-cols-3 lg:grid-cols-5">
          {integrations.map((name) => (
            <li key={name} className="flex min-h-36 flex-col items-center justify-center gap-3 bg-canvas p-5">
              <IntegrationLogo name={name} />
              <span className="text-center text-sm font-medium text-fg">{name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-caption text-fg-3">
          Logos are illustrative examples only. Confirm current native integrations, API access, and
          data-export options with Avortyx before planning an implementation.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {planningCards.map((c) => (
          <div key={c.title} className={`${tile} p-6 sm:p-8`}>
            <h2 className="text-h3 font-semibold tracking-tight text-fg">{c.title}</h2>
            <p className="mt-3 text-sm text-fg-2">{c.text}</p>
            <ul className="mt-6 flex flex-col gap-3 border-t border-line-subtle pt-5">
              {c.points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-fg-2">
                  <CircleCheck className="size-4 text-ok" aria-hidden="true" /> {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Sample workflows ──────────────────────────────────────────────────── */

const workflows = [
  {
    scenario: 'High-intent call',
    action: 'Match with a buyer that meets campaign rules',
    focus: 'INTENT SCORING',
    signals: 'Sample intent score · active campaign · eligible buyer capacity',
    outcome: 'Example output: select an eligible sample buyer.',
  },
  {
    scenario: 'Buyer schedule mismatch',
    action: 'Consider another eligible buyer',
    focus: 'CAMPAIGN SCHEDULE',
    signals: 'Sample call geography · buyer schedules · campaign hours',
    outcome: 'Example output: route to a buyer with an open sample schedule.',
  },
  {
    scenario: 'Buyer reaches a cap',
    action: 'Skip the capped buyer',
    focus: 'BUYER CAPS',
    signals: 'Sample daily cap · concurrency limit · remaining buyer capacity',
    outcome: 'Example output: consider another buyer within the sample campaign rules.',
  },
]

function CaseStudiesContent() {
  return (
    <ul className="flex flex-col gap-4">
      {workflows.map((w) => (
        <li key={w.scenario} className={`${tile} grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={monoLabel}>{w.focus}</span>
              <SampleTag>Mock data</SampleTag>
            </div>
            <h2 className="text-h2 font-semibold tracking-tight text-fg">{w.scenario}</h2>
            <p className="text-sm text-fg-3">Signals: {w.signals}</p>
          </div>
          <div className="rounded-lg border border-brand/30 bg-brand/6 p-5">
            <p className="font-mono text-label tracking-widest text-brand-300 uppercase">Sample policy action</p>
            <p className="mt-2 text-base font-medium text-fg">{w.action}</p>
            <p className="mt-2 text-caption text-fg-2">{w.outcome}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ── About ─────────────────────────────────────────────────────────────── */

const pillars = [
  {
    title: 'Score and route',
    text: 'Score calls as they ring and select an eligible buyer using campaign rules.',
  },
  {
    title: 'Screen for compliance',
    text: 'Apply DNC, consent, VoIP, call-velocity, and recording-rule checks before a buyer is rung.',
  },
  {
    title: 'Monitor through payout',
    text: 'Follow active calls and review connected, qualified, and payout reporting.',
  },
]

function AboutContent() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <h2 className="text-h2 font-semibold tracking-tight text-fg md:text-h1 md:tracking-heading">
          One platform for the call lifecycle
        </h2>
        <div className="flex flex-col gap-5 text-lg text-fg-2">
          <p>
            Avortyx brings call tracking, first-ring intent scoring, buyer routing, compliance
            screening, live monitoring, reporting, and payouts into one pay-per-call platform.
          </p>
          <p>
            Teams can use their own buyers, the Avortyx buyer marketplace, or both. Campaign rules can
            account for geography, schedule, intent, and buyer capacity.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle md:grid-cols-3">
        {pillars.map((p, i) => (
          <li key={p.title} className="flex flex-col gap-3 bg-canvas p-4 max-md:odd:last:col-span-2 sm:p-6">
            <span className="font-mono text-label tracking-widest text-fg-3">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-base font-semibold tracking-tight text-fg sm:text-h3">{p.title}</h3>
            <p className="text-caption text-fg-2 sm:text-sm">{p.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Careers ───────────────────────────────────────────────────────────── */

function CareersContent() {
  return (
    <div className={`${tile} flex flex-col items-start gap-5 p-8 md:flex-row md:items-center md:justify-between md:p-10`}>
      <div className="max-w-xl">
        <h2 className="text-h2 font-semibold tracking-tight text-fg">Current opportunities</h2>
        <p className="mt-3 text-base text-fg-2">
          No job listings are published on this page. Contact Avortyx directly to ask about current
          openings.
        </p>
      </div>
      <Button size="lg" asChild>
        <a href={`mailto:${CONTACT_EMAIL}?subject=Careers%20inquiry`}>
          Email {CONTACT_EMAIL} <ArrowRight data-icon="inline-end" />
        </a>
      </Button>
    </div>
  )
}

/* ── Contact ───────────────────────────────────────────────────────────── */

function ContactContent() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="flex flex-col gap-6">
        <h2 className="text-h2 font-semibold tracking-tight text-fg">Talk through your call workflow</h2>
        <p className="text-base text-fg-2">
          Send a product or pricing question to the contact address published on the Avortyx site.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className={`${tile} group flex items-center gap-4 p-5 transition-colors hover:border-line-strong`}
        >
          <CircuitNode icon={Mail} size="sm" />
          <span>
            <span className="block text-sm font-medium text-fg">Email</span>
            <span className="block text-sm text-fg-3 group-hover:text-fg-2">{CONTACT_EMAIL}</span>
          </span>
        </a>
      </div>
      <SalesRequestForm />
    </div>
  )
}

/* ── Enterprise ────────────────────────────────────────────────────────── */

const enterpriseSpecs = [
  {
    title: 'Scale',
    description:
      'Enterprise pricing is custom and includes unlimited routed calls and dedicated number pools.',
  },
  {
    title: 'Routing & compliance',
    description:
      'Private routing and SOC 2 / HIPAA controls are listed as Enterprise capabilities on the public Avortyx site.',
  },
  {
    title: 'Support',
    description:
      'The published Enterprise plan includes 24/7 support, an SLA, custom integrations, and a dedicated manager.',
  },
]

function EnterpriseContent() {
  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle md:grid-cols-3">
        {enterpriseSpecs.map((s) => (
          <li key={s.title} className="flex flex-col gap-3 bg-canvas p-4 max-md:odd:last:col-span-2 sm:p-8">
            <h2 className="text-base font-semibold tracking-tight text-fg sm:text-h3">{s.title}</h2>
            <p className="text-caption text-fg-2 sm:text-sm">{s.description}</p>
          </li>
        ))}
      </ul>
      <div>
        <Button size="lg" asChild>
          <Link to="/company/contact?intent=onboarding&plan=Enterprise">
            Ask about Enterprise <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────── */

const pages: Record<
  GenericPageType,
  { title: string; subtitle: string; section: string; icon: LucideIcon; content: () => ReactNode }
> = {
  blogs: {
    title: 'Pay-Per-Call Guides',
    subtitle:
      'Practical guides to help teams evaluate campaign setup, buyer routing, compliance, and call outcomes.',
    section: 'Resources',
    icon: BookOpen,
    content: BlogsContent,
  },
  integrations: {
    title: 'Integration Planning',
    subtitle:
      'Explore common tools and integration questions to discuss with Avortyx. The examples below are not a list of confirmed native integrations.',
    section: 'Resources',
    icon: Code,
    content: IntegrationsContent,
  },
  'case-studies': {
    title: 'Illustrative Workflow Examples',
    subtitle:
      'Synthetic scenarios show how call signals can inform routing and risk review. These are examples, not customer stories or measured results.',
    section: 'Resources',
    icon: Users,
    content: CaseStudiesContent,
  },
  about: {
    title: 'About Avortyx',
    subtitle: 'Call intelligence for pay-per-call networks.',
    section: 'Company',
    icon: Building,
    content: AboutContent,
  },
  careers: {
    title: 'Careers at Avortyx',
    subtitle: 'Ask Avortyx about current openings and opportunities to work together.',
    section: 'Company',
    icon: Briefcase,
    content: CareersContent,
  },
  contact: {
    title: 'Contact Avortyx',
    subtitle: 'Ask about a product walkthrough, campaign setup, pricing, or an Enterprise plan.',
    section: 'Company',
    icon: Mail,
    content: ContactContent,
  },
  'enterprise-specs': {
    title: 'Avortyx Enterprise',
    subtitle:
      'A custom plan for teams that need higher call volumes, private routing, dedicated support, or custom integrations.',
    section: 'Pricing',
    icon: Server,
    content: EnterpriseContent,
  },
}

export default function GenericPage({ type }: { type: GenericPageType }) {
  const page = pages[type]
  const Content = page.content
  usePageTitle(page.title, page.subtitle)

  return (
    <PageShell>
      <section className="relative isolate overflow-hidden pt-header">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute -top-64 left-1/2 h-120 w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-brand-600/16 blur-[120px]" />
        </div>
        <div className="chassis pt-10 pb-14 md:pt-14 md:pb-20">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-fg-3">{page.section}</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{page.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Reveal className="mt-10 flex flex-col items-start gap-6">
            <CircuitNode icon={page.icon} active />
            <h1 className="max-w-[20ch] text-h1 font-semibold tracking-heading text-fg md:text-display md:tracking-display">
              {page.title}
            </h1>
            <p className="max-w-[60ch] text-base text-fg-2 md:text-lg">{page.subtitle}</p>
          </Reveal>
        </div>
      </section>
      <Section innerClassName="min-h-[40vh]">
        <Reveal delay={0.1}>
          <Content />
        </Reveal>
      </Section>
    </PageShell>
  )
}

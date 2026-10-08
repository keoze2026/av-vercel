import { Link, useLocation } from 'react-router'
import { Mail } from 'lucide-react'
import { AvortyxMark } from '@/components/AvortyxMark'
import { StatusChip } from '@/components/brand/StatusChip'
import { CONTACT_EMAIL } from '@/data/site'
import { scrollToTop } from '@/lib/motion'

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: 'Products',
    links: [
      ['Numbers & Call Tracking', '/product/tracking'],
      ['Visual Campaign Routing', '/product/ivr'],
      ['First-Ring Intent Scoring', '/product/ringtree'],
      ['Buyer Marketplace', '/product/pingpost'],
      ['Monitoring & Reporting', '/product/whitelabel'],
      ['Compliance Screening', '/product/fraud'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/company/about'],
      ['Careers', '/company/careers'],
      ['Contact', '/company/contact'],
      ['Blog', '/resources/blogs'],
    ],
  },
  {
    title: 'Explore',
    links: [
      ['Pricing', '/#pricing'],
      ['Sample workflows', '/resources/case-studies'],
      ['Integration planning', '/resources/integrations'],
      ['Enterprise', '/enterprise-specs'],
    ],
  },
]

export function Footer() {
  const { pathname } = useLocation()

  return (
    <footer className="relative overflow-hidden border-t border-line-subtle">
      {/* The closing glow: the signal settling at the bottom of the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-brand-500/12 blur-3xl"
      />
      <div className="chassis rule-marks relative pt-16 pb-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12">
          <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2.5 text-lg font-semibold tracking-tight text-fg"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault()
                  scrollToTop()
                }
              }}
            >
              <AvortyxMark className="size-7" /> Avortyx
            </Link>
            <p className="max-w-xs text-sm text-fg-3">
              Pay-per-call call intelligence for campaign setup, buyer routing, compliance,
              monitoring, and payouts.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex w-fit items-center gap-2 text-sm text-fg-2 hover:text-fg"
            >
              <Mail className="size-4 text-fg-3" aria-hidden="true" /> {CONTACT_EMAIL}
            </a>
            <div className="flex flex-wrap gap-2">
              <StatusChip tone="brand">Illustrative demo</StatusChip>
              <StatusChip tone="ok">No live traffic</StatusChip>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
              <h2 className="font-mono text-label font-medium tracking-widest text-fg-3 uppercase">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {col.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-fg-2 transition-colors hover:text-fg">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle pt-6 text-caption text-fg-3">
          <span className="font-mono">© {new Date().getFullYear()} Avortyx</span>
          <span>Pay-per-call platform</span>
        </div>
      </div>
    </footer>
  )
}

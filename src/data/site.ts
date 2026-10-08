/** Navigation shared by the header, the mobile sheet and the footer. */

export interface NavLink {
  label: string
  to: string
  desc?: string
}

export const resourceLinks: NavLink[] = [
  {
    label: 'Blogs & Articles',
    to: '/resources/blogs',
    desc: 'Guides to campaign setup, buyer routing, compliance and call outcomes.',
  },
  {
    label: 'Integrations',
    to: '/resources/integrations',
    desc: 'Common tools and integration questions to discuss with Avortyx.',
  },
  {
    label: 'Sample Workflows',
    to: '/resources/case-studies',
    desc: 'Synthetic scenarios showing how call signals inform routing.',
  },
]

export const companyLinks: NavLink[] = [
  { label: 'About Us', to: '/company/about', desc: 'Call intelligence for pay-per-call networks.' },
  { label: 'Careers', to: '/company/careers', desc: 'Ask about current openings.' },
  {
    label: 'Contact',
    to: '/company/contact',
    desc: 'A product walkthrough, campaign setup, pricing or Enterprise.',
  },
]

/** Top-level links that land on a section of a page. */
export const sectionLinks = [
  { label: 'Pricing', to: '/#pricing' },
  { label: 'Console', to: '/platform#console' },
] as const

/** The deep-dive page behind the landing page's "Know more" links. */
export const PLATFORM_PATH = '/platform'

export const CONTACT_EMAIL = 'hello@avortyx.io'

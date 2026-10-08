import {
  Activity,
  Cpu,
  Network,
  PanelsTopLeft,
  ShieldAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export type ProductId = 'tracking' | 'ivr' | 'ringtree' | 'pingpost' | 'whitelabel' | 'fraud'

export interface Faq {
  q: string
  a: string
}

export interface Product {
  id: ProductId
  title: string
  desc: string
  color: string
  glow: string
  icon: LucideIcon
  features: string[]
  faqs: Faq[]
}

export const products: Product[] = [
  {
    id: 'tracking',
    title: 'Numbers & Call Tracking',
    desc: 'Buy local and toll-free numbers or bring your existing numbers, then pool them across campaigns.',
    color: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.5)',
    icon: Network,
    features: [
      'Local and toll-free number inventory across all 50 states',
      'Buy numbers or port numbers you already own',
      'Attach tracking numbers to individual campaigns',
      'Pool numbers for dynamic campaign attribution',
      'Set number-level daily and concurrency caps',
      'Keep number, call, and campaign details in one workspace',
    ],
    faqs: [
      {
        q: 'Can I bring my existing phone numbers?',
        a: 'Yes. You can port numbers you already own, or buy local and toll-free numbers through Avortyx.',
      },
      {
        q: 'Where are numbers available?',
        a: 'The Avortyx site describes local and toll-free number coverage across all 50 states.',
      },
      {
        q: 'Can numbers be shared across campaigns?',
        a: 'Numbers can be pooled per campaign for dynamic number insertion, with caps available for each number.',
      },
      {
        q: 'Is this number inventory live in this demo?',
        a: 'No. The on-page number and activity examples are illustrative and are not connected to the live Avortyx service.',
      },
    ],
  },
  {
    id: 'ivr',
    title: 'Visual Campaign Routing',
    desc: 'Build and review call-routing rules for intent, geography, schedule, and buyer capacity in a visual workflow.',
    color: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.5)',
    icon: Activity,
    features: [
      'Visual routing rules rather than spreadsheet-only workflows',
      'Filter by state and campaign geography',
      'Apply day-of-week and time-of-day schedules',
      'Use intent thresholds as a routing signal',
      'Respect per-buyer concurrency and daily caps',
      'Review campaign settings before launch',
    ],
    faqs: [
      {
        q: 'Which routing rules can I configure?',
        a: 'Campaign rules can use call intent, state, daypart, and buyer concurrency or daily caps.',
      },
      {
        q: 'Can I see the routing logic?',
        a: 'The product is presented as a visual rules workflow, so campaign conditions are visible to the team operating them.',
      },
      {
        q: 'Are routing examples on this page connected to a campaign?',
        a: 'No. Interactive examples use mock values and do not create or modify a campaign.',
      },
    ],
  },
  {
    id: 'ringtree',
    title: 'First-Ring Intent Scoring',
    desc: 'Score inbound calls while they are ringing and use the available signals to select an eligible buyer.',
    color: '#93c5fd',
    glow: 'rgba(147, 197, 253, 0.5)',
    icon: Cpu,
    features: [
      'Evaluate intent using call signals before connection',
      'Match a call with buyers that meet campaign rules',
      'Consider geography, schedule, and buyer capacity',
      'Route while the caller is still on the first ring',
      'Use buyer bids as part of real-time selection',
      'Keep the call decision and its outcome available for review',
    ],
    faqs: [
      {
        q: 'When is intent scored?',
        a: 'Avortyx describes scoring and buyer selection as happening while the call is still ringing, typically well under a second.',
      },
      {
        q: 'How is a buyer selected?',
        a: 'Eligible buyers are evaluated against the campaign rules and available signals; buyer bids can be used in real-time selection.',
      },
      {
        q: 'Are the scores shown in this page real?',
        a: 'No. Scores and routing results shown in this interactive demo are synthetic examples.',
      },
    ],
  },
  {
    id: 'pingpost',
    title: 'Buyer Marketplace & Bidding',
    desc: 'Bring your own buyers, publish campaign inventory to the marketplace, or use both approaches together.',
    color: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.5)',
    icon: Zap,
    features: [
      'Add buyers, destinations, bids, and capacity limits',
      'Publish campaign inventory to eligible marketplace buyers',
      'Let eligible buyers bid on inbound calls in real time',
      'Apply state, schedule, and campaign eligibility rules',
      'Manage your own buyers and marketplace buyers together',
      'Review sample buyer selection and payout details',
    ],
    faqs: [
      {
        q: 'Do I have to use the Avortyx marketplace?',
        a: 'No. You can add your own buyers, use marketplace buyers, or run both side by side.',
      },
      {
        q: 'How does marketplace bidding work?',
        a: 'The public site describes eligible buyers bidding on traffic in real time, with campaign rules and buyer caps applied.',
      },
      {
        q: 'Are buyer names and bids shown here real?',
        a: 'No. Names, bids, and call outcomes in this visual demo are mock data.',
      },
    ],
  },
  {
    id: 'whitelabel',
    title: 'Live Monitoring & Reporting',
    desc: 'See in-flight calls and review connected, qualified, and payout activity by campaign, buyer, and publisher.',
    color: '#93c5fd',
    glow: 'rgba(147, 197, 253, 0.5)',
    icon: PanelsTopLeft,
    features: [
      'Monitor calls while they are in progress',
      'Give supervisors barge and whisper controls',
      'Review call logs and basic reporting',
      'View connected and qualified call totals',
      'Break down activity by campaign, buyer, and publisher',
      'Inspect payout activity as calls are recorded',
    ],
    faqs: [
      {
        q: 'Can supervisors listen to active calls?',
        a: 'The Avortyx product description lists live monitoring with barge and whisper for supervisors.',
      },
      {
        q: 'Which reports are available?',
        a: 'The public site describes connected, qualified, and payout reporting by campaign, buyer, and publisher.',
      },
      {
        q: 'Does this page show live calls?',
        a: 'No. This page presents an illustrative interface and does not connect to customer or production call data.',
      },
    ],
  },
  {
    id: 'fraud',
    title: 'Compliance & Call Screening',
    desc: 'Apply compliance and fraud checks before an attempt is routed to a buyer, with decisions recorded for review.',
    color: '#60a5fa',
    glow: 'rgba(147, 197, 253, 0.5)',
    icon: ShieldAlert,
    features: [
      'Screen against federal, state, and internal DNC lists',
      'Keep TCPA consent proof with the call record',
      'Check VoIP and call-velocity fraud signals',
      'Apply state-specific two-party recording rules',
      'Record screening decisions for audit review',
      'Export decision details from the call record',
    ],
    faqs: [
      {
        q: 'When does compliance screening happen?',
        a: 'The public site says each attempt is screened before it rings a buyer.',
      },
      {
        q: 'Which checks are described?',
        a: 'The site lists federal, state, and internal DNC screening, TCPA consent proof, VoIP and velocity signals, and state recording rules.',
      },
      {
        q: 'Can screening decisions be reviewed?',
        a: 'The product describes storing the decision on the call record and making it exportable for audit.',
      },
    ],
  },
]

export type PowerFeatureId = 'arch' | 'support' | 'pricing' | 'scale'

export interface PowerFeature {
  id: PowerFeatureId
  title: string
  desc: string
  color: string
  glow: string
}

/** "Why Avortyx" list on the home page. */
export const powerFeatures: PowerFeature[] = [
  {
    id: 'arch',
    title: 'Score calls on the first ring',
    desc: 'Evaluate intent and select an eligible buyer while the call is still ringing.',
    color: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.5)',
  },
  {
    id: 'support',
    title: 'Screen before connecting',
    desc: 'Apply DNC, consent, VoIP, velocity, and recording-rule checks before an attempt reaches a buyer.',
    color: '#93c5fd',
    glow: 'rgba(147, 197, 253, 0.5)',
  },
  {
    id: 'pricing',
    title: 'Bring your own buyers',
    desc: 'Route to buyers you add yourself, marketplace participants, or a combination of both.',
    color: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.5)',
  },
  {
    id: 'scale',
    title: 'Track calls through payout',
    desc: 'Monitor in-flight calls and review connected, qualified, and payout activity by campaign and partner.',
    color: '#93c5fd',
    glow: 'rgba(59, 130, 246, 0.5)',
  },
]

export type ConsoleModuleId = 'routing' | 'fraud' | 'analytics'

export interface ConsoleStat {
  label: string
  value: string
  unit: string
}

export interface ConsoleModule {
  id: ConsoleModuleId
  title: string
  desc: string
  stats: ConsoleStat[]
  color: string
  glow: string
}

/** Modules of the simulated console preview on the home page. */
export const consoleModules: ConsoleModule[] = [
  {
    id: 'routing',
    title: 'Intent & Buyer Routing',
    desc: 'Illustrative call intent, eligible buyers, bids, and capacity rules in a sample routing view.',
    stats: [
      { label: 'Sample Calls', value: '3,492', unit: '' },
      { label: 'Intent Score', value: '82', unit: '/ 100' },
      { label: 'Eligible Buyers', value: '5', unit: '' },
    ],
    color: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.6)',
  },
  {
    id: 'fraud',
    title: 'Compliance Screening',
    desc: 'Illustrative DNC, consent, VoIP, and velocity checks shown before a sample call reaches a buyer.',
    stats: [
      { label: 'Screened', value: '14,092', unit: 'calls' },
      { label: 'Review Risk', value: 'Low', unit: '' },
      { label: 'Sample Flags', value: '98', unit: '' },
    ],
    color: '#93c5fd',
    glow: 'rgba(147, 197, 253, 0.6)',
  },
  {
    id: 'analytics',
    title: 'Campaign Reporting & Payouts',
    desc: 'Illustrative connected-call, buyer, campaign, and payout activity from a synthetic sample session.',
    stats: [
      { label: 'Qualified Calls', value: '846', unit: '' },
      { label: 'Sample Payout', value: '$18.42', unit: '' },
      { label: 'Match Rate', value: '84', unit: '%' },
    ],
    color: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.6)',
  },
]

export const homeFaqs: Faq[] = [
  {
    q: 'How does Avortyx pricing work?',
    a: 'Starter is $49 per month with 500 routed calls included; Growth is $199 per month with 5,000. The public pricing page says only calls that reach a buyer are billed, with additional-call rates shown in the workspace.',
  },
  {
    q: 'Can I use my own phone numbers and buyers?',
    a: 'Yes. The public site describes buying local or toll-free numbers across all 50 states or porting numbers you own, and adding your own buyers. Inventory can also be offered to marketplace buyers.',
  },
  {
    q: 'How are calls screened for compliance?',
    a: 'Avortyx describes pre-route checks for federal, state, and internal DNC lists, TCPA consent proof, VoIP and velocity signals, and state-specific two-party recording rules. Screening decisions are stored with the call record.',
  },
  {
    q: 'How quickly are calls scored and routed?',
    a: 'The public site says scoring and buyer selection happen while the call is ringing, typically well under a second.',
  },
  {
    q: 'Can I monitor calls and review payouts?',
    a: 'The product description includes live call monitoring with supervisor barge and whisper, plus reporting for connected, qualified, and payout activity by campaign, buyer, and publisher.',
  },
  {
    q: 'What service-level commitments are available?',
    a: 'The published FAQ lists a 99.9% routing uptime SLA for Growth and 99.99% for Enterprise, with guaranteed response times and dedicated support on Enterprise. Confirm current terms with Avortyx.',
  },
]

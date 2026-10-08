/**
 * Sample data for the coded console fragments, carried over from the live
 * avortyx.com routing engine. Every caller, buyer and payout here is fictional.
 */

export type BuyerOutcome = 'won' | 'cap' | 'outbid' | 'geo'

export interface EngineBuyer {
  name: string
  bid: number
  outcome: BuyerOutcome
  /** Share of the buyer's daily cap already used, 0–100. */
  cap: number
}

export interface EngineScenario {
  id: string
  campaign: string
  vertical: string
  caller: string
  state: string
  source: string
  publisher: string
  intent: number
  /** Time to connect, seconds. */
  connect: number
  /** Auction decision time, ms. */
  decisionMs: number
  buyers: EngineBuyer[]
}

export const engineScenarios: EngineScenario[] = [
  {
    id: 'health',
    campaign: 'medicare-open-enrollment',
    vertical: 'Health',
    caller: '+1 (323) •••-9499',
    state: 'TX',
    source: 'Google Ads',
    publisher: 'MediaFlow',
    intent: 92,
    connect: 1.4,
    decisionMs: 41,
    buyers: [
      { name: 'Apex Insurance', bid: 65, outcome: 'won', cap: 42 },
      { name: 'Northwind Benefits', bid: 61, outcome: 'cap', cap: 100 },
      { name: 'Meridian Health', bid: 58, outcome: 'outbid', cap: 67 },
      { name: 'Summit Care', bid: 49, outcome: 'geo', cap: 23 },
    ],
  },
  {
    id: 'home',
    campaign: 'roofing-storm-damage',
    vertical: 'Home services',
    caller: '+1 (214) •••-7783',
    state: 'FL',
    source: 'Meta Ads',
    publisher: 'CallPeak',
    intent: 87,
    connect: 1.1,
    decisionMs: 38,
    buyers: [
      { name: 'HomeShield Pros', bid: 42, outcome: 'won', cap: 31 },
      { name: 'Gulf Coast Roofing', bid: 39.5, outcome: 'outbid', cap: 58 },
      { name: 'BrightPath Solar', bid: 44, outcome: 'geo', cap: 12 },
      { name: 'Keystone Plumbing', bid: 36, outcome: 'cap', cap: 100 },
    ],
  },
  {
    id: 'auto',
    campaign: 'auto-insurance-high-intent',
    vertical: 'Auto',
    caller: '+1 (646) •••-2210',
    state: 'OH',
    source: 'Organic search',
    publisher: 'LeadBridge',
    intent: 78,
    connect: 1.8,
    decisionMs: 47,
    buyers: [
      { name: 'DriveSure Auto', bid: 37.5, outcome: 'won', cap: 55 },
      { name: 'Lakeside Motors', bid: 35, outcome: 'outbid', cap: 74 },
      { name: 'Allied Warranty', bid: 40, outcome: 'cap', cap: 100 },
      { name: 'Metro Auto Finance', bid: 29, outcome: 'outbid', cap: 40 },
    ],
  },
]

/** Publisher share of the winning bid on the sample plan. */
export const PUBLISHER_SHARE = 0.64

/** Starting value of the "routed today" counter. */
export const ROUTED_TODAY = 1283

export const outcomeLabel: Record<BuyerOutcome, string> = {
  won: 'Connected',
  cap: 'Cap reached',
  outbid: 'Outbid',
  geo: 'Out of geo',
}

export const money = (n: number, cents = true) =>
  `$${n.toLocaleString('en-US', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  })}`

/* ── Comparison (live site: "Why networks choose Avortyx") ─────────────────── */

export type Coverage = 'yes' | 'partial' | 'no'

export interface ComparisonRow {
  capability: string
  avortyx: string
  legacy: [Coverage, string]
  diy: [Coverage, string]
}

export const comparisonRows: ComparisonRow[] = [
  {
    capability: 'Intent scoring on the first ring',
    avortyx: 'Scored from live signals before the buyer picks up',
    legacy: ['no', 'Post-call only'],
    diy: ['no', 'Not available'],
  },
  {
    capability: 'Real-time buyer bidding',
    avortyx: 'Every eligible buyer bids on every call',
    legacy: ['partial', 'Static price tiers'],
    diy: ['no', 'Manual rate cards'],
  },
  {
    capability: 'TCPA & DNC screening built in',
    avortyx: 'Every attempt screened before it rings',
    legacy: ['partial', 'Third-party add-on'],
    diy: ['no', 'Your own integration'],
  },
  {
    capability: 'Live barge & whisper',
    avortyx: 'Supervisors join any in-flight call',
    legacy: ['partial', 'Listen-only'],
    diy: ['no', 'Carrier dependent'],
  },
  {
    capability: 'Per-buyer caps & concurrency',
    avortyx: 'Hourly, daily, monthly and concurrent limits',
    legacy: ['yes', 'Daily caps'],
    diy: ['partial', 'Hand-built limits'],
  },
  {
    capability: 'Automated publisher payouts',
    avortyx: 'Settled from the call record, no spreadsheets',
    legacy: ['no', 'Export & reconcile'],
    diy: ['no', 'Manual'],
  },
  {
    capability: 'Visual routing rules',
    avortyx: 'Geo, daypart, intent and caps in one builder',
    legacy: ['no', 'Config forms'],
    diy: ['no', 'Code'],
  },
  {
    capability: 'Number porting & pooling',
    avortyx: 'Port, pool and rotate from one place',
    legacy: ['partial', 'Buy only'],
    diy: ['yes', 'Via your carrier'],
  },
]

const coverageScore: Record<Coverage, number> = { yes: 1, partial: 0.5, no: 0 }

/** Coverage out of the row count; partial counts as half. */
export const coverage = (pick: (row: ComparisonRow) => Coverage | 'all') =>
  comparisonRows.reduce((sum, row) => {
    const value = pick(row)
    return sum + (value === 'all' ? 1 : coverageScore[value])
  }, 0)

/* ── How-it-works fragments ──────────────────────────────────────────────── */

export const sampleNumber = {
  number: '+1 (833) 555-0148',
  campaign: 'medicare-open-enrollment',
  chips: ['TX', 'FL', 'OH', '09:00–21:00', '500 / day'],
}

export const sampleRules = [
  ['Intent', '≥ 70'],
  ['State', 'TX · FL · OH'],
  ['Daypart', '09:00–21:00'],
  ['Concurrency', '≤ 25 per buyer'],
] as const

export const sampleConnectedCall = {
  buyer: 'Apex Insurance Group',
  duration: '04:12',
  qualification: 'Qualified · 60 s+',
  payout: 65,
}

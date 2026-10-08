export type SignalTone = 'success' | 'warning' | 'neutral'

export interface ScenarioSignal {
  label: string
  value: string
  tone: SignalTone
}

export interface ScenarioCandidate {
  name: string
  fit: string
  availability: string
  action: string
}

export interface Scenario {
  id: string
  label: string
  category: string
  summary: string
  signals: ScenarioSignal[]
  decision: string
  rationale: string
  route: string
  outcome: string
  scoreLabel: string
  score: string
  candidates: ScenarioCandidate[]
}

/** Illustrative call scenarios for the home-page walkthrough. */
export const scenarios: Scenario[] = [
  {
    id: 'high-intent',
    label: 'High-intent call',
    category: 'INTENT SCORING',
    summary: 'A sample inbound call shows strong intent and matches an active campaign.',
    signals: [
      { label: 'Intent score', value: '82 / 100', tone: 'success' },
      { label: 'Campaign state', value: 'Eligible', tone: 'success' },
      { label: 'Buyer capacity', value: 'Available', tone: 'neutral' },
    ],
    decision: 'Select an eligible buyer',
    rationale: 'The sample campaign matches the call intent and has buyer capacity available.',
    route: 'Buyer A · sample',
    outcome: 'Illustrative route selection',
    scoreLabel: 'Sample intent score',
    score: '82 / 100',
    candidates: [
      { name: 'Buyer A', fit: 'Intent match', availability: 'Eligible', action: 'Selected' },
      { name: 'Buyer B', fit: 'Intent match', availability: 'At capacity', action: 'Unavailable' },
      { name: 'Buyer C', fit: 'Below threshold', availability: 'Eligible', action: 'Not selected' },
    ],
  },
  {
    id: 'after-hours',
    label: 'After-hours call',
    category: 'CAMPAIGN SCHEDULE',
    summary:
      'A sample call arrives outside one buyer’s schedule but within another buyer’s campaign window.',
    signals: [
      { label: 'Call location', value: 'Texas', tone: 'neutral' },
      { label: 'Campaign schedule', value: 'Active', tone: 'success' },
      { label: 'Buyer A schedule', value: 'Closed', tone: 'warning' },
    ],
    decision: 'Check buyer schedules',
    rationale: 'The sample rules compare geography and schedule before routing to a buyer.',
    route: 'Buyer B · sample',
    outcome: 'Illustrative schedule match',
    scoreLabel: 'Eligible buyers',
    score: '01',
    candidates: [
      { name: 'Buyer A', fit: 'Texas', availability: 'Closed', action: 'Unavailable' },
      { name: 'Buyer B', fit: 'Texas', availability: 'Open', action: 'Selected' },
      { name: 'Buyer C', fit: 'Outside geo', availability: 'Open', action: 'Not eligible' },
    ],
  },
  {
    id: 'buyer-cap',
    label: 'Buyer at capacity',
    category: 'BUYER CAPS',
    summary: 'A sample campaign reaches one buyer’s cap while another eligible buyer has room.',
    signals: [
      { label: 'Buyer A daily cap', value: 'Reached', tone: 'warning' },
      { label: 'Buyer B concurrency', value: 'Available', tone: 'success' },
      { label: 'Campaign rules', value: 'Matched', tone: 'neutral' },
    ],
    decision: 'Respect buyer caps',
    rationale:
      'The sample campaign skips a buyer at its configured cap and considers the remaining eligible buyers.',
    route: 'Buyer B · sample',
    outcome: 'Illustrative capacity check',
    scoreLabel: 'Available buyers',
    score: '01',
    candidates: [
      { name: 'Buyer A', fit: 'Daily cap', availability: 'Reached', action: 'Unavailable' },
      { name: 'Buyer B', fit: 'Campaign match', availability: 'Available', action: 'Selected' },
      { name: 'Buyer C', fit: 'Campaign match', availability: 'At capacity', action: 'Unavailable' },
    ],
  },
]

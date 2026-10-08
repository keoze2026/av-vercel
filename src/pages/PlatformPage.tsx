import { useState } from 'react'
import { Waypoints } from 'lucide-react'
import { ConsoleSection } from '@/components/home/ConsoleSection'
import {
  CapabilitiesSection,
  ComparisonSection,
  DecisionModelSection,
  LandingClose,
  TransparencySection,
} from '@/components/home/LowerSections'
import { PowerSection } from '@/components/home/PowerSection'
import { SampleProof } from '@/components/home/SampleProof'
import { Walkthrough } from '@/components/home/Walkthrough'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { scenarios } from '@/data/scenarios'
import { usePageTitle } from '@/hooks/usePageTitle'
import { scrollToId } from '@/lib/motion'

const TITLE = 'How Avortyx works'
const SUBTITLE =
  'Follow a call from first ring to payout: the campaign rules, the routing decision, the console operators use, and how Avortyx compares.'

/** In-page jump links; the ids belong to the sections below. */
const jumps = [
  { label: 'How it works', id: 'decision-model' },
  { label: 'Sample call', id: 'interactive-walkthrough' },
  { label: 'Console', id: 'console' },
  { label: 'Why Avortyx', id: 'why-avortyx' },
  { label: 'Comparison', id: 'comparison' },
]

/** The detail behind the landing page: everything its "Know more" links point to. */
export default function PlatformPage() {
  // Shared by the walkthrough and the evidence section under it.
  const [scenario, setScenario] = useState(scenarios[0])
  usePageTitle(TITLE, SUBTITLE)

  return (
    <PageShell
      chat={{
        greeting:
          'This sample assistant is not connected to Avortyx support. For product or pricing questions, contact hello@avortyx.io.',
        placeholder: 'Ask about routing, pricing...',
        openLabel: 'Open Avortyx AI support chat',
        closeLabel: 'Close Avortyx AI support chat',
      }}
    >
      <PageHeader title={TITLE} subtitle={SUBTITLE} icon={Waypoints}>
        <nav aria-label="On this page" className="mt-2 flex flex-wrap gap-2">
          {jumps.map((j) => (
            <Button key={j.id} variant="outline" size="sm" onClick={() => scrollToId(j.id)}>
              {j.label}
            </Button>
          ))}
        </nav>
      </PageHeader>
      <DecisionModelSection />
      <Walkthrough scenario={scenario} onSelect={setScenario} />
      <SampleProof scenario={scenario} />
      <ConsoleSection />
      <PowerSection />
      <ComparisonSection />
      <CapabilitiesSection />
      <TransparencySection />
      <LandingClose />
    </PageShell>
  )
}

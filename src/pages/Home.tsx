import { useState } from 'react'
import { Mail } from 'lucide-react'
import { FaqList } from '@/components/FaqList'
import { Reveal } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { ConsoleSection } from '@/components/home/ConsoleSection'
import { HeroSection } from '@/components/home/HeroSection'
import {
  CapabilitiesSection,
  ComparisonSection,
  DecisionModelSection,
  LandingClose,
  PricingSection,
  TransparencySection,
} from '@/components/home/LowerSections'
import { PowerSection } from '@/components/home/PowerSection'
import { ProductsGrid } from '@/components/home/ProductsGrid'
import { SampleProof } from '@/components/home/SampleProof'
import { Walkthrough } from '@/components/home/Walkthrough'
import { WorkflowStrip } from '@/components/home/WorkflowStrip'
import { PageShell } from '@/components/layout/PageShell'
import { Eyebrow } from '@/components/SectionHeader'
import { homeFaqs } from '@/data/products'
import { scenarios } from '@/data/scenarios'
import { CONTACT_EMAIL } from '@/data/site'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Home() {
  // Shared by the walkthrough and the "sample proof" strip further down.
  const [scenario, setScenario] = useState(scenarios[0])
  usePageTitle()

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
      <HeroSection />
      <WorkflowStrip />
      <Walkthrough scenario={scenario} onSelect={setScenario} />
      <ProductsGrid />
      <PowerSection />
      <ConsoleSection />
      <SampleProof scenario={scenario} />
      <CapabilitiesSection />
      <DecisionModelSection />
      <ComparisonSection />
      <PricingSection />
      <Section id="faq">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <Reveal direction="left" className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-h2 font-semibold tracking-tight text-fg md:text-h1 md:tracking-heading">
              Frequently asked questions
            </h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-flex w-fit items-center gap-2 text-sm text-fg-2 hover:text-fg"
            >
              <Mail className="size-4 text-fg-3" aria-hidden="true" /> {CONTACT_EMAIL}
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqList items={homeFaqs} idPrefix="home-faq" />
          </Reveal>
        </div>
      </Section>
      <TransparencySection />
      <LandingClose />
    </PageShell>
  )
}

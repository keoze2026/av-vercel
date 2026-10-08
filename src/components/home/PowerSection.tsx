import { useState } from 'react'
import { Reveal } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { PowerVisual } from '@/components/home/PowerVisual'
import { SectionHeader } from '@/components/SectionHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { powerFeatures } from '@/data/products'

/** "Why Avortyx": hover, focus or select a feature to see it in the console. */
export function PowerSection() {
  const [selected, setSelected] = useState(powerFeatures[0].id)
  const current = powerFeatures.find((f) => f.id === selected) ?? powerFeatures[0]

  return (
    <Section>
      <SectionHeader
        label="Why Avortyx"
        title="Power your entire call business"
        desc="The essential controls to turn inbound calls into compliant, measurable buyer connections."
      />
      <Tabs
        value={selected}
        onValueChange={(v) => setSelected(v as typeof selected)}
        orientation="vertical"
        className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10"
      >
        <Reveal direction="left">
          {/* Phones: a 2 × 2 grid of features, with the selected description underneath. */}
          <TabsList
            aria-label="Avortyx capabilities"
            className="grid h-fit w-full grid-cols-2 items-stretch gap-2 rounded-none bg-transparent p-0 lg:flex lg:flex-col lg:gap-1"
          >
            {powerFeatures.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                onMouseEnter={() => setSelected(feature.id)}
                className="group/power h-auto flex-col items-start justify-start gap-2 rounded-lg border-line-subtle px-3.5 py-3 text-left whitespace-normal after:hidden data-active:border-line data-active:bg-surface sm:px-5 sm:py-4 dark:data-active:border-line dark:data-active:bg-surface max-lg:border-line-subtle"
              >
                <span className="flex w-full items-start gap-2.5 text-sm font-medium text-fg-2 group-data-active/power:text-fg sm:items-center sm:gap-3 sm:text-base">
                  <span className="mt-0.5 h-4 w-0.5 shrink-0 rounded-full bg-line-strong transition-colors group-data-active/power:bg-brand sm:mt-0" />
                  {feature.title}
                </span>
                <span className="hidden pl-3.5 text-sm font-normal text-fg-3 lg:group-data-active/power:block">
                  {feature.desc}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          <p key={current.id} className="mt-3 animate-in px-1 text-sm text-fg-3 duration-300 fade-in-0 lg:hidden">
            {current.desc}
          </p>
        </Reveal>
        <Reveal direction="right" delay={0.1} className="min-h-105">
          {powerFeatures.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="h-full animate-in duration-300 fade-in-0">
              <PowerVisual feature={feature} />
            </TabsContent>
          ))}
        </Reveal>
      </Tabs>
    </Section>
  )
}

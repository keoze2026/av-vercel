import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Gauge, ShieldCheck, Waypoints, type LucideIcon } from 'lucide-react'
import { BrowserFrame } from '@/components/brand/BrowserFrame'
import { Reveal } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { SampleTag } from '@/components/brand/StatusChip'
import { ConsoleLiveStream } from '@/components/home/ConsoleLiveStream'
import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { consoleModules, type ConsoleModuleId } from '@/data/products'

const modulePath: Record<ConsoleModuleId, string> = {
  routing: 'routing',
  fraud: 'compliance',
  analytics: 'payouts',
}

const moduleIcon: Record<ConsoleModuleId, LucideIcon> = {
  routing: Waypoints,
  fraud: ShieldCheck,
  analytics: Gauge,
}

export function ConsoleSection() {
  const navigate = useNavigate()
  const [active, setActive] = useState<ConsoleModuleId>(consoleModules[0].id)
  const module = consoleModules.find((m) => m.id === active) ?? consoleModules[0]

  return (
    <Section id="console">
      <SectionHeader
        align="center"
        label="Simulated Preview"
        title="Console"
        desc="Explore a simulated view of intent routing, compliance checks, and campaign outcomes. No live traffic is connected."
        actions={
          <Button variant="outline" size="lg" onClick={() => navigate('/company/contact?intent=demo')}>
            Request a guided demo <ArrowRight data-icon="inline-end" />
          </Button>
        }
      />

      <Reveal>
        <BrowserFrame path={`console / ${modulePath[module.id]}`} status={<SampleTag />}>
          <Tabs
            value={active}
            onValueChange={(v) => setActive(v as ConsoleModuleId)}
            orientation="vertical"
            className="grid grid-cols-1 gap-0 lg:grid-cols-[248px_minmax(0,1fr)]"
          >
            <div className="flex flex-col gap-3 border-b border-line-subtle bg-inset/50 p-3 lg:border-r lg:border-b-0">
              <p className="px-2 pt-1 font-mono text-label tracking-widest text-fg-3 uppercase">Modules</p>
              <TabsList
                aria-label="Console modules"
                className="grid h-fit w-full grid-cols-2 items-stretch gap-1 rounded-none bg-transparent p-0 lg:flex lg:flex-col"
              >
                {consoleModules.map((m) => {
                  const Icon = moduleIcon[m.id]
                  return (
                    <TabsTrigger
                      key={m.id}
                      value={m.id}
                      className="group/mod h-auto min-h-10 justify-start gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-normal whitespace-normal max-lg:odd:last:col-span-2 after:hidden data-active:border-line-strong data-active:bg-raised dark:data-active:border-line-strong dark:data-active:bg-raised"
                    >
                      <Icon className="text-fg-3 group-data-[state=active]/mod:text-brand" aria-hidden="true" />
                      {m.title}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>
            {consoleModules.map((m) => (
              <TabsContent key={m.id} value={m.id} className="flex min-w-0 flex-col">
                <div className="p-4 sm:p-6">
                  <ConsoleLiveStream module={m} />
                </div>
                <p className="border-t border-line-subtle bg-inset/50 px-4 py-4 text-sm text-fg-2 sm:px-6">
                  {m.desc}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </BrowserFrame>
      </Reveal>
    </Section>
  )
}

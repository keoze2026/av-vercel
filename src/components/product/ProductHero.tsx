import { Link } from 'react-router'
import { ArrowRight, Check } from 'lucide-react'
import { SceneBackdrop } from '@/3d'
import { BrowserFrame } from '@/components/brand/BrowserFrame'
import { Reveal, stagger } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { SampleTag } from '@/components/brand/StatusChip'
import { ProductFragment } from '@/components/home/ProductFragment'
import { Eyebrow, SectionHeader } from '@/components/SectionHeader'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import type { Product } from '@/data/products'

const slug = (s: string) => s.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Breadcrumb, title block, CTAs, a console fragment, then the key features. */
export function ProductHero({ product }: { product: Product }) {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-header">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
          <div className="absolute -top-60 right-[-10%] h-130 w-[min(900px,100vw)] rounded-full bg-brand-600/18 blur-[120px]" />
        </div>
        {/* The service at work, quietly, behind the console card. */}
        <SceneBackdrop
          scene={product.id}
          className="opacity-70 mask-[linear-gradient(to_bottom,transparent_18%,#000_55%,#000_85%,transparent)] lg:left-[46%] lg:mask-[linear-gradient(to_right,transparent,#000_30%,#000_90%,transparent)]"
          controlClassName="top-[calc(var(--header-height)+12px)] right-4 md:right-6"
        />
        <div className="chassis pt-10 pb-16 md:pt-14 md:pb-24">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/#explore-products">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
            <Reveal direction="left" className="flex flex-col items-start gap-6">
              <Eyebrow>Avortyx capability</Eyebrow>
              <h1 className="text-h1 font-semibold tracking-heading text-fg md:text-display md:tracking-display">
                {product.title}
              </h1>
              <p className="max-w-[56ch] text-base text-fg-2 md:text-lg">{product.desc}</p>
              <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button size="xl" asChild>
                  <Link to="/company/contact?intent=demo">
                    Request a guided demo <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link to="/#pricing">Compare plans</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.12}>
              <BrowserFrame path={`products / ${slug(product.title)}`} status={<SampleTag />} className="rounded-2xl bg-surface/70 backdrop-blur-md">
                <ProductFragment id={product.id} className="bg-dots p-6 sm:p-8" />
              </BrowserFrame>
            </Reveal>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader label="What's inside" title="Key Features" />
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle lg:grid-cols-3">
          {product.features.map((feature, i) => (
            <li key={feature} className="bg-canvas">
              <Reveal delay={stagger(i)} className="flex h-full flex-col items-start gap-3 p-4 sm:flex-row sm:gap-4 sm:p-6">
                <span className="grid size-8 shrink-0 place-items-center rounded-md border border-brand/35 bg-brand/10 text-brand-300">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm text-fg-2 sm:text-base">{feature}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

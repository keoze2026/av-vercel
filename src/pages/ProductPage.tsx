import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { FaqList } from '@/components/FaqList'
import { Reveal, stagger } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { PageShell } from '@/components/layout/PageShell'
import { ProductDashboard } from '@/components/product/ProductDashboard'
import { ProductHero } from '@/components/product/ProductHero'
import { Eyebrow, SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/ui/button'
import { products } from '@/data/products'
import { usePageTitle } from '@/hooks/usePageTitle'
import { scrollToTarget } from '@/lib/smooth-scroll'

const chat = {
  greeting:
    'This sample assistant is not connected to Avortyx support. For product questions, contact hello@avortyx.io.',
  placeholder: 'Ask about this module...',
  openLabel: 'Open AI assistant',
  closeLabel: 'Close AI assistant',
}

export default function ProductPage() {
  const { id } = useParams()
  const product = products.find((p) => p.id === id)
  usePageTitle(product?.title ?? 'Product Not Found', product?.desc)

  useEffect(() => {
    scrollToTarget(0, { immediate: true })
  }, [id])

  if (!product) {
    return (
      <PageShell chat={chat}>
        <Section rule={false} innerClassName="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-header text-center">
          <h1 className="text-h1 font-semibold tracking-heading text-fg">Product Not Found</h1>
          <Button variant="outline" asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </Section>
      </PageShell>
    )
  }

  const related = products.filter((p) => p.id !== product.id)

  return (
    <PageShell chat={chat}>
      <ProductHero product={product} />
      <ProductDashboard />

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <Reveal direction="left" className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-h2 font-semibold tracking-tight text-fg md:text-h1 md:tracking-heading">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqList items={product.faqs} idPrefix={`product-faq-${product.id}`} />
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeader
          label="Products"
          title="Run the full pay-per-call workflow"
          actions={
            <Button size="lg" asChild>
              <Link to="/company/contact?intent=demo">
                Request a guided demo <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        />
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle lg:grid-cols-5">
          {related.map((p, i) => (
            <li key={p.id} className="bg-canvas max-lg:odd:last:col-span-2">
              <Reveal delay={stagger(i, 5, 0.05)} className="h-full">
              <Link to={`/product/${p.id}`} className="group flex h-full flex-col gap-4 p-5 hover:bg-surface">
                <span className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-md border border-line bg-raised text-fg-2 group-hover:border-brand/40 group-hover:text-brand-300 [&_svg]:size-4">
                    <p.icon aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-4 text-fg-4 group-hover:text-brand" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-fg">{p.title}</span>
              </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  )
}

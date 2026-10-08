import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { ProductFragment } from '@/components/home/ProductFragment'
import { Reveal, stagger } from '@/components/brand/Reveal'
import { Section } from '@/components/brand/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { products, type ProductId } from '@/data/products'

/** Starting values for the illustrative per-product counters. */
const demoBaseCounts: Record<ProductId, number> = {
  tracking: 126,
  ivr: 8,
  ringtree: 42,
  pingpost: 18,
  whitelabel: 7,
  fraud: 39,
}

const demoLabels: Record<ProductId, string> = {
  tracking: 'Sample numbers',
  ivr: 'Sample rules',
  ringtree: 'Calls scored',
  pingpost: 'Sample buyers',
  whitelabel: 'Calls monitored',
  fraud: 'Calls screened',
}

/**
 * Synthetic activity counter. Moves by ±2 every 2.4 s, but only while on
 * screen, the tab is visible and reduced motion is off.
 */
export function ProductDemoStat({ productId }: { productId: ProductId }) {
  const [count, setCount] = useState(() => demoBaseCounts[productId] ?? 100)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let value = demoBaseCounts[productId] ?? 100
    const node = ref.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let timer: number | null = null

    const sync = () => {
      if (timer) window.clearInterval(timer)
      timer = null
      if (!visible || document.hidden || reduced.matches) return
      timer = window.setInterval(() => {
        value = Math.max(0, value + Math.floor(Math.random() * 5) - 2)
        setCount(value)
      }, 2400)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { rootMargin: '80px' },
    )
    if (node) observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)

    return () => {
      if (timer) window.clearInterval(timer)
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
    }
  }, [productId])

  const label = demoLabels[productId] ?? 'Activity'

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 border-t border-line-subtle pt-4"
      aria-label={`Illustrative ${label.toLowerCase()}: ${count.toLocaleString()}`}
    >
      <span className="inline-flex h-5 items-center rounded-xs border border-line bg-raised px-1.5 font-mono text-label tracking-label text-fg-3 uppercase">
        Demo
      </span>
      <span className="truncate text-caption text-fg-3">{label}</span>
      <span className="ml-auto font-mono text-caption font-medium text-fg tabular-nums">
        {count.toLocaleString()}
      </span>
    </div>
  )
}

/** Home "Products" section: one tile per product, each with a console fragment. */
export function ProductsGrid() {
  return (
    <Section id="explore-products">
      <SectionHeader
        label="Products"
        title="Run the full pay-per-call workflow"
        desc="Manage numbers, campaign rules, buyer selection, compliance screening, call monitoring, reporting, and payouts."
      />
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line-subtle sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <li key={p.id} className="bg-canvas">
            <Reveal delay={stagger(i)} className="h-full">
            <Link
              to={`/product/${p.id}`}
              className="group flex h-full flex-col gap-6 p-5 transition-colors duration-200 hover:bg-surface focus-visible:-outline-offset-2 sm:p-6"
            >
              <ProductFragment
                id={p.id}
                className="h-53 overflow-hidden rounded-lg border border-line-subtle bg-inset/70 bg-dots p-4 transition-colors duration-200 group-hover:border-line"
              />
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="flex items-start justify-between gap-3 text-h3 font-semibold tracking-tight text-fg">
                  {p.title}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-fg-4 transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                  />
                </h3>
                <p className="text-sm text-fg-3">{p.desc}</p>
              </div>
              <ProductDemoStat productId={p.id} />
            </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

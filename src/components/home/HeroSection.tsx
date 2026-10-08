import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { SceneBackdrop } from '@/3d'
import { RoutingEngine } from '@/components/home/RoutingEngine'
import { Button } from '@/components/ui/button'
import { scrollToId, useNavigateTo } from '@/lib/motion'

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const proofs = [
  { value: 'First-ring intent scoring', label: 'Score calls while they are ringing' },
  { value: 'Compliance before connection', label: 'Screen calls before they reach a buyer' },
] as const

export function HeroSection() {
  const navigateTo = useNavigateTo()
  return (
    <section className="relative isolate overflow-hidden pt-header">
      {/* One glow per view, and calls streaming in from the distance toward the engine. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-72 left-1/2 h-160 w-[min(1100px,120vw)] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />
      </div>
      <SceneBackdrop
        scene="ambient"
        className="bottom-auto h-175 opacity-75 mask-[linear-gradient(to_bottom,transparent_22%,#000_48%,#000_80%,transparent)] md:h-205"
        controlClassName="top-[calc(var(--header-height)+12px)] right-4 md:right-6"
      />

      <motion.div
        className="chassis flex flex-col items-center pt-16 pb-12 text-center md:pt-24 md:pb-16"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.h1
          variants={item}
          className="max-w-[14ch] bg-linear-to-b from-fg from-45% to-fg-2 bg-clip-text pb-1 font-heading text-h1 font-semibold tracking-display text-transparent sm:text-display md:text-display-xl"
        >
          Route better calls to the right buyers.
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-[56ch] text-base text-fg-2 md:text-lg">
          Evaluate each incoming call in real time, connect it with the right available buyer, and
          oversee compliance, call activity, and payments from one place.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Button size="xl" onClick={() => navigateTo('/platform#interactive-walkthrough')}>
            Explore a sample call <ArrowRight data-icon="inline-end" />
          </Button>
          <Button size="xl" variant="outline" onClick={() => scrollToId('explore-products')}>
            Browse the platform
          </Button>
        </motion.div>

        <motion.ul
          variants={item}
          className="mt-7 flex flex-col items-start gap-x-8 gap-y-2 text-left text-sm sm:flex-row sm:items-center"
        >
          {proofs.map((proof) => (
            <li key={proof.value} className="flex items-start gap-2 text-fg-3">
              <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
              <span>
                <span className="font-medium text-fg-2">{proof.value}</span> · {proof.label}
              </span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div
        className="chassis pb-16 md:pb-24"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <RoutingEngine />
      </motion.div>
    </section>
  )
}

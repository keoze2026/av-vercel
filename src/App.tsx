import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { AiTerminal } from '@/components/AiTerminal'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { scrollToTarget, startSmoothScroll } from '@/lib/smooth-scroll'
import type { GenericPageType } from '@/pages/GenericPage'

const Home = lazy(() => import('@/pages/Home'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const GenericPage = lazy(() => import('@/pages/GenericPage'))

const genericRoutes: [string, GenericPageType][] = [
  ['/resources/blogs', 'blogs'],
  ['/resources/integrations', 'integrations'],
  ['/resources/case-studies', 'case-studies'],
  ['/company/about', 'about'],
  ['/company/careers', 'careers'],
  ['/company/contact', 'contact'],
  ['/enterprise-specs', 'enterprise-specs'],
]

function PageFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Scrolls to the URL hash target after navigation, or jumps to the top otherwise. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    startSmoothScroll()
  }, [])
  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        const el = document.getElementById(hash.replace('#', ''))
        if (el) scrollToTarget(el)
      }, 100)
      return () => window.clearTimeout(timer)
    }
    scrollToTarget(0, { immediate: true })
  }, [pathname, hash])
  return null
}

export function App() {
  const location = useLocation()
  const reducedMotion = useReducedMotion()

  return (
    <TooltipProvider delayDuration={200}>
      <div id="top">
        <ScrollManager />
        <a
          href="#main-content"
          className="fixed top-3 left-3 z-100 translate-y-[-200%] rounded-md border border-brand/40 bg-raised px-4 py-2.5 text-sm text-fg shadow-e2 focus:translate-y-0"
        >
          Skip to main content
        </a>
        <AiTerminal />
        <div className="noise-overlay" aria-hidden="true" />
        <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
          <AnimatePresence mode="wait">
            <Suspense fallback={null}>
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PageFade>
                      <Home />
                    </PageFade>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <PageFade>
                      <ProductPage />
                    </PageFade>
                  }
                />
                {genericRoutes.map(([path, type]) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <PageFade>
                        <GenericPage type={type} />
                      </PageFade>
                    }
                  />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </MotionConfig>
        <Toaster position="bottom-center" />
      </div>
    </TooltipProvider>
  )
}

import { useLocation, useNavigate } from 'react-router'
import { scrollToTarget } from '@/lib/smooth-scroll'

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth')

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) scrollToTarget(el)
}

/** Scrolls to the top of the page with the same glide as the wheel. */
export const scrollToTop = () => scrollToTarget(0)

/** Scrolls to a home-page section, navigating home first when needed. */
export function useGoToSection() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (id: string) => {
    if (pathname === '/') scrollToId(id)
    else navigate(`/#${id}`)
  }
}

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

/**
 * Goes to `path#section`: scrolls when that page is already open,
 * navigates otherwise (the ScrollManager then scrolls to the hash).
 */
export function useNavigateTo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (to: string) => {
    const [path, hash] = to.split('#')
    if ((path || '/') === pathname) {
      if (hash) scrollToId(hash)
      else scrollToTop()
    } else navigate(to)
  }
}

/** Scrolls to a home-page section, navigating home first when needed. */
export function useGoToSection() {
  const go = useNavigateTo()
  return (id: string) => go(`/#${id}`)
}

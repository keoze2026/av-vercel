import { useEffect } from 'react'

const SITE_TITLE = 'Avortyx — Pay-Per-Call Call Intelligence'
const SITE_DESCRIPTION =
  'Avortyx helps pay-per-call teams score inbound calls, route them to eligible buyers, manage compliance, monitor calls, and track payouts.'

/** Per-route document title and meta description. */
export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Avortyx` : SITE_TITLE
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description ?? SITE_DESCRIPTION)
  }, [title, description])
}

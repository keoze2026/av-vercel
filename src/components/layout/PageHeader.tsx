import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { LucideIcon } from 'lucide-react'
import { CircuitNode } from '@/components/brand/CircuitNode'
import { Reveal } from '@/components/brand/Reveal'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface PageHeaderProps {
  /** Middle breadcrumb (e.g. "Resources"); omitted for top-level pages. */
  section?: string
  title: string
  subtitle: string
  icon: LucideIcon
  /** Rendered under the subtitle, e.g. in-page jump links. */
  children?: ReactNode
}

/** Breadcrumb, icon, title and subtitle at the top of an inner page. */
export function PageHeader({ section, title, subtitle, icon, children }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden pt-header">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-64 left-1/2 h-120 w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-brand-600/16 blur-[120px]" />
      </div>
      <div className="chassis pt-10 pb-14 md:pt-14 md:pb-20">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {section && (
              <>
                <BreadcrumbItem className="text-fg-3">{section}</BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Reveal className="mt-10 flex flex-col items-start gap-6">
          <CircuitNode icon={icon} active />
          <h1 className="max-w-[20ch] text-h1 font-semibold tracking-heading text-fg md:text-display md:tracking-display">
            {title}
          </h1>
          <p className="max-w-[60ch] text-base text-fg-2 md:text-lg">{subtitle}</p>
          {children}
        </Reveal>
      </div>
    </section>
  )
}

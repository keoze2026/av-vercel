import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq } from '@/data/products'
import { cn } from '@/lib/utils'

interface FaqListProps {
  items: Faq[]
  /** Prefix for the item values (stable keys per page). */
  idPrefix: string
  className?: string
}

export function FaqList({ items, idPrefix, className }: FaqListProps) {
  return (
    <Accordion type="single" collapsible className={cn('border-t border-line', className)}>
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`${idPrefix}-${i}`} className="border-b border-line not-last:border-b">
          <AccordionTrigger className="gap-6 rounded-none py-5 text-base font-medium text-fg hover:no-underline focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 **:data-[slot=accordion-trigger-icon]:text-fg-3">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="max-w-[68ch] pb-5 text-sm text-fg-2">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

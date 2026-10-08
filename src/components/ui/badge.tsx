import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Chips are full-radius; tags (`variant="tag"`) are 4px mono labels.
 * Tints follow the system recipe: 12% fill, 35% border.
 */
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden border whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "h-6 rounded-full border-brand/35 bg-brand/12 px-2.5 text-label font-medium text-brand-300",
        secondary:
          "h-6 rounded-full border-line bg-raised px-2.5 text-label font-medium text-fg-2",
        outline:
          "h-6 rounded-full border-line-strong px-2.5 text-label font-medium text-fg-2 [a]:hover:bg-raised",
        destructive:
          "h-6 rounded-full border-crit/35 bg-crit/12 px-2.5 text-label font-medium text-crit",
        tag: "h-5 rounded-xs border-line bg-raised px-1.5 font-mono text-label font-medium tracking-label text-fg-2 uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

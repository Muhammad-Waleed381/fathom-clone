import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950",
  {
    variants: {
      variant: {
        default:
          "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
        secondary:
          "border-zinc-200 bg-zinc-100 text-zinc-800 hover:bg-zinc-200/80",
        destructive:
          "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        outline: "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
        mint: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80",
        orange: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100/80",
        sky: "border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

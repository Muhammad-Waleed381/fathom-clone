import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border-2 border-black px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#FEF08A] text-black hover:bg-[#FEF08A]/90",
        secondary:
          "bg-[#DDD6FE] text-black hover:bg-[#DDD6FE]/90",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline: "bg-white text-black hover:bg-zinc-50",
        mint: "bg-[#A7F3D0] text-black hover:bg-[#A7F3D0]/90",
        orange: "bg-[#FED7AA] text-black hover:bg-[#FED7AA]/90",
        sky: "bg-[#BAE6FD] text-black hover:bg-[#BAE6FD]/90",
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

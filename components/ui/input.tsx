import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-base text-black placeholder:text-zinc-400 shadow-[3px_3px_0px_0px_#000] font-medium transition-all focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_#000] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

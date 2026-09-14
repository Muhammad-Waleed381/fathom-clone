"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  motion,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const springButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#FEF08A] text-black border-2 border-black",
        destructive: "bg-red-500/100 text-white border-2 border-black",
        outline: "bg-white text-black border-2 border-black hover:bg-white/5",
        secondary: "bg-[#DDD6FE] text-black border-2 border-black",
        mint: "bg-[#A7F3D0] text-black border-2 border-black",
        orange: "bg-[#FED7AA] text-black border-2 border-black",
        sky: "bg-[#BAE6FD] text-black border-2 border-black",
        ghost: "hover:bg-black/5 hover:text-black border-2 border-transparent",
        link: "text-black underline-offset-4 hover:underline border-0 p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
      shadowDepth: {
        default: "",
        sm: "",
        lg: "",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shadowDepth: "default",
    },
  }
)

const MotionSlot = motion.create(Slot)

export interface SpringButtonProps
  extends Omit<HTMLMotionProps<"button">, "variant" | "size">,
    VariantProps<typeof springButtonVariants> {
  asChild?: boolean
  stiffness?: number
  damping?: number
  mass?: number
}

/**
 * SpringButton
 * 
 * Reusable motion button wrapper engineered with physical tactile button mechanics:
 * - Resting: crisp geometric neobrutalist border & hard drop shadow
 * - Hover: lifts slightly `translate-x-[-1px] translate-y-[-1px]` with increased hard shadow
 * - Tap/Click: sinks into shadow `translate-x-[2px] translate-y-[2px]` with high-tension spring physics
 */
export const SpringButton = React.forwardRef<HTMLButtonElement, SpringButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      shadowDepth = "default",
      asChild = false,
      stiffness = 500,
      damping = 18,
      mass = 0.6,
      whileHover,
      whileTap,
      transition,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const isGhostOrLink = variant === "ghost" || variant === "link"
    const isNoShadow = shadowDepth === "none" || isGhostOrLink

    // Calculate physical resting, hover, and tap styles
    let restingBoxShadow = "3px 3px 0px 0px #000000"
    let hoverBoxShadow = "5px 5px 0px 0px #000000"
    let tapBoxShadow = "1px 1px 0px 0px #000000"
    let hoverX = -1
    let hoverY = -1
    let tapX = 2
    let tapY = 2

    if (shadowDepth === "sm") {
      restingBoxShadow = "2px 2px 0px 0px #000000"
      hoverBoxShadow = "3px 3px 0px 0px #000000"
      tapBoxShadow = "0px 0px 0px 0px #000000"
      hoverX = -1
      hoverY = -1
      tapX = 1
      tapY = 1
    } else if (shadowDepth === "lg") {
      restingBoxShadow = "5px 5px 0px 0px #000000"
      hoverBoxShadow = "7px 7px 0px 0px #000000"
      tapBoxShadow = "2px 2px 0px 0px #000000"
      hoverX = -1
      hoverY = -1
      tapX = 3
      tapY = 3
    }

    const computedHover: TargetAndTransition = isNoShadow
      ? { scale: 1.02, ...((whileHover as TargetAndTransition) || {}) }
      : {
          x: hoverX,
          y: hoverY,
          boxShadow: hoverBoxShadow,
          ...((whileHover as TargetAndTransition) || {}),
        }

    const computedTap: TargetAndTransition = isNoShadow
      ? { scale: 0.98, ...((whileTap as TargetAndTransition) || {}) }
      : {
          x: tapX,
          y: tapY,
          boxShadow: tapBoxShadow,
          ...((whileTap as TargetAndTransition) || {}),
        }

    const springTransition: Transition = {
      type: "spring",
      stiffness,
      damping,
      mass,
      ...(transition || {}),
    }

    const Comp = asChild ? MotionSlot : motion.button

    return (
      <Comp
        ref={ref}
        disabled={disabled}
        initial={false}
        whileHover={disabled ? undefined : computedHover}
        whileTap={disabled ? undefined : computedTap}
        transition={springTransition}
        style={{
          boxShadow: isNoShadow ? undefined : restingBoxShadow,
          ...style,
        }}
        className={cn(springButtonVariants({ variant, size, shadowDepth, className }))}
        {...props}
      />
    )
  }
)

SpringButton.displayName = "SpringButton"

export { springButtonVariants }

"use client"

import * as React from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type HTMLMotionProps,
  type SpringOptions,
} from "framer-motion"
import gsap from "gsap"
import { cn } from "@/lib/utils"

export interface TiltCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
  className?: string
  maxTilt?: number
  glare?: boolean
  glareMaxOpacity?: number
  perspective?: number
  springConfig?: SpringOptions
}

/**
 * TiltCard
 * 
 * Reusable 3D cursor-reactive perspective tilt card engine.
 * Measures bounding rect on mouse move, computes smooth pitch/roll angles (rotateX, rotateY)
 * with dampening/spring physics, maintains `transformStyle: "preserve-3d"` so child elements
 * with `translateZ(...)` or `[transform:translateZ(...)]` float in true 3D space with parallax,
 * and renders a specular glare sheen overlay that tracks the cursor highlight.
 */
export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      children,
      className,
      maxTilt = 6,
      glare = true,
      glareMaxOpacity = 0.35,
      perspective = 1000,
      springConfig = { damping: 25, stiffness: 220, mass: 0.5 },
      onMouseMove,
      onMouseLeave,
      onMouseEnter,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null)
    const shouldReduceMotion = useReducedMotion()

    // Motion values for tilt angles (-1 to +1 from center)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Motion values for glare position (0% to 100%)
    const glareX = useMotionValue(50)
    const glareY = useMotionValue(50)

    // Hover state for smooth glare opacity fade
    const isHovered = useMotionValue(0)

    // Spring physics
    const springX = useSpring(x, springConfig)
    const springY = useSpring(y, springConfig)
    const springGlareX = useSpring(glareX, springConfig)
    const springGlareY = useSpring(glareY, springConfig)
    const springHover = useSpring(isHovered, { damping: 20, stiffness: 200 })

    // Compute pitch/roll rotation transforms:
    // rotateX: y * -maxTilt (pushes top back when mouse is at top)
    // rotateY: x * maxTilt (tilts right when mouse is on right)
    const rotateX = useTransform(springY, (val) => val * -maxTilt)
    const rotateY = useTransform(springX, (val) => val * maxTilt)

    // Specular glare sheen overlay
    const glareOpacity = useTransform(springHover, [0, 1], [0, glareMaxOpacity])
    const glareBackground = useMotionTemplate`radial-gradient(circle 360px at ${springGlareX}% ${springGlareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 40%, transparent 80%)`

    // Compose ref
    React.useImperativeHandle(forwardedRef, () => cardRef.current!)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || shouldReduceMotion) return

      const rect = cardRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top

      // Normalized coordinates (-1 to +1)
      const normX = Math.max(-1, Math.min(1, (clientX / rect.width) * 2 - 1))
      const normY = Math.max(-1, Math.min(1, (clientY / rect.height) * 2 - 1))

      x.set(normX)
      y.set(normY)

      // Cursor position in percentage for glare sheen
      const pctX = (clientX / rect.width) * 100
      const pctY = (clientY / rect.height) * 100
      glareX.set(pctX)
      glareY.set(pctY)
      isHovered.set(1)

      onMouseMove?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!shouldReduceMotion) {
        isHovered.set(1)
      }
      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      // Smooth reset back to 0 with spring physics
      x.set(0)
      y.set(0)
      isHovered.set(0)
      onMouseLeave?.(e)
    }

    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transformPerspective: perspective,
          perspective: `${perspective}px`,
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          ...style,
        }}
        className={cn(
          "relative [transform-style:preserve-3d]",
          className
        )}
        {...props}
      >
        {children}

        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] overflow-hidden select-none"
            style={{
              opacity: shouldReduceMotion ? 0 : glareOpacity,
              background: glareBackground,
            }}
          />
        )}
      </motion.div>
    )
  }
)

TiltCard.displayName = "TiltCard"

/**
 * TiltLayer
 * 
 * Helper component for 3D parallax depth layers inside `TiltCard`.
 * Automatically sets `transform: translateZ(...)` and preserves 3D rendering context.
 */
export interface TiltLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  z?: number
  children?: React.ReactNode
  className?: string
}

export function TiltLayer({
  z = 20,
  children,
  className,
  style,
  ...props
}: TiltLayerProps) {
  return (
    <div
      style={{
        transform: `translateZ(${z}px)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={cn("[transform-style:preserve-3d]", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * initGsapTilt
 * 
 * Imperative GSAP 3D tilt engine for vanilla or custom canvas/SVG integrations.
 */
export function initGsapTilt(
  element: HTMLElement,
  options?: {
    maxTilt?: number
    perspective?: number
    duration?: number
    ease?: string
  }
) {
  const maxTilt = options?.maxTilt ?? 6
  const perspective = options?.perspective ?? 1000
  const duration = options?.duration ?? 0.5
  const ease = options?.ease ?? "power2.out"

  gsap.set(element, {
    transformPerspective: perspective,
    transformStyle: "preserve-3d",
  })

  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1

    gsap.to(element, {
      rotateX: y * -maxTilt,
      rotateY: x * maxTilt,
      duration,
      ease,
      overwrite: "auto",
    })
  }

  const onMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: duration * 1.5,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    })
  }

  element.addEventListener("mousemove", onMouseMove)
  element.addEventListener("mouseleave", onMouseLeave)

  return () => {
    element.removeEventListener("mousemove", onMouseMove)
    element.removeEventListener("mouseleave", onMouseLeave)
  }
}

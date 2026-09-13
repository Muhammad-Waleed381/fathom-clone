# Fathom Rebuild: Neobrutalist + Minimalist UI Redesign Spec

**Date:** 2026-09-13  
**Status:** Approved  
**Aesthetic:** Classic Clean Neobrutalism + High-Density Minimalism  
**Motion Stack:** Framer Motion + GSAP (Purposeful 3D Perspective Tilt & Tactile Spring Physics)

---

## 1. Problem & Objectives

### 1.1 The Problem
The initial dark-mode UI was perceived as generic and sloppy, marred by excessive AI explanation text ("AI slop") and standard diffused dark gradients. 

### 1.2 Objectives
1. **Neobrutalist Visual Identity**: Replace dark slate surfaces with a clean architectural warm off-white canvas (`#FAF8F5`), solid black ink borders (`border-2 border-black`), and flat offset hard shadows (`shadow-[4px_4px_0px_0px_#000]`).
2. **Minimalist Text Density**: Drastically reduce verbose descriptive paragraphs and redundant AI explanations. Let high-contrast typography, compact badges, and tactile UI controls lead the user experience.
3. **Intentional 3D Perspective Tilt (Framer Motion & GSAP)**: Implement interactive 3D cursor-reactive perspective tilt on the Benchmark Hero Card and Meeting Cards, plus a 3D spatial stage for the meeting player video canvas.
4. **Guaranteed Reading Stability**: Keep text reading zones (transcripts, summary notes, action items tables) completely flat and solid to avoid motion sickness or interaction friction.
5. **Full shadcn Component Alignment**: Ensure all UI primitives in `components/ui/*` adopt the neobrutalist class variances (solid ink borders, flat offset shadows, tactile active press states).

---

## 2. Design System & Neobrutalist Tokens

### 2.1 Surfaces & Color Palette
- **Canvas Base**: `#FAF8F5` (warm crisp architectural cream-white).
- **Cards & Surfaces**: `#FFFFFF` with `border-2 border-black` (or `border-[2.5px] border-black`).
- **Hard Offset Drop Shadows**:
  - Small / Badges: `shadow-[2px_2px_0px_0px_#000]`
  - Standard Cards / Buttons: `shadow-[4px_4px_0px_0px_#000]`
  - Hero Benchmark Card: `shadow-[6px_6px_0px_0px_#000]`
- **Tactile Active Depression**:
  - Hover: `hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000]`
  - Active Press: `active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_0px_#000]`
- **Punchy Accents**:
  - **Electric Yellow (`#FEF08A` / `#FACC15`)**: Primary CTAs, active word highlighting, benchmark badge.
  - **Cyber Lavender (`#DDD6FE` / `#8B5CF6`)**: "Ask Fathom" AI drawer, AI metadata badges.
  - **Mint Neo (`#A7F3D0` / `#10B981`)**: Completed tasks, bot active status pill.
  - **Signal Coral (`#FED7AA` / `#F97316`)**: High-priority action items, risk tags.
  - **Ice Blue (`#BAE6FD` / `#0284C7`)**: Engineering sync tags, calendar integration.

### 2.2 Typography & Low-Text Minimalism
- **Headings**: `font-black tracking-tight text-black` with punchy, editorial phrasing.
- **Metadata Badges**: Monospace bold (`font-mono text-xs uppercase font-bold`).
- **Eliminate AI Slop**: Remove long descriptive subheads, marketing filler, and verbose intros. Focus directly on interactive controls and data.

---

## 3. Interactive 3D Motion System

### 3.1 3D Cursor-Reactive Tilt Cards (GSAP / Framer Motion)
- Applied to the **Hero Benchmark Card** and **Dashboard Meeting Cards**.
- Uses `perspective: 1000px`, `transform-style: preserve-3d`.
- Smoothly computes mouse coordinates relative to the card center; pitches and rolls the card (`rotateX`, `rotateY` clamped between -6° and +6°).
- Floating inner elements (Play button, participant avatars, duration badge) elevated with `translateZ(18px)` for true physical parallax depth.
- Subtle specular glare sheen overlay tracks mouse position.

### 3.2 3D Spatial Participant Video Canvas
- Applied to the active meeting player video/speaker canvas (`components/player/video-player.tsx`).
- Speaker tiles placed in a subtle 3D spatial perspective grid.
- Active speaker tile translates along the Z-axis (`translateZ(16px)`) with a bold electric yellow border, while inactive speakers remain on the base plane.

### 3.3 Tactile Spring Physics
- Button presses use mechanical spring physics (`stiffness: 450, damping: 25`).
- Dialogs and modals spring in with a crisp pop and solid border.
- Animated tab slider pill glides under active template tabs.

---

## 4. Components & Views to Overhaul

1. **`components/ui/*`**: Update `button`, `card`, `badge`, `dialog`, `tabs`, `slider`, `checkbox`, `input`, `dropdown-menu` with neobrutalist class variances.
2. **`components/dashboard/*` & `app/page.tsx`**:
   - Redesign Header with bold logotype, tactile search trigger, and minimal text.
   - Redesign Calendar strip into an editorial desk agenda.
   - Rebuild Benchmark Hero Call into the interactive 3D Tilt Card.
   - Redesign Meeting Cards grid with 3D hover lift and hard shadows.
   - Re-style `Cmd+K` omnibar with crisp monochrome minimalism.
3. **`components/player/*` & `components/transcript/*` & `components/notes/*` & `app/meetings/[id]/page.tsx`**:
   - Rebuild Video Player with 3D spatial conference canvas and physical scrubber track.
   - Multi-speaker presence bar with vibrant color-blocked meters.
   - Minimalist editorial transcript viewer with high-contrast yellow word highlighting and click-to-seek.
   - Dynamic template switcher with sliding spring pill and clickable `[MM:SS]` badges.
   - "Ask Fathom" AI drawer with cyber lavender accents.
4. **`components/actions/*` & `app/actions/page.tsx`**:
   - High-contrast KPI cards with hard shadows.
   - Tactile checkbox table with deep seek links and confetti bursts.
5. **`components/record/*` & `app/share/[id]/page.tsx`**:
   - Retro-modern audio production workstation modal with 24 frequency bars and simulation mode.
   - Public guest viewer with bounded clip player and zero-barrier viewing.

---

## 5. Verification & Acceptance Criteria
1. `npm install framer-motion gsap` succeeds.
2. All views display the classic clean neobrutalist aesthetic with warm canvas, solid black borders, and hard offset shadows.
3. 3D cursor-reactive tilt is active on the Benchmark Hero Call and meeting cards.
4. All text is concise, high-density, and free of AI marketing fluff.
5. `npx tsc --noEmit` and `npm run build` pass with 0 errors.

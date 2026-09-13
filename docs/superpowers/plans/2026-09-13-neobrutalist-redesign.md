# Neobrutalist + Minimalist UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely overhaul the application UI into an ultra-clean, tactile Neobrutalist + Minimalist theme with purposeful Framer Motion & GSAP 3D interactive physics and low-text editorial efficiency.

**Architecture:** Next.js 14 App Router, Tailwind CSS with neobrutalist tokens (ink borders, flat offset hard shadows, warm off-white canvas, pastel punchy accents), shadcn/ui primitives via MCP, and Framer Motion + GSAP for 3D cursor-reactive perspective tilt and tactile mechanical spring clicks.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, GSAP, Zustand.

**Spec:** `docs/superpowers/specs/2026-09-13-neobrutalist-redesign.md`

## Global Constraints
- Target directory: `/home/waleed/Desktop/fathom-clone`
- MANDATORY UI THEME: Classic Clean Neobrutalism + Minimalism. Warm canvas (`#FAF8F5`), solid black borders (`border-2 border-black`), hard offset drop shadows (`shadow-[4px_4px_0px_0px_#000]`), tactile active depression.
- LOW TEXT / ZERO AI SLOP: Cut down verbose explanations and marketing fluff. Emphasize dense, legible, editorial controls and data.
- 3D MOTION RESTRICTION: Use Framer Motion & GSAP 3D perspective tilt only where it fits (Benchmark Hero card, Meeting cards, Video player spatial stage). Keep reading surfaces (transcripts, summary text, action tables) 100% flat and stable.
- SHADCN PRIMITIVES: Re-style official shadcn primitives in `components/ui/*` to strictly adhere to the neobrutalist tokens.
- Maintain full compatibility with existing Zustand state store, Deepgram/OpenRouter APIs, and public share links.
- Every task must compile cleanly (`npm run build` or `npx tsc --noEmit`) and be committed to git.

---

### Task 1: Motion Dependencies & shadcn Neobrutalist Primitives Overhaul

**Files:**
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `components/ui/button.tsx`
- Modify: `components/ui/card.tsx`
- Modify: `components/ui/badge.tsx`
- Modify: `components/ui/dialog.tsx`
- Modify: `components/ui/tabs.tsx`
- Modify: `components/ui/slider.tsx`
- Modify: `components/ui/checkbox.tsx`
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/dropdown-menu.tsx`
- Modify: `components/ui/command.tsx`
- Modify: `components/ui/scroll-area.tsx`

- [ ] **Step 1: Install `framer-motion`, `gsap`, and `@types/gsap`**
- [ ] **Step 2: Update `tailwind.config.ts` and `app/globals.css` with neobrutalist colors, borders, and hard shadow utilities**
- [ ] **Step 3: Update `components/ui/*` primitives with neobrutalist styling**
- [ ] **Step 4: Verify TypeScript compilation with `npx tsc --noEmit`**
- [ ] **Step 5: Commit changes**
  `git add package.json package-lock.json app/globals.css tailwind.config.ts components/ui/ && git commit -m "feat(ui): install framer-motion/gsap and re-style shadcn primitives with neobrutalism"`

---

### Task 2: Reusable 3D Cursor-Reactive Tilt Card Engine

**Files:**
- Create: `components/motion/tilt-card.tsx`
- Create: `components/motion/spring-button.tsx`

- [ ] **Step 1: Implement `TiltCard` with GSAP / Framer Motion perspective math, smooth damping, specular glare reflection, and `translateZ` parallax layer support**
- [ ] **Step 2: Implement `SpringButton` with tactile mechanical press-down physics**
- [ ] **Step 3: Verify TypeScript compilation with `npx tsc --noEmit`**
- [ ] **Step 4: Commit changes**
  `git add components/motion/ && git commit -m "feat(motion): implement 3D cursor-reactive tilt card and spring physics"`

---

### Task 3: Dashboard Workspace & Global Search Redesign (Low-Text + 3D Tilt Hero)

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/dashboard/dashboard-header.tsx`
- Modify: `components/dashboard/calendar-strip.tsx`
- Modify: `components/dashboard/meeting-card.tsx`
- Modify: `components/dashboard/command-search.tsx`

- [ ] **Step 1: Overhaul `dashboard-header.tsx` with bold geometric branding, minimal copy, and tactile pills**
- [ ] **Step 2: Overhaul `calendar-strip.tsx` into an editorial desk agenda with high contrast**
- [ ] **Step 3: Rebuild `app/page.tsx` with the 3D Cursor-Reactive Benchmark Hero Card (electric yellow accent, floating metadata, zero AI slop)**
- [ ] **Step 4: Overhaul `meeting-card.tsx` with 3D tilt hover, avatar stacks with black borders, and quick actions**
- [ ] **Step 5: Re-style `command-search.tsx` (`Cmd+K`) with crisp neobrutalist palette**
- [ ] **Step 6: Verify TypeScript and build with `npm run build`**
- [ ] **Step 7: Commit changes**
  `git add app/page.tsx components/dashboard/ && git commit -m "feat(dashboard): redesign dashboard with low text, neobrutalism and 3D tilt hero"`

---

### Task 4: Meeting Detail Room & 3D Spatial Video Player Redesign

**Files:**
- Modify: `app/meetings/[id]/page.tsx`
- Modify: `components/player/video-player.tsx`
- Modify: `components/player/video-scrubber.tsx`
- Modify: `components/player/speaker-presence-bar.tsx`

- [ ] **Step 1: Overhaul `app/meetings/[id]/page.tsx` layout with clean editorial header, crisp borders, and split views**
- [ ] **Step 2: Rebuild `video-player.tsx` with 3D spatial conference stage elevating the active speaker tile along the Z-axis, plus tactile controls**
- [ ] **Step 3: Rebuild `video-scrubber.tsx` with bold black track, electric yellow progress bar, physical thumb, and highlight markers**
- [ ] **Step 4: Rebuild `speaker-presence-bar.tsx` with color-blocked pastel talk-time meters and 1-click isolation**
- [ ] **Step 5: Verify TypeScript and build with `npm run build`**
- [ ] **Step 6: Commit changes**
  `git add app/meetings/[id]/ components/player/ && git commit -m "feat(player): redesign meeting room and 3D spatial player stage"`

---

### Task 5: Minimalist Editorial Transcript & AI Notes Panels Redesign

**Files:**
- Modify: `components/transcript/transcript-viewer.tsx`
- Modify: `components/transcript/transcript-segment.tsx`
- Modify: `components/notes/template-selector.tsx`
- Modify: `components/notes/ai-notes-panel.tsx`
- Modify: `components/notes/action-items-list.tsx`
- Modify: `components/notes/ask-fathom-chat.tsx`

- [ ] **Step 1: Rebuild `transcript-viewer.tsx` and `transcript-segment.tsx` with clean editorial typography, punchy yellow word highlighting (`bg-[#FEF08A] ring-1 ring-black`), and floating auto-scroll pill**
- [ ] **Step 2: Rebuild `template-selector.tsx` with sliding spring layout pill between the 4 templates**
- [ ] **Step 3: Rebuild `ai-notes-panel.tsx` with concise bulleted notes, clickable `[MM:SS]` timestamp badges, and copy action**
- [ ] **Step 4: Rebuild `action-items-list.tsx` with thick square checkboxes, confetti triggers, and assignee pills**
- [ ] **Step 5: Rebuild `ask-fathom-chat.tsx` with cyber lavender styling, tactile prompt pills, and citation jumps**
- [ ] **Step 6: Verify TypeScript and build with `npm run build`**
- [ ] **Step 7: Commit changes**
  `git add components/transcript/ components/notes/ && git commit -m "feat(notes): redesign editorial transcript and AI notes with neobrutalism"`

---

### Task 6: Action Items Hub, Live Recording Studio & Public Share Redesign

**Files:**
- Modify: `app/actions/page.tsx`
- Modify: `components/actions/actions-table.tsx`
- Modify: `components/actions/action-filters.tsx`
- Modify: `components/record/meeting-recorder-modal.tsx`
- Modify: `components/record/waveform-visualizer.tsx`
- Modify: `components/highlights/highlight-modal.tsx`
- Modify: `components/highlights/clip-share-modal.tsx`
- Modify: `app/share/[id]/page.tsx`
- Modify: `components/share/public-clip-viewer.tsx`
- Modify: `components/settings/api-keys-modal.tsx`

- [ ] **Step 1: Rebuild `app/actions/page.tsx` & `components/actions/*` with high-contrast KPI cards, tactile filters, and deep-link action table**
- [ ] **Step 2: Rebuild `meeting-recorder-modal.tsx` & `waveform-visualizer.tsx` into a retro-modern audio production workstation modal with 24 frequency bars**
- [ ] **Step 3: Rebuild `highlight-modal.tsx`, `clip-share-modal.tsx`, and `api-keys-modal.tsx` with neobrutalist modal dialogs**
- [ ] **Step 4: Rebuild `app/share/[id]/page.tsx` and `public-clip-viewer.tsx` for public guests**
- [ ] **Step 5: Verify TypeScript and build with `npm run build`**
- [ ] **Step 6: Commit changes**
  `git add app/actions/ components/actions/ components/record/ components/highlights/ app/share/ components/share/ components/settings/ && git commit -m "feat(views): redesign action hub, recorder studio, and guest share view"`

---

### Task 7: End-to-End Build Verification, TypeScript Check & Final Commit/Push

**Files:**
- Modify: `README.md`
- Verify: Full production build (`npm run build`)
- Synchronize: `.agent-logs/`

- [ ] **Step 1: Run comprehensive TypeScript and Next.js build check**
- [ ] **Step 2: Run shadcn audit tool `get_audit_checklist`**
- [ ] **Step 3: Update `README.md` reflecting the new Neobrutalist + Minimalist visual identity**
- [ ] **Step 4: Final Commit and Git Push to `origin main`**
  `git add . && git commit -m "chore: complete neobrutalist redesign with 3D motion and low-text minimalism"`

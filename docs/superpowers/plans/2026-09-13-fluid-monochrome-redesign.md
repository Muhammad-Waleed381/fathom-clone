# Fluid Monochrome UI & Interactive Audio-Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the application UI from Neobrutalism to a high-contrast, fluid white background with black foreground design system, featuring an interactive audio-wave ribbon canvas in the hero, a fluid sticky header with shadcn NavigationMenu, an ultra-minimal single-line footer, Lenis smooth scrolling, and strictly zero pill shapes.

**Architecture:** Maintain all core business logic and Zustand state while overhauling the presentation layer. Install `lenis` for inertia smooth scrolling, update Tailwind tokens and 14 shadcn UI primitives to clean architectural geometry (`rounded-xl`, `rounded-md`), build a 60fps generative audio-wave canvas in HTML5 Canvas, and adapt all pages, video player, transcript karaoke, notes, action hub, recorder, and public share views.

**Tech Stack:** Next.js 14 (App Router), TypeScript 5.x, Tailwind CSS 3.4, shadcn/ui primitives, Framer Motion, GSAP, Lenis (`lenis`), HTML5 Canvas API, Zustand, Web Audio API, Deepgram Nova-2, OpenRouter.

**Spec:** `docs/superpowers/specs/2026-09-13-fluid-monochrome-redesign.md`

## Global Constraints

- **Canvas & Foreground:** Pure luminous white canvas (`#FFFFFF` / `bg-zinc-50`) with deep black (`zinc-950` / `#09090B`) typography and structural elements.
- **Strictly Zero Pill Shapes:** Absolutely NO `rounded-full` or capsule shapes anywhere for buttons, badges, tabs, or headers. Use architectural rectangles with subtle modern radii (`rounded-lg`, `rounded-md`, `rounded-sm`).
- **No Neobrutalism:** Eliminate all 2px black cartoon outlines and flat offset block shadows (`shadow-neo`). Use refined hairline borders (`border-zinc-200`) and soft ambient shadows (`shadow-sm`, `shadow-xl shadow-black/[0.04]`).
- **Low-Text / Anti-Slop Discipline:** Keep all headings and content concise, punchy, and dense. Zero marketing fluff.
- **Preserve All Logic & Capabilities:** Retain the 42-minute 8-person benchmark call, word karaoke playback, click-to-seek, 4 summary templates, action items hub, audio recorder with sample simulation, and public guest clip sharing.
- **Verification:** Every task must pass `npx tsc --noEmit` and production build verification `npm run build`.

---

### Task 1: Fluid Monochrome Design System, Lenis Smooth Scroll & shadcn Primitives Re-styling

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `components/providers/smooth-scroll-provider.tsx`
- Create: `components/ui/navigation-menu.tsx`
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
- Modify: `components/ui/tooltip.tsx`
- Modify: `components/ui/popover.tsx`
- Modify: `components/ui/avatar.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `SmoothScrollProvider` in `components/providers/smooth-scroll-provider.tsx` exporting a client component initializing Lenis smooth scrolling.
- Produces: Re-styled shadcn primitives with clean architectural geometry (`rounded-md`, `rounded-xl`, subtle hairline borders, diffused shadows, zero pills).
- Produces: `NavigationMenu` primitive in `components/ui/navigation-menu.tsx`.

- [ ] **Step 1: Install `lenis`**
  Run `npm install lenis`
- [ ] **Step 2: Update `tailwind.config.ts` and `app/globals.css`**
  Remove `shadow-neo` tokens; configure fluid monochromatic colors (`background: #FFFFFF`, `foreground: #09090B`, subtle border `border-zinc-200`, soft shadows).
- [ ] **Step 3: Create `components/providers/smooth-scroll-provider.tsx`**
  Implement Lenis smooth scroll provider:
  ```tsx
  "use client";
  import { useEffect } from "react";
  import Lenis from "lenis";

  export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      const rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }, []);

    return <>{children}</>;
  }
  ```
- [ ] **Step 4: Create `components/ui/navigation-menu.tsx`**
  Implement shadcn `NavigationMenu` primitive using `@radix-ui/react-navigation-menu`.
- [ ] **Step 5: Re-style all 14 shadcn primitives in `components/ui/*`**
  - `button.tsx`: `rounded-md bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm transition-all duration-150 active:scale-[0.98]`. Strictly NO `rounded-full`.
  - `card.tsx`: `rounded-xl border border-zinc-200 bg-white shadow-sm`.
  - `badge.tsx`: `rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700`. NO `rounded-full`.
  - `dialog.tsx`: `rounded-xl border border-zinc-200 bg-white shadow-2xl`.
  - `tabs.tsx`: `rounded-md bg-zinc-100 p-1`, triggers `rounded-sm text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs`.
  - `slider.tsx`, `checkbox.tsx`, `input.tsx`, `dropdown-menu.tsx`, `command.tsx`, `scroll-area.tsx`, `tooltip.tsx`, `popover.tsx`, `avatar.tsx`: Monochromatic styling with subtle borders.
- [ ] **Step 6: Update `app/layout.tsx`**
  Wrap body contents in `SmoothScrollProvider`.
- [ ] **Step 7: Verify TypeScript and build**
  Run `npx tsc --noEmit && npm run build`.
- [ ] **Step 8: Commit changes**
  `git add package.json package-lock.json tailwind.config.ts app/globals.css components/providers/ components/ui/ app/layout.tsx && git commit -m "feat(ui): configure fluid monochrome design tokens, Lenis smooth scroll and shadcn primitives"`

---

### Task 2: Interactive Fluid Header & Minimal Single-Line Footer

**Files:**
- Create: `components/layout/fluid-header.tsx`
- Create: `components/layout/fluid-footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `FluidHeader` component with sticky full-width frosted glass bar, shadcn NavigationMenu, search omnibar trigger, and action buttons.
- Produces: `FluidFooter` component with single-line layout (`© 2026 Fathom AI`, operational status, back-to-top button).

- [ ] **Step 1: Create `components/layout/fluid-header.tsx`**
  - Full-width sticky header (`sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md`).
  - Left: Minimal geometric Fathom icon + workspace name.
  - Center: shadcn `NavigationMenu` with rectangular interactive links for *Meetings*, *Action Items*, and *Templates*.
  - Right: `Cmd+K` omnibar trigger button (`rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100`), "Record Meeting" button (`rounded-md bg-zinc-950 text-white hover:bg-zinc-800`), and user profile avatar.
  - Wire search trigger to `Cmd+K` omnibar event and record button to `MeetingRecorderModal`.
- [ ] **Step 2: Create `components/layout/fluid-footer.tsx`**
  - Ultra-minimal single-line footer (`w-full border-t border-zinc-200 py-6 text-xs text-zinc-500 bg-white`).
  - Left: `© 2026 Fathom AI. Intelligence from conversation.`
  - Center: Status indicator (`Status: Operational` with green dot).
  - Right: `Back to Top ↑` button triggering smooth scroll to window top (`window.scrollTo({ top: 0, behavior: "smooth" })`).
  - Zero pills, zero sprawling link columns.
- [ ] **Step 3: Update `app/layout.tsx`**
  Mount `FluidHeader` and `FluidFooter` around page children.
- [ ] **Step 4: Verify TypeScript and build**
  Run `npx tsc --noEmit && npm run build`.
- [ ] **Step 5: Commit changes**
  `git add components/layout/ app/layout.tsx && git commit -m "feat(layout): implement fluid header with shadcn navigation-menu and minimal single-line footer"`

---

### Task 3: Generative Fluid Audio-Wave Hero Canvas & Landing Page Redesign

**Files:**
- Create: `components/hero/fluid-audio-wave.tsx`
- Modify: `app/page.tsx`
- Modify: `components/dashboard/calendar-strip.tsx`
- Modify: `components/dashboard/meeting-card.tsx`
- Modify: `components/dashboard/command-search.tsx`

**Interfaces:**
- Produces: `FluidAudioWave` canvas component rendering a 60fps generative audio-wave ribbon with mouse and scroll reactivity.
- Updates: `app/page.tsx` landing dashboard with hero section, benchmark call card, calendar strip, and meeting cards grid.

- [ ] **Step 1: Create `components/hero/fluid-audio-wave.tsx`**
  - HTML5 Canvas element configured with `requestAnimationFrame` loop.
  - Renders 4-5 layered sine/cosine audio-wave curves with subtle graphite-to-charcoal gradients on pure white.
  - Mouse move event updates target phase and frequency with spring dampening.
  - Scroll position subtly modulates amplitude.
  - High DPI canvas scaling (`window.devicePixelRatio`).
- [ ] **Step 2: Redesign `app/page.tsx`**
  - Mount `FluidAudioWave` as background canvas in hero section.
  - Foreground: Concise headline *"Conversations into structured intelligence."*
  - Rectangular metadata strip: `42M 15S BENCHMARK CALL` · `8 PARTICIPANTS` · `92 DIARIZED SEGMENTS` (`rounded-md border border-zinc-200 bg-white/80 px-3 py-1 font-mono text-xs text-zinc-700`).
  - Featured Call Preview Card: `rounded-xl border border-zinc-200 bg-white/95 p-6 shadow-xl shadow-black/[0.04] backdrop-blur-sm`, attendee avatar stack, template summary bullet points, and "Launch Benchmark Call" primary button.
  - Scroll-triggered reveal animations via Framer Motion.
- [ ] **Step 3: Redesign `components/dashboard/calendar-strip.tsx`**
  - Sleek desk agenda with sync status, upcoming calls, and rectangular bot switch button.
- [ ] **Step 4: Redesign `components/dashboard/meeting-card.tsx`**
  - Rectangular cards (`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all`), attendee avatars, 1-click action buttons.
- [ ] **Step 5: Redesign `components/dashboard/command-search.tsx`**
  - shadcn `Command` dialog with clean monochrome styling and rectangular search items.
- [ ] **Step 6: Verify TypeScript and build**
  Run `npx tsc --noEmit && npm run build`.
- [ ] **Step 7: Commit changes**
  `git add components/hero/ app/page.tsx components/dashboard/ && git commit -m "feat(hero): implement fluid audio-wave canvas and redesign landing page"`

---

### Task 4: Meeting Detail Room & Audio-Synchronized Video Player Adaptation

**Files:**
- Modify: `app/meetings/[id]/page.tsx`
- Modify: `components/player/video-player.tsx`
- Modify: `components/player/video-scrubber.tsx`
- Modify: `components/player/speaker-presence-bar.tsx`

**Interfaces:**
- Updates: `app/meetings/[id]/page.tsx` meeting room layout.
- Updates: `VideoPlayer`, `VideoScrubber`, and `SpeakerPresenceBar` to clean monochrome surfaces with active speaker highlight and rectangular controls.

- [ ] **Step 1: Redesign `app/meetings/[id]/page.tsx`**
  - Clean editorial header: breadcrumb, title (`font-bold text-xl text-zinc-950`), attendee badges (`rounded-md border border-zinc-200 bg-zinc-50 text-xs font-medium`), action buttons (Highlight, Share Clip, Copy Notes, Settings).
  - 12-column responsive layout (`lg:col-span-7` player column, `lg:col-span-5` notes column).
- [ ] **Step 2: Adapt `components/player/video-player.tsx`**
  - Participant tiles in clean dark/neutral rectangles with subtle borders.
  - Active speaker highlighted with crisp ring indicator and subtle elevation shadow.
  - Tactile video controls (Play/Pause, -10s/+10s, speed, volume slider, hotkeys `Space`, `J`, `L`, `H`).
- [ ] **Step 3: Adapt `components/player/video-scrubber.tsx`**
  - Sleek neutral track (`h-2 rounded-sm bg-zinc-100 border border-zinc-200`), dark progress bar (`bg-zinc-950`), rectangular scrubber thumb with soft shadow.
- [ ] **Step 4: Adapt `components/player/speaker-presence-bar.tsx`**
  - Clean monochromatic talk-time meters with percentage badges, 1-click speaker isolation filtering.
- [ ] **Step 5: Verify TypeScript and build**
  Run `npx tsc --noEmit && npm run build`.
- [ ] **Step 6: Commit changes**
  `git add app/meetings/[id]/ components/player/ && git commit -m "feat(player): adapt meeting detail room and video player to fluid monochrome"`

---

### Task 5: Minimalist Editorial Transcript Viewer & Dynamic AI Notes Adaptation

**Files:**
- Modify: `components/transcript/transcript-viewer.tsx`
- Modify: `components/transcript/transcript-segment.tsx`
- Modify: `components/notes/template-selector.tsx`
- Modify: `components/notes/ai-notes-panel.tsx`
- Modify: `components/notes/action-items-list.tsx`
- Modify: `components/notes/ask-fathom-chat.tsx`

**Interfaces:**
- Updates: Transcript viewer with sub-second karaoke word spotlighting and click-to-seek.
- Updates: AI notes panel with dynamic template switching and clickable monospace `[MM:SS]` badges.
- Updates: Action items list with rectangular checkboxes, strike-through, and confetti celebration.
- Updates: Ask Fathom chat with rectangular suggestion chips and streaming markdown answers.

- [ ] **Step 1: Adapt `components/transcript/transcript-viewer.tsx` & `transcript-segment.tsx`**
  - Clean white surface (`rounded-xl border border-zinc-200 bg-white shadow-sm`).
  - Active word karaoke highlighting: Sub-second spotlighting (`bg-amber-100 text-zinc-950 font-medium px-1 rounded-sm`).
  - Click-any-word to seek playback immediately.
  - Floating tactile "Resume Auto-scroll" banner (`rounded-md border border-zinc-200 bg-white shadow-md text-xs font-medium`).
  - Speaker avatar with subtle border, role tag, monospace timestamp badge.
- [ ] **Step 2: Adapt `components/notes/template-selector.tsx`**
  - Rectangular tabs (`rounded-md`) for the 4 templates (Executive, Action Items, Sales, Engineering).
- [ ] **Step 3: Adapt `components/notes/ai-notes-panel.tsx`**
  - Clean white cards (`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm`).
  - Clickable monospace `[MM:SS]` badges (`rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-xs font-medium hover:bg-zinc-100`).
  - "Copy Markdown" button with tactile feedback.
- [ ] **Step 4: Adapt `components/notes/action-items-list.tsx`**
  - Rectangular checkboxes (`rounded-sm border border-zinc-300`), celebratory confetti burst on complete, strike-through, assignee avatar, priority badge, clickable timestamp seek link.
- [ ] **Step 5: Adapt `components/notes/ask-fathom-chat.tsx`**
  - Clean monochromatic chat drawer (`rounded-xl border border-zinc-200 bg-white`).
  - Rectangular prompt suggestion chips (`rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100`).
  - Conversational responses with markdown and clickable timestamp citations.
- [ ] **Step 6: Verify TypeScript and build**
  Run `npx tsc --noEmit && npm run build`.
- [ ] **Step 7: Commit changes**
  `git add components/transcript/ components/notes/ && git commit -m "feat(notes): adapt transcript viewer and AI notes to fluid monochrome"`

---

### Task 6: Action Items Hub, Live Recording Studio & Public Share Adaptation

**Files:**
- Modify: `app/actions/page.tsx`
- Modify: `components/actions/action-filters.tsx`
- Modify: `components/actions/actions-table.tsx`
- Modify: `components/record/meeting-recorder-modal.tsx`
- Modify: `components/record/waveform-visualizer.tsx`
- Modify: `components/highlights/highlight-modal.tsx`
- Modify: `components/highlights/clip-share-modal.tsx`
- Modify: `components/settings/api-keys-modal.tsx`
- Modify: `app/share/[id]/page.tsx`
- Modify: `components/share/public-clip-viewer.tsx`

**Interfaces:**
- Updates: Action items hub with 4 monochrome KPI cards, rectangular filters, and deep-link table.
- Updates: Live recording studio with 24 animated frequency bars, digital timer, and sample simulation.
- Updates: Modals and public guest clip viewer.

- [ ] **Step 1: Adapt `app/actions/page.tsx` & `components/actions/*`**
  - Header: "WORKSPACE / ACTION ITEMS", Export CSV and Copy Markdown buttons.
  - 4 Monochrome KPI Cards: Total, Completed, Pending, Completion Rate (`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm`).
  - Filter tabs (*All*, *Pending*, *Completed*), dropdowns for Assignee, Priority, Meeting.
  - Table: Rectangular checkboxes, deep-link timestamp badges to `/meetings/[id]?t=X`, assignee avatars with tooltips.
- [ ] **Step 2: Adapt `components/record/*`**
  - Minimalist audio workstation modal (`rounded-xl border border-zinc-200 bg-white shadow-2xl`).
  - 24 animated frequency visualizer bars (`rounded-xs bg-zinc-950`).
  - Digital timer, status badge, "Simulate Sample Audio" button, streaming transcript box, "Stop & Generate AI Notes" button.
- [ ] **Step 3: Adapt modals in `components/highlights/` and `components/settings/`**
  - Styled with `rounded-xl border border-zinc-200 bg-white shadow-2xl`.
- [ ] **Step 4: Adapt `app/share/[id]/page.tsx` & `components/share/public-clip-viewer.tsx`**
  - Unauthenticated public guest player with bounded scrubber and synchronized transcript.
- [ ] **Step 5: Verify TypeScript and build**
  Run `npx tsc --noEmit && npm run build`.
- [ ] **Step 6: Commit changes**
  `git add app/actions/ components/actions/ components/record/ components/highlights/ components/settings/ app/share/ components/share/ && git commit -m "feat(views): adapt action hub, recorder studio, and guest share to fluid monochrome"`

---

### Task 7: End-to-End Build Verification, TypeScript Check & Final Commit/Push

**Files:**
- Modify: `README.md`
- Synchronize: `.agent-logs/`

- [ ] **Step 1: Run comprehensive TypeScript check and Next.js build**
  Run `npx tsc --noEmit && npm run build` and verify all 8 static and dynamic routes compile cleanly.
- [ ] **Step 2: Run shadcn audit tool `get_audit_checklist`**
- [ ] **Step 3: Update `README.md` reflecting the Fluid White + Black Foreground design system**
- [ ] **Step 4: Final Commit and Git Push to `origin main`**
  `git add . && git commit -m "chore: complete fluid monochrome redesign with interactive audio-wave hero and Lenis smooth scroll"`
  `git push origin main`

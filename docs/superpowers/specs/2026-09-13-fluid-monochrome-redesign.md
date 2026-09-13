# Design Specification: Fluid Monochrome UI & Interactive Audio-Wave Experience

**Date:** 2026-09-13  
**Status:** Approved  
**Author:** Antigravity Team  
**Scope:** UI / Frontend Presentation Layer Redesign

---

## 1. Executive Summary & Vision

This specification defines the complete redesign of the Fathom AI Notetaker application from the previous heavy Neobrutalist aesthetic to an ethereal, modern **Fluid White Background with Black Foreground** design system.

### Core Tenets:
1. **Fluid White & Pure Black Monochromatic Aesthetic**: Crisp, luminous white canvas (`#FFFFFF`) with deep obsidian black (`#09090B`, `zinc-950`) typography and structural elements. No cartoon borders, no harsh 2px black outlines, no flat offset block shadows.
2. **Zero Pill Shapes Rule**: Strictly forbid pill shapes (`rounded-full`, capsule buttons, pill tags). All UI components, buttons, badges, tabs, and input containers adhere to crisp, architectural rectangles with subtle modern radii (`rounded-lg`, `rounded-md`, `rounded-sm`).
3. **Interactive Fluid Header & Minimal Single-Line Footer**:
   - Header: Full-width sticky top bar with frosted glassmorphism (`backdrop-blur-md bg-white/85 border-b border-zinc-200/80`), interactive shadcn `NavigationMenu` with rectangular items, `Cmd+K` omnibar trigger, and one-click actions.
   - Footer: Ultra-minimal, single-line bottom bar (`border-t border-zinc-200 py-6 text-xs text-zinc-500`) containing copyright, operational status, and back-to-top action. Zero clutter.
4. **Hero Section Fluid Audio-Wave Ribbon**: Interactive, generative Canvas/WebGL acoustic waveform ribbon in monochromatic charcoal/graphite gradients gently undulating on pure white at 60fps, responsive to mouse position and scroll velocity.
5. **Smooth Scroll & Scroll-Driven Reveals**: Butter-smooth inertia scrolling via **Lenis** combined with Framer Motion/GSAP scroll-triggered stagger reveals on meeting cards and agenda items.
6. **Low-Text / Anti-Slop Discipline**: Maintain strict editorial brevity across all views. Zero marketing filler or verbose paragraphs; dense, high-signal controls and concise bullet notes.
7. **Complete Feature & Logic Preservation**: All core capabilities (42-minute 8-person benchmark call, sub-second word-synchronized karaoke transcript, 4 AI summary templates, action items hub, Web Speech recorder with simulation, and public guest clip sharing) remain 100% functional and intact.

---

## 2. Design System & Tokens

### 2.1 Palette Tokens (`tailwind.config.ts` & `globals.css`)
- **Canvas / Background**:
  - Base: `#FFFFFF` (`bg-white`)
  - Subtle Section Wash: `#FAFAFA` (`bg-zinc-50`)
  - Elevated Surfaces: `#FFFFFF` with `backdrop-blur-md bg-white/80`
- **Foreground / Text**:
  - Primary: `#09090B` (`text-zinc-950`)
  - Secondary / Meta: `#52525B` (`text-zinc-600`)
  - Muted / Inactive: `#71717A` (`text-zinc-500`)
- **Borders & Dividers**:
  - Standard Hairline: `border-zinc-200` (`#E4E4E7`)
  - Subtle Divider: `border-zinc-100` (`#F4F4F5`)
  - Focus Ring: `ring-1 ring-zinc-950` or `ring-black/10`
- **Shadows**:
  - Diffused Soft: `shadow-xs`, `shadow-sm`, `shadow-md shadow-black/[0.03]`, `shadow-xl shadow-black/[0.05]`
  - Remove all `shadow-neo` and flat offset shadows.
- **Accents (Functional Only)**:
  - Active Spotlight / Highlight: `#FEF08A` (subtle yellow for transcript search / word karaoke) or pure black badge with white text.
  - Recording Live Dot: `#10B981` (emerald green pulse).

### 2.2 Geometry & Corner Radii
- Cards & Modals: `rounded-xl`
- Buttons & Tabs: `rounded-md`
- Badges & Metric Tags: `rounded-md` (never `rounded-full`)
- Inputs & Search: `rounded-md`

---

## 3. Component Architecture & Routes

### 3.1 Global Layout (`app/layout.tsx`, `components/layout/`)
- **`components/layout/fluid-header.tsx`**:
  - Full-width sticky navigation bar (`sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md`).
  - Left: Minimalist geometric Fathom brand icon + title, workspace selector.
  - Center: shadcn `NavigationMenu` with rectangular hover states for *Meetings*, *Action Items*, and *Templates*.
  - Right: `Cmd+K` search bar trigger (`rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100`), solid black "Record Meeting" button (`rounded-md bg-zinc-950 text-white hover:bg-zinc-800`), and user profile dropdown.
- **`components/layout/fluid-footer.tsx`**:
  - Single-line bottom bar (`w-full border-t border-zinc-200 py-6 text-xs text-zinc-500 bg-white`).
  - Left: `© 2026 Fathom AI. All conversations indexed.`
  - Center: `Status: Operational (100%)` with small green status dot.
  - Right: `Back to Top ↑` (scrolls to top smoothly).
- **Smooth Scroll Provider (`components/providers/smooth-scroll-provider.tsx`)**:
  - Initializes Lenis smooth scrolling for buttery fluid inertia across all desktop and mobile views.

### 3.2 Landing Page (`app/page.tsx`, `components/hero/`, `components/dashboard/`)
- **`components/hero/fluid-audio-wave.tsx`**:
  - High-performance HTML5 Canvas / WebGL audio-wave ribbon.
  - Monochromatic multi-layered bezier waves rendering with soft gradient fills and delicate stroke outlines.
  - Continuous organic oscillation with gentle mouse reactivity (waves ripple slightly on pointer movement) and scroll speed dampening.
- **Hero Foreground**:
  - Crisp editorial headline: *"Conversations into structured intelligence."*
  - Monospace metadata strip: `42M 15S BENCHMARK CALL` · `8 PARTICIPANTS` · `92 DIARIZED SEGMENTS` (rectangular `rounded-md border border-zinc-200 bg-white/80 px-2.5 py-1 text-[11px] font-mono font-medium text-zinc-700`).
  - Featured Call Preview Card: `rounded-xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-black/[0.04] backdrop-blur-sm`, participant avatar stack, quick template summary bullet points, and "Launch Benchmark Call" primary button.
- **Dashboard Workspace**:
  - `calendar-strip.tsx`: Sleek white desk agenda with Google Calendar sync indicator and upcoming calls list.
  - Category filter tabs: Rectangular tabs (`rounded-md text-xs font-medium`) with crisp active underline/border indicator.
  - Meeting grid: Rectangular cards (`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all`), attendee avatars, 1-click action buttons.
  - `command-search.tsx`: shadcn `Command` dialog re-styled with clean fluid monochrome surfaces and rectangular results.

### 3.3 Meeting Detail Room (`app/meetings/[id]/page.tsx`, `components/player/`, `components/transcript/`, `components/notes/`)
- **Meeting Header**: Clean editorial breadcrumb, title (`font-bold text-xl text-zinc-950`), attendee badges (`rounded-md border border-zinc-200 bg-zinc-50 text-xs font-medium`), action buttons (Highlight, Share Clip, Copy Notes, Settings).
- **Video Player (`components/player/video-player.tsx`)**:
  - Participant video tiles rendered in clean dark/neutral tiles with subtle borders.
  - Active speaker highlighted with crisp white/black ring indicator and subtle elevation.
  - Tactile video controls: Play/Pause, -10s/+10s, speed select, volume slider, hotkeys (`Space`, `J`, `L`, `H`).
- **Scrubber (`components/player/video-scrubber.tsx`)**:
  - Sleek neutral track (`h-2 rounded-sm bg-zinc-100 border border-zinc-200`), dark progress bar (`bg-zinc-950`), rectangular scrubber thumb.
- **Speaker Presence Bar (`components/player/speaker-presence-bar.tsx`)**:
  - Clean monochromatic talk-time meters with percentage badges; 1-click speaker isolation filtering.
- **Transcript Viewer (`components/transcript/transcript-viewer.tsx`)**:
  - Rock-solid flat reading surface (`rounded-xl border border-zinc-200 bg-white shadow-sm`).
  - Active word karaoke highlighting: Soft electric yellow highlight (`bg-amber-100 text-zinc-950 font-medium px-1 rounded-sm`) or high-contrast box.
  - Click-any-word to seek playback immediately.
  - Floating tactile "Resume Auto-scroll" banner (`rounded-md border border-zinc-200 bg-white shadow-md text-xs font-medium`).
- **AI Notes Panel (`components/notes/ai-notes-panel.tsx`)**:
  - Clean white cards (`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm`).
  - Clickable monospace `[MM:SS]` badges (`rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-xs font-medium hover:bg-zinc-100`).
  - Dynamic template switching across Executive, Action Items, Sales, Engineering.
- **Ask Fathom Chat (`components/notes/ask-fathom-chat.tsx`)**:
  - Clean monochromatic chat drawer (`rounded-xl border border-zinc-200 bg-white`).
  - Rectangular prompt suggestion chips (`rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100`).
  - Streaming markdown responses with clickable timestamp seek citations.

### 3.4 Action Items Hub (`app/actions/page.tsx`, `components/actions/`)
- Header: "WORKSPACE / ACTION ITEMS" breadcrumb, Export CSV and Copy Markdown buttons.
- 4 Monochrome KPI Cards: Total, Completed, Pending, Completion Rate (`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm`).
- Filters: Rectangular status tabs (*All*, *Pending*, *Completed*), dropdowns for Assignee, Priority, Meeting.
- Table: Rectangular checkboxes (`rounded-sm border border-zinc-300`), deep-link timestamp badges to `/meetings/[id]?t=X`, assignee avatars with tooltips.

### 3.5 Live Recording Studio & Share Modals
- **Workstation Modal (`components/record/meeting-recorder-modal.tsx`)**:
  - Minimalist audio workstation modal (`rounded-xl border border-zinc-200 bg-white shadow-2xl`).
  - 24 animated frequency visualizer bars (`rounded-xs bg-zinc-950`).
  - Digital timer, status badge, "Simulate Sample Audio" button, streaming transcript, and "Stop & Generate AI Notes" button.
- **Public Guest Viewer (`app/share/[id]/page.tsx`, `components/share/public-clip-viewer.tsx`)**:
  - Unauthenticated public guest player with bounded scrubber and synchronized transcript.

---

## 4. shadcn Primitives Re-styling Checklist

Update all primitives in `components/ui/*` from neobrutalism to clean monochrome:
- `button.tsx`: Remove `border-2 border-black` and `shadow-[4px_4px_0px_0px_#000]`. Use `rounded-md bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm transition-all`.
- `card.tsx`: Remove 2px black borders and hard offsets. Use `rounded-xl border border-zinc-200 bg-white shadow-sm`.
- `badge.tsx`: Remove `rounded-full` (NO PILLS!). Use `rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium`.
- `dialog.tsx`: Clean backdrop blur, `rounded-xl border border-zinc-200 bg-white shadow-2xl`.
- `tabs.tsx`: Clean rectangular tabs (`rounded-md`) with soft muted active state or border.
- `input.tsx`: `rounded-md border border-zinc-200 bg-white focus:ring-1 focus:ring-zinc-950`.
- `checkbox.tsx`: `rounded-sm border border-zinc-300 data-[state=checked]:bg-zinc-950`.
- `dropdown-menu.tsx`, `command.tsx`, `popover.tsx`, `scroll-area.tsx`, `tooltip.tsx`, `slider.tsx`, `avatar.tsx`: Clean monochromatic styling with subtle borders.

---

## 5. Verification & Acceptance Criteria

1. **Build & Type Safety**: `npx tsc --noEmit` passes with 0 errors; `npm run build` compiles all 8 routes cleanly.
2. **Zero Pills**: Zero occurrences of `rounded-full` in interactive buttons, badges, and tabs.
3. **No Neobrutalism**: Zero 2px black cartoon borders and zero `shadow-neo` / flat offset box shadows.
4. **Hero Soundwave Canvas**: Generative fluid audio-wave canvas runs smoothly at 60fps behind the hero section.
5. **Interactive Header & Minimal Footer**: Sticky header with shadcn NavigationMenu and single-line clean footer.
6. **Smooth Scroll**: Lenis smooth scroll active on the landing page.
7. **Functionality Intact**: All meeting playback, word karaoke, template switching, action items, speech recording, and public sharing operate flawlessly.

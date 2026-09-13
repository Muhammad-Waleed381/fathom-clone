# Fathom.video Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a production-grade rebuild of Fathom.video with synchronized media playback, 8-person speaker diarization and filtering, dynamic AI templates, interactive action items, hotkey highlight clipping, cross-meeting search, action items inbox, and live browser recording.

**Architecture:** Next.js (App Router) + TypeScript + Tailwind CSS with dark-mode default, official shadcn/ui components generated via `shadcn` MCP, Zustand for reactive player state, LocalStorage for persistent user data, OpenRouter API for multi-template summarization and Q&A, and Deepgram Nova-2 for STT diarization.

**Tech Stack:** Next.js 14/15, React, TypeScript, Tailwind CSS, shadcn/ui (via shadcn MCP), Lucide React, Zustand, Canvas Confetti.

**Spec:** `docs/superpowers/specs/2026-09-13-fathom-rebuild-design.md`

## Global Constraints
- Target directory: `/home/waleed/Desktop/fathom-clone`
- **MANDATORY UI RULE:** For all standard and rich UI components (Button, Dialog, Tabs, DropdownMenu, Tooltip, Popover, Slider, Badge, Command, Input, Checkbox, Avatar, ScrollArea, Card), **DO NOT create custom primitives from scratch**. Always use the `shadcn` MCP tools (`get_add_command_for_items`, `view_items_in_registries`, `get_audit_checklist`) and `npx shadcn@latest add` to add official components into `components/ui/`.
- Dark-mode default with deep indigo/violet accents (`#6366F1`) and slate surfaces (`#0F172A`, `#1E293B`)
- Zero login wall for reviewers opening the live deployment
- Pre-cached fail-safe summaries for all seeded meetings to guarantee 0ms latency even without API keys
- `.agent-logs/` must remain committed and updated throughout implementation

---

### Task 1: Next.js Project Scaffolding & shadcn/ui Integration via MCP

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `components.json`
- Create: `app/layout.tsx`, `app/globals.css`
- Create: `types/meeting.ts`
- Create: `lib/utils.ts`
- Add via shadcn MCP: `components/ui/button.tsx`, `components/ui/dialog.tsx`, `components/ui/tabs.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/tooltip.tsx`, `components/ui/popover.tsx`, `components/ui/slider.tsx`, `components/ui/badge.tsx`, `components/ui/command.tsx`, `components/ui/checkbox.tsx`, `components/ui/avatar.tsx`, `components/ui/scroll-area.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx`

**Interfaces:**
- Produces: `Meeting`, `Speaker`, `TranscriptSegment`, `TranscriptWord`, `ActionItem`, `MeetingHighlight`, `SummaryTemplateId` types.
- Produces: Official shadcn/ui components installed into `components/ui/` using shadcn MCP.

- [ ] **Step 1: Initialize Next.js project dependencies**
  Configure `package.json` with Next.js, React, Lucide-react, Zustand, clsx, tailwind-merge, canvas-confetti.
- [ ] **Step 2: Create TypeScript types (`types/meeting.ts`)**
  Export all data model interfaces defined in the specification.
- [ ] **Step 3: Configure Tailwind and CSS Theme Variables**
  Setup `tailwind.config.ts` and `app/globals.css` with dark theme variables, custom scrollbars, and accent colors.
- [ ] **Step 4: Use shadcn MCP to add official UI components**
  Use `get_add_command_for_items` MCP tool and install `@shadcn/button`, `@shadcn/dialog`, `@shadcn/tabs`, `@shadcn/dropdown-menu`, `@shadcn/tooltip`, `@shadcn/popover`, `@shadcn/slider`, `@shadcn/badge`, `@shadcn/command`, `@shadcn/checkbox`, `@shadcn/avatar`, `@shadcn/scroll-area`, `@shadcn/card`, `@shadcn/input`.
- [ ] **Step 5: Run shadcn audit checklist and verify build**
  Use `get_audit_checklist` MCP tool to verify imports, styles, and TypeScript definitions.
- [ ] **Step 6: Commit**
  `git add . && git commit -m "feat(scaffold): initialize Next.js app with Tailwind, core types, and shadcn components via MCP"`

---

### Task 2: Seed Dataset & Client State Management

**Files:**
- Create: `data/seed-meetings.ts`
- Create: `lib/store/use-meeting-store.ts`

**Interfaces:**
- Produces: `SEED_MEETINGS: Meeting[]` containing the 42-min 8-person benchmark call, sales call, 1-on-1, and design critique.
- Produces: `useMeetingStore` Zustand hook exposing `meetings`, `currentMeeting`, `currentTime`, `isPlaying`, `playbackRate`, `activeSpeakerFilter`, `activeTemplateId`, `toggleActionItem`, `addHighlight`, `seekTo`.

- [ ] **Step 1: Write comprehensive seed dataset (`data/seed-meetings.ts`)**
  Include the 8-person call with 85+ diarized segments, complete 4-template outputs (*Executive*, *Action Items*, *Sales*, *Engineering*), assigned action items, and timestamped highlights.
- [ ] **Step 2: Implement Zustand state store (`lib/store/use-meeting-store.ts`)**
  Wire playback state, speaker filter, action item toggle with LocalStorage persistence.
- [ ] **Step 3: Verify seed data loading and state updates**
  Ensure store hydrates seed data and persists edits to LocalStorage.
- [ ] **Step 4: Commit**
  `git add data/ lib/store/ && git commit -m "feat(data): add comprehensive 8-person seed dataset and Zustand store"`

---

### Task 3: Video Player & Synchronized Interactive Transcript Engine

**Files:**
- Create: `components/player/video-player.tsx` (using shadcn `Slider`, `Tooltip`, `DropdownMenu`)
- Create: `components/player/video-scrubber.tsx`
- Create: `components/player/speaker-presence-bar.tsx` (using shadcn `Avatar`, `Badge`)
- Create: `components/transcript/transcript-viewer.tsx` (using shadcn `ScrollArea`, `Button`, `Badge`)
- Create: `components/transcript/transcript-segment.tsx`

**Interfaces:**
- Consumes: `useMeetingStore`, shadcn UI components
- Produces: Sub-second word-level highlighting, click-to-seek, auto-scroll with pause/resume, and active speaker timeline badges.

- [ ] **Step 1: Build `VideoPlayer` & `VideoScrubber`**
  Integrate shadcn `Slider` for scrub/volume, `Tooltip` for keyboard shortcut hints, timeline highlight markers, and 'H' hotkey trigger.
- [ ] **Step 2: Build `SpeakerPresenceBar`**
  Display 8 participant avatars using shadcn `Avatar`, talk-time percentages, and click-to-filter speaker toggle.
- [ ] **Step 3: Build `TranscriptViewer` with word-level sync**
  Render segments with speaker badges, highlight currently spoken word, enable click-to-seek, and manage auto-scroll locking with shadcn `ScrollArea`.
- [ ] **Step 4: Add text selection popover for instant clipping**
  Use shadcn `Popover` for the floating tooltip with *"Highlight & Clip"* option.
- [ ] **Step 5: Commit**
  `git add components/player/ components/transcript/ && git commit -m "feat(player): implement synchronized video player and interactive transcript with shadcn components"`

---

### Task 4: Dynamic AI Template Switcher & Action Items Management

**Files:**
- Create: `components/notes/ai-notes-panel.tsx` (using shadcn `Tabs`, `Card`, `Button`, `Badge`)
- Create: `components/notes/template-selector.tsx` (using shadcn `Tabs`)
- Create: `components/notes/action-items-list.tsx` (using shadcn `Checkbox`, `Badge`, `Button`)
- Create: `components/notes/ask-fathom-chat.tsx` (using shadcn `Input`, `Button`, `ScrollArea`)

**Interfaces:**
- Consumes: `Meeting["summaries"]`, `Meeting["actionItems"]`, shadcn UI components
- Produces: Instant template switching (*Executive*, *Action Items*, *Sales*, *Engineering*), interactive todo checkboxes, timestamp jump, and "Ask AI" chat box.

- [ ] **Step 1: Implement `TemplateSelector` & `AiNotesPanel`**
  Use shadcn `Tabs` to render structured summary sections, bullet points, and clickable timestamp references with 0ms lag.
- [ ] **Step 2: Implement `ActionItemsList`**
  Use shadcn `Checkbox` and `Badge` for interactive todo items, assignee badges, click-to-seek timestamps, and "Copy to Slack/Markdown" action.
- [ ] **Step 3: Implement `AskFathomChat`**
  Add Q&A conversational interface using shadcn `Input` and `ScrollArea` with citation jumps.
- [ ] **Step 4: Commit**
  `git add components/notes/ && git commit -m "feat(notes): implement dynamic template switcher and action items panel"`

---

### Task 5: AI Intelligence & Speech-to-Text API Routes

**Files:**
- Create: `app/api/ai/summarize/route.ts`
- Create: `app/api/ai/ask/route.ts`
- Create: `app/api/transcribe/route.ts`
- Create: `lib/openrouter.ts`
- Create: `lib/deepgram.ts`
- Create: `components/settings/api-keys-modal.tsx` (using shadcn `Dialog`, `Input`, `Button`)

**Interfaces:**
- Produces: Working streaming OpenRouter endpoints and Deepgram transcription with safe pre-computed fallbacks if keys are omitted.

- [ ] **Step 1: Implement OpenRouter client and prompt templates (`lib/openrouter.ts`)**
  Configure API calls using free models (`meta-llama/llama-3.3-70b-instruct:free`) with structured prompts.
- [ ] **Step 2: Implement Deepgram client (`lib/deepgram.ts`)**
  Handle audio formData transcription with speaker diarization.
- [ ] **Step 3: Create API Route Handlers**
  `POST /api/ai/summarize`, `POST /api/ai/ask`, and `POST /api/transcribe` with graceful fallback handling.
- [ ] **Step 4: Build `ApiKeysModal`**
  Use shadcn `Dialog` and `Input` to allow reviewer to configure custom Deepgram/OpenRouter keys directly from the UI header.
- [ ] **Step 5: Commit**
  `git add app/api/ lib/ components/settings/ && git commit -m "feat(api): add OpenRouter summaries and Deepgram transcription endpoints"`

---

### Task 6: Highlights, Clip Sharing & Public Guest View

**Files:**
- Create: `components/highlights/highlight-modal.tsx` (using shadcn `Dialog`, `Input`, `Button`, `Badge`)
- Create: `components/highlights/clip-share-modal.tsx` (using shadcn `Dialog`, `Button`, `Input`)
- Create: `app/share/[id]/page.tsx`
- Create: `components/share/public-clip-viewer.tsx` (using shadcn `Card`, `Badge`, `Button`)

**Interfaces:**
- Produces: Modal to name and save clips; public unauthenticated page `/share/[id]?start=X&end=Y` with zero login barriers.

- [ ] **Step 1: Implement Highlight and Clip Creation Modal**
  Support custom title, category (*Key Moment*, *Decision*, *Action*, *Risk*), and start/end time adjusters.
- [ ] **Step 2: Implement Public Share View (`/share/[id]`)**
  Clean, focused video clip viewer with transcript snippet and "Open in Fathom" CTA.
- [ ] **Step 3: Commit**
  `git add components/highlights/ app/share/ components/share/ && git commit -m "feat(share): implement clip creator and public guest share view"`

---

### Task 7: Dashboard Workspace & Global Search (Cmd+K)

**Files:**
- Create: `app/page.tsx`
- Create: `components/dashboard/dashboard-header.tsx` (using shadcn `Button`, `Avatar`, `Badge`)
- Create: `components/dashboard/calendar-strip.tsx` (using shadcn `Badge`)
- Create: `components/dashboard/meeting-card.tsx` (using shadcn `Card`, `Badge`, `Avatar`, `Button`)
- Create: `components/dashboard/command-search.tsx` (using shadcn `Command`, `Dialog`)
- Create: `app/meetings/[id]/page.tsx`

**Interfaces:**
- Produces: Root URL (`/`) dashboard displaying Google Calendar status, 8-person featured banner, search omnibar, and meeting view routes.

- [ ] **Step 1: Implement `CalendarStrip` & `DashboardHeader`**
  Render Google Calendar connection status, upcoming meetings bar, and "Simulate Call" trigger.
- [ ] **Step 2: Implement `MeetingCard` & Directory List**
  Render cards with speaker avatar stacks, template badges, summary snippets, and quick actions.
- [ ] **Step 3: Implement `CommandSearch` (`Cmd+K`)**
  Use shadcn `Command` for global fuzzy search across all titles, speakers, transcript words, and action items.
- [ ] **Step 4: Wire Meeting Page (`/meetings/[id]`)**
  Assemble Player, Scrubber, Transcript, and Notes panel into a cohesive split view.
- [ ] **Step 5: Commit**
  `git add app/ components/dashboard/ && git commit -m "feat(dashboard): implement meetings dashboard and Cmd+K search omnibar with shadcn components"`

---

### Task 8: Dedicated Action Items Hub (`/actions`)

**Files:**
- Create: `app/actions/page.tsx`
- Create: `components/actions/actions-table.tsx` (using shadcn `Checkbox`, `Badge`, `Button`, `Input`)
- Create: `components/actions/action-filters.tsx` (using shadcn `Tabs`, `DropdownMenu`, `Badge`)

**Interfaces:**
- Produces: `/actions` route aggregating all action items across all meetings, filterable by assignee, status, and meeting source, with confetti completion.

- [ ] **Step 1: Implement Action Items Aggregator**
  Extract all action items across all meetings in the store.
- [ ] **Step 2: Implement `ActionsTable` with filters & completion effects**
  Add assignee filter, search filter, confetti trigger on completion, and "Export to CSV/Markdown".
- [ ] **Step 3: Commit**
  `git add app/actions/ components/actions/ && git commit -m "feat(actions): implement centralized Action Items Hub"`

---

### Task 9: In-Browser Meeting Simulator & Live Recording Studio

**Files:**
- Create: `components/record/meeting-recorder-modal.tsx` (using shadcn `Dialog`, `Button`, `Badge`)
- Create: `lib/audio/use-speech-recognition.ts`
- Create: `components/record/waveform-visualizer.tsx`

**Interfaces:**
- Produces: Live recording modal capturing microphone input, streaming live text onto screen, and generating a new meeting with AI notes.

- [ ] **Step 1: Implement `useSpeechRecognition` hook**
  Wrap browser Web Speech API with fallback simulated audio chunks.
- [ ] **Step 2: Build `MeetingRecorderModal`**
  Animate "Fathom Bot" joining call, display live waveform, live transcript, and "Finish & Generate Notes" action.
- [ ] **Step 3: Wire into store to create new persistent meeting**
  When stopped, saves a new meeting into LocalStorage and navigates directly to its view.
- [ ] **Step 4: Commit**
  `git add components/record/ lib/audio/ && git commit -m "feat(recorder): implement in-browser meeting recorder and AI generator"`

---

### Task 10: End-to-End Verification, Performance & Vercel Readiness

**Files:**
- Create: `README.md`
- Verify: Full production build (`npm run build`)
- Verify: Vercel deployment configuration

- [ ] **Step 1: Run comprehensive TypeScript and Next.js build check**
  Run: `npm run build`
  Expected: Clean build with 0 warnings or type errors.
- [ ] **Step 2: Run shadcn component audit**
  Use `get_audit_checklist` MCP tool and confirm all components follow best practices.
- [ ] **Step 3: Write documentation (`README.md`)**
  Detail architecture, key features, walkthrough video guide, and API configuration instructions.
- [ ] **Step 4: Update `.agent-logs/` and perform final commit & push**
  Ensure all prompt logs are synchronized and pushed to GitHub.
- [ ] **Step 5: Final Commit & Push**
  `git add . && git commit -m "chore: complete fathom rebuild with end-to-end verification and documentation"`

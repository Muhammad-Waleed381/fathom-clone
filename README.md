# Fathom AI Notetaker — Production Rebuild

[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui_MCP-black)](https://ui.shadcn.com/)
[![Deepgram Nova-2](https://img.shields.io/badge/STT-Deepgram_Nova--2-13EF93?style=flat)](https://deepgram.com/)
[![OpenRouter AI](https://img.shields.io/badge/LLM-OpenRouter_Llama_3.3_70B-6366F1?style=flat)](https://openrouter.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A pixel-crafted, high-performance production rebuild of **[Fathom.video](https://fathom.video)** — the premier AI meeting assistant. Built from the ground up for high-velocity executive, product, and engineering teams with sub-second word-synchronized transcript playback, dynamic multi-template AI notes, interactive action items tracking, in-browser live recording, and unauthenticated public clip sharing.

---

## 🌟 Key Features & Capabilities

### 1. 42-Minute 8-Person Benchmark Meeting
- **Rich Seed Corpus**: Features *"Q3 Platform Architecture & Scalability Sync"* — a 42-minute 15-second meeting featuring 8 distinct engineering & product leaders (CTO, VP Eng, Staff Architect, Tech Lead, DevOps, Security, Product, QA).
- **92 Diarized Segments**: Every spoken phrase includes speaker metadata, avatar, distinct role color, and precise start/end timestamps.
- **Sub-Second Word Timing**: Over 1,500 words with individual start/end bounds for precision playback and text-selection clipping.
- **Pre-computed Multi-Perspective Summaries**: 4 distinct templates pre-generated for instant review.

### 2. Synchronized Interactive Video Player & Transcript Engine
- **Active Word-Level Highlighting**: Live karaoke-style spotlighting highlighting each individual word at sub-second precision as the media plays.
- **Bidirectional Click-to-Seek**: Click any word, paragraph, or timestamp citation anywhere in the app to immediately jump video playback to that exact second.
- **Smart Auto-Scroll & Breakaway Detection**: Smoothly tracks the speaker in real time; automatically disengages if the user manually scrolls, surfacing a floating *"Resume Auto-scroll"* pill.
- **Keyboard Power Shortcuts**:
  - `Space`: Play / Pause toggle
  - `J` / `L`: Seek -10 seconds / +10 seconds
  - `H`: Quick-bookmark a 30-second highlight at the current position
- **Speaker Presence Bar**: Displays 8-speaker talk-time distribution percentages; clicking any speaker filters the transcript view to only their spoken segments.

### 3. Dynamic Multi-Template AI Intelligence Layer
- **Instant Template Switcher**: Toggle effortlessly between 4 specialized meeting lenses:
  1. **Executive Summary**: High-level problem statement, strategic decisions, and impact.
  2. **Action Items & Owners**: Granular to-dos mapped to assignees with direct timestamp references.
  3. **Sales Discovery**: Pain points, budget, procurement timelines, and next steps.
  4. **Engineering Sync**: Technical architecture tradeoffs, database sharding, migration risks, and latency benchmarks.
- **Clickable Timestamp Citations**: Every bullet point and summary reference features a clickable `[MM:SS]` timestamp badge that seeks the player.
- **"Ask Fathom" Conversational Q&A**: Interactive chat drawer allowing free-form inquiries into the meeting transcript with suggested prompt pills and clickable citations.

### 4. Centralized Action Items Hub (`/actions`)
- **Workspace-Wide Aggregation**: Pulls all assigned tasks across all meetings into a single actionable dashboard.
- **Interactive Checkbox Completion**: Toggle completion with instant confetti celebration animations and state persistence.
- **Deep Seek Links**: Click any action item timestamp to open the parent meeting and jump directly to the moment of assignment.
- **Multi-Faceted Filtering**: Filter instantly by Assignee, Status (*All*, *Pending*, *Completed*), Priority (*High*, *Medium*, *Low*), or source meeting.
- **1-Click Export**: Export the full action list to CSV or copy clean Markdown formatted for Slack.

### 5. In-Browser Meeting Recorder & Live Audio Simulator
- **Live Microphone Recording**: Leverages the browser Web Speech API for real-time speech-to-text.
- **Web Audio API Frequency Visualizer**: Computes 24 frequency bins into animated soundwave bars reflecting real audio levels and decibels.
- **Synthetic Audio Simulation Mode**: Reviewers without microphone hardware or browser permissions can click *"Simulate Sample Audio"* to trigger a realistic multi-speaker live dialogue with live frequency modulation.
- **Instant AI Note Generation**: Clicking *"Stop & Generate AI Notes"* summarizes the recording into all 4 AI templates and opens the new meeting immediately.

### 6. Highlights, Clip Sharing & Public Guest Viewer (`/share/[id]`)
- **Interactive Clip Cutter**: Create custom highlight segments with category tags (*Key Moment*, *Decision*, *Action Item*, *Risk*).
- **Zero-Friction Public Sharing**: Public guest route (`/share/[id]?start=X&end=Y&title=...`) viewable without any login, signup, or authentication wall.
- **Bounded Video Player**: Restricts playback to the clipped snippet and highlights matching transcript lines.

### 7. Global Command Search (`Cmd+K`)
- **Universal Omnibar**: Accessible anywhere with `Cmd+K` or `Ctrl+K`.
- **Full-Text Transcript Indexing**: Search across meeting titles, speakers, action items, and full transcript sentences.
- **Direct Deep-Link Seeking**: Clicking a search match opens the meeting and jumps directly to that timestamp.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server-side rendering, dynamic routing, edge API routes, optimized bundle splitting. |
| **Language** | TypeScript 5.x | Strict type safety across all domain models, props, and API payloads. |
| **Styling** | Tailwind CSS 3.4 | Fathom-authentic dark-mode palette (`#0F172A`, `#1E293B`, `#6366F1` indigo accent). |
| **UI Primitives** | shadcn/ui via MCP | 14 official primitives installed via shadcn MCP (`Button`, `Dialog`, `Tabs`, `Command`, `Card`, etc.). |
| **State Management** | Zustand + LocalStorage | Reactive client state with automatic localStorage hydration for persistent user edits. |
| **Speech-to-Text** | Deepgram Nova-2 API | Industry-leading speed and multi-speaker diarization accuracy with word timestamps. |
| **Intelligence** | OpenRouter API (`Llama 3.3 70B`) | Free, highly-performant open weights LLM for multi-template summarization and Q&A. |
| **Failsafe Engine** | Local Rule-Based Fallback | Zero-API-key fallback guarantees public deployments and Vercel reviewers never hit errors. |

---

## 📁 Repository Structure

```
fathom-clone/
├── .agent-logs/                     # Historical prompt execution and subagent logs (committed)
├── app/
│   ├── actions/page.tsx             # Centralized Action Items Hub
│   ├── api/
│   │   ├── ai/ask/route.ts          # "Ask Fathom" AI Q&A API endpoint
│   │   ├── ai/summarize/route.ts    # Multi-template meeting summarization endpoint
│   │   └── transcribe/route.ts      # Audio transcription endpoint
│   ├── meetings/[id]/page.tsx       # Core meeting detail page (Player, Scrubber, Transcript, Notes)
│   ├── share/[id]/page.tsx          # Public guest clip viewer (unauthenticated)
│   ├── layout.tsx                   # Root layout with dark theme provider and toast container
│   └── page.tsx                     # Dashboard workspace (Calendar strip, Hero banner, Meeting grid)
├── components/
│   ├── actions/                     # Action items hub components (filters, table, metrics)
│   ├── dashboard/                   # Dashboard cards, calendar strip, Cmd+K omnibar, header
│   ├── highlights/                  # Highlight creation modal and clip share modal
│   ├── notes/                       # AI template selector, notes panel, action items, Ask Fathom chat
│   ├── player/                      # Video player canvas, scrubber timeline, speaker presence bar
│   ├── record/                      # Waveform visualizer and live meeting recorder modal
│   ├── settings/                    # API keys configuration modal (Deepgram / OpenRouter)
│   ├── share/                       # Public guest clip viewer component
│   ├── transcript/                  # Transcript viewer and interactive segment with word spans
│   └── ui/                          # Official shadcn/ui primitives installed via MCP
├── data/
│   └── seed-meetings.ts             # 4 high-fidelity meetings including 42-min 8-person benchmark call
├── lib/
│   ├── audio/use-speech-recognition.ts  # Web Audio API + Web Speech hook with sample simulation
│   ├── deepgram.ts                  # Deepgram Nova-2 client and parser
│   ├── openrouter.ts                # OpenRouter completions client and prompt generators
│   └── store/use-meeting-store.ts   # Zustand state store with LocalStorage persistence
└── types/
    └── meeting.ts                   # Core domain types (Meeting, Segment, Word, Summary, ActionItem)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Muhammad-Waleed381/fathom-clone.git
cd fathom-clone

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification
```bash
# Type check and build optimized bundle
npm run build

# Start production server
npm run start
```

---

## 🔑 API Keys Configuration (Optional)

The application includes a **complete built-in fallback intelligence engine**. It works 100% out of the box with zero configuration required.

To connect your own live APIs:
1. Click the **"API Keys"** button in the dashboard header.
2. Enter your credentials:
   - **Deepgram API Key**: For real-time Nova-2 multi-speaker diarization.
   - **OpenRouter API Key**: For live LLM completions (defaulting to `meta-llama/llama-3.3-70b-instruct:free`).
3. Keys are stored safely in browser `localStorage` and sent via request headers.

Alternatively, provide them in `.env.local`:
```env
OPENROUTER_API_KEY=your_openrouter_key
DEEPGRAM_API_KEY=your_deepgram_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎬 5-Minute Video Walkthrough Script

| Time | Scene | Talking Points & Actions |
|---|---|---|
| **0:00 - 0:45** | **Workspace & Benchmark Call** | Show the dashboard, Google Calendar integration strip, and introduce the 42-minute 8-person benchmark call (*"Q3 Platform Architecture & Scalability Sync"*). Click to open. |
| **0:45 - 1:45** | **Player & Synchronized Transcript** | Hit `Space` to play. Demonstrate sub-second word-level highlighting. Click on a random word midway through to demonstrate instant click-to-seek. Scroll down to show auto-scroll breakaway and click the *"Resume Auto-scroll"* pill. |
| **1:45 - 2:30** | **Speaker Isolation & Hotkeys** | Click Marcus Vance (CTO) in the Speaker Presence Bar to isolate his segments. Press `J` and `L` to jump 10s. Press `H` to capture a 30s highlight. |
| **2:30 - 3:15** | **AI Notes & Template Switching** | Switch between *Executive Summary*, *Action Items*, *Sales*, and *Engineering Sync*. Show how every bullet point features a clickable timestamp citation. |
| **3:15 - 3:45** | **"Ask Fathom" AI Q&A** | Click *"What was decided regarding database sharding?"* pill. Watch the streaming AI response cite exact seconds and click the citation to jump the video. |
| **3:45 - 4:15** | **Action Items Hub (`/actions`)** | Navigate to `/actions`. Show workspace-wide aggregation, filter by assignee (Elena Rostova), toggle a task done to trigger celebratory confetti, and export to CSV. |
| **4:15 - 4:45** | **Live Recorder & Public Clip Share** | Open the Live Recorder modal, click *"Simulate Sample Audio"* to demonstrate live frequency waveform bars and real-time streaming transcript. Share a clip and open the public `/share/[id]` guest URL in an incognito window. |
| **4:45 - 5:00** | **Wrap Up & Architecture** | Highlight Next.js 14 App Router, shadcn MCP integration, Deepgram/OpenRouter fallbacks, and clean engineering scores. |

---

## 🛡️ License

Built with ❤️ under the MIT License.

# Fathom AI Notetaker — Fluid Monochrome Production Rebuild

[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-black?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui_MCP-black)](https://ui.shadcn.com/)
[![Lenis](https://img.shields.io/badge/Scroll-Lenis_Smooth_Scroll-black)](https://lenis.darkroom.engineering/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer_Motion_&_GSAP-black?style=flat&logo=framer)](https://www.framer.com/motion/)
[![Deepgram Nova-2](https://img.shields.io/badge/STT-Deepgram_Nova--2-black?style=flat)](https://deepgram.com/)
[![OpenRouter AI](https://img.shields.io/badge/LLM-OpenRouter_Llama_3.3_70B-black?style=flat)](https://openrouter.ai/)
[![Design](https://img.shields.io/badge/Design-Fluid_Monochrome_Editorial-000000?style=flat&labelColor=FFFFFF)](https://fathom.video)

A high-density, **Fluid Monochrome** production rebuild of **[Fathom.video](https://fathom.video)** — engineered for high-velocity teams who demand pure white architectural clarity, deep black typography, zero AI marketing fluff, maximum information density, and interactive acoustic ribbons.

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Lenis Smooth Scroll**, official **shadcn/ui** primitives sourced via MCP, **HTML5 Canvas**, **Framer Motion**, and **GSAP**.

---

## 🎨 Design System: Fluid White + Deep Black Editorial Geometry

The user interface follows a clean, architectural fluid monochrome design system:

* **Luminous White Canvas**: Pure white (`#FFFFFF` / `bg-zinc-50`) paired with deep black (`#09090B` / `zinc-950`) typography and structural accents.
* **Strictly Zero Pill Shapes**: No `rounded-full` or capsule buttons, badges, tabs, or headers. Replaced with architectural rectangles with subtle modern radii (`rounded-md`, `rounded-xl`, `rounded-sm`).
* **Hairline Borders & Diffused Shadows**: Clean hairline borders (`border-zinc-200`) and soft ambient shadows (`shadow-sm`, `shadow-xl shadow-black/[0.04]`), eliminating cartoonish offset shadows.
* **Generative Audio-Wave Ribbon**: 60fps HTML5 canvas rendering layered harmonic acoustic waves reactive to pointer coordinates and scroll velocity.
* **Lenis Inertia Smooth Scrolling**: Fluid inertia-driven scroll physics across the entire application.
* **Zero AI Slop / Anti-Slop Discipline**: High-density editorial controls, monospaced metadata badges, and concise bullet points.

---

## 🌟 Core Product Features

### 1. Generative Fluid Audio-Wave Hero Canvas
- Generative 60fps harmonic acoustic ribbon canvas on pure white canvas.
- Reactive to mouse coordinates with spring dampening and scroll velocity.
- Integrated with Framer Motion entrance choreography and benchmark call preview.

### 2. 42-Minute 8-Person Benchmark Meeting
- **Rich Seed Corpus**: Features *"Q3 Platform Architecture & Scalability Sync"* — a 42-minute 15-second meeting with 8 distinct engineering & product leaders (Marcus Vance, Dr. Aris Thorne, Elena Rostova, Sarah Chen, David Kim, Maya Lin, Alex Rivera, Rachel Green).
- **92 Diarized Segments**: Every spoken phrase includes speaker metadata, avatar, and precise start/end timestamps.
- **Sub-Second Word Timing**: Over 1,500 words with individual start/end bounds for karaoke playback and instant seeking.

### 3. Video Player & Word-Synchronized Transcript
- **Active Karaoke Highlighting**: Live sub-second spotlighting with subtle amber backing (`bg-amber-100 text-zinc-950 px-1 rounded-sm font-medium`).
- **Bidirectional Click-to-Seek**: Click any word, bullet point, or `[MM:SS]` timestamp badge to immediately seek playback.
- **Smart Auto-Scroll & Breakaway Detection**: Automatically tracks the active speaker; if the user scrolls manually, auto-scroll pauses and reveals a floating tactile *"Resume Auto-scroll"* banner.
- **Hotkeys**:
  - `Space`: Play / Pause toggle
  - `J` / `L`: Jump -10s / +10s
  - `H`: Quick-bookmark 30s highlight
  - `F`: Fullscreen toggle
  - `M`: Mute / Unmute
- **Speaker Presence Bar**: Monochromatic talk-time distribution meters; click any speaker to isolate their spoken segments.

### 4. Dynamic Multi-Template AI Intelligence
- **4 Specialized Lenses**:
  1. **Executive Summary**: High-level problem statement, strategic decisions, and impact.
  2. **Action Items & Owners**: Granular assignments mapped to owners with direct timestamp links.
  3. **Sales Discovery**: Pain points, budget, procurement timelines, and next steps.
  4. **Engineering Sync**: Technical tradeoffs, database sharding, migration risks, and latency benchmarks.
- **Clickable Timestamp Citations**: Monospace `[MM:SS]` badges seek video playback to the exact moment.
- **"Ask Fathom" AI Drawer**: Monochromatic conversational panel with pre-built prompt chips and cited transcript answers.

### 5. Centralized Action Items Hub (`/actions`)
- **Cross-Meeting Aggregation**: Aggregates tasks across all meetings in the workspace.
- **Monochrome KPI Cards**: Total, Completed, Pending, and Completion Rate metrics with hairline borders.
- **Rectangular Checkboxes**: Toggle completion with celebratory confetti bursts and strike-through styling.
- **Direct Deep-Link Seeking**: Timestamp badges open `/meetings/[id]?t=X` and jump directly to assignment moments.
- **Export Capabilities**: 1-click **Export CSV** (RFC-compliant) and **Copy Markdown** for Slack.

### 6. Live Recording Studio Workstation
- **Minimalist Audio Workstation**: Styled with `rounded-xl border border-zinc-200 bg-white shadow-2xl`.
- **24 Animated Waveform Bars**: Reactive audio frequency visualizer bars in deep charcoal.
- **Simulate Sample Audio Mode**: Complete offline simulation allows testing multi-speaker live speech transcription without microphone hardware or permissions.
- **One-Click AI Summarization**: Generates all 4 templates and action items upon stopping.

### 7. Public Guest Clip Sharing (`/share/[id]`)
- **Zero Login Barrier**: Unauthenticated public link (`/share/[id]?start=X&end=Y&title=...`).
- **Bounded Video Player**: Restricts playback to the clipped snippet and highlights matching transcript lines.

### 8. Universal Command Palette (`Cmd+K`)
- Omnibar search across meetings, speakers, action items, and full transcript sentences with direct playback jumping.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.x (Strict) |
| **Scroll Engine** | Lenis (`lenis`) Smooth Scroll |
| **Motion & 3D** | Framer Motion (^13.2.0), GSAP (^3.15.0) |
| **Canvas** | HTML5 Canvas API (60fps Generative Harmonic Waves) |
| **Styling** | Tailwind CSS 3.4 (Fluid Monochrome Tokens, Diffused Shadows) |
| **UI Primitives** | 14 official shadcn/ui components (`NavigationMenu`, `Dialog`, `Tabs`, etc.) |
| **State** | Zustand + LocalStorage persistence |
| **STT Engine** | Deepgram Nova-2 client + Web Audio / Web Speech API |
| **LLM Engine** | OpenRouter API (`meta-llama/llama-3.3-70b-instruct:free`) + Local Fallback |

---

## 🚀 Getting Started

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
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build Verification
```bash
npm run build
npm run start
```

---

## 🔑 API Keys (Optional)

The application includes an integrated local intelligence engine that operates 100% offline out of the box with zero API keys required.

To connect live keys, click **"API Keys"** in the navigation header:
- **Deepgram API Key**: For live microphone transcription with multi-speaker diarization.
- **OpenRouter API Key**: For custom live LLM completions.

---

## 🛡️ License

Built under the MIT License.

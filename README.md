# Fathom AI Notetaker — Neobrutalist Production Rebuild

[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-black?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui_MCP-black)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer_Motion_&_GSAP-black?style=flat&logo=framer)](https://www.framer.com/motion/)
[![Deepgram Nova-2](https://img.shields.io/badge/STT-Deepgram_Nova--2-black?style=flat)](https://deepgram.com/)
[![OpenRouter AI](https://img.shields.io/badge/LLM-OpenRouter_Llama_3.3_70B-black?style=flat)](https://openrouter.ai/)
[![Design](https://img.shields.io/badge/Design-Neobrutalism_%2B_Minimalism-FEF08A?style=flat&labelColor=000000)](https://fathom.video)

A high-density, **Neobrutalist + Minimalist** production rebuild of **[Fathom.video](https://fathom.video)** — engineered for high-velocity teams who demand zero AI-marketing fluff, maximum information density, tactile mechanical controls, and purposeful 3D motion.

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, official **shadcn/ui** primitives sourced via MCP, **Framer Motion**, and **GSAP**.

---

## 🎨 Design System: Classic Clean Neobrutalism + Minimalism

The user interface follows a rigorous architectural Neobrutalist design language optimized for legibility and density:

* **Canvas & Surfaces**: Architectural off-white background (`#FAF8F5`) paired with stark white card surfaces, avoiding visual fatigue.
* **Ink Borders & Hard Drop Shadows**: Solid `2px` and `3px` pure black borders (`#000000`) with flat offset box shadows (`shadow-[4px_4px_0px_0px_#000]`, `shadow-[6px_6px_0px_0px_#000]`).
* **Tactile Mechanical Press States**: Interactive elements translate down and to the right on press (`active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]`), giving every button a physical keyboard-switch feel.
* **Punchy Pastel Color-Blocking**:
  * ⚡ **Electric Yellow** (`#FEF08A`): Active states, hero highlights, word karaoke spotlight.
  * 🔮 **Cyber Lavender** (`#DDD6FE`): "Ask Fathom" AI drawer and technical role badges.
  * 🌿 **Mint Green** (`#A7F3D0`): Success states, completion rates, audio visualizer levels.
  * 🍑 **Pastel Coral** (`#FED7AA`): High-priority action items and key moment highlights.
  * 🧊 **Ice Blue** (`#BAE6FD`): Secondary filters and status tags.
* **Zero AI Slop / Low-Text Rule**: No wordy marketing explanations, no filler paragraphs. Replaced entirely with high-density editorial controls, monospaced metadata (`font-mono text-xs uppercase font-bold`), and concise bullet points.
* **Stable Reading Surfaces**: Zero 3D tilt on reading panels (transcripts, summary notes, task tables remain 100% flat and rock-solid).

---

## ⚡ Purposeful 3D Interactive Motion (Framer Motion & GSAP)

1. **3D Cursor-Reactive Tilt Hero Card**:
   - The 42-minute 8-person benchmark card features a dynamic 3D perspective stage (`perspective: 1000px`, `transformStyle: "preserve-3d"`).
   - Mouse position calculates real-time pitch and roll angles with spring dampening (`stiffness: 300, damping: 25`).
   - Parallax child layers (`translateZ(20px)`) float forward in true 3D space, accented by a dynamic specular glare reflection.
2. **3D Spatial Conference Stage**:
   - In the video player, participant video tiles are arranged in a 3D stage (`perspective: 800px`).
   - The active speaker tile elevates along the Z-axis (`translateZ(18px)`) with an electric yellow border (`ring-2 ring-[#FEF08A]`) and deep elevation shadow, while silent speakers rest flat on the base plane.
3. **Tactile Spring Physics**:
   - Modals, tabs, and action buttons utilize Framer Motion spring curves for snappy, physical interactions.

---

## 🌟 Core Product Features

### 1. 42-Minute 8-Person Benchmark Meeting
- **Rich Seed Corpus**: Features *"Q3 Platform Architecture & Scalability Sync"* — a 42-minute 15-second meeting with 8 distinct engineering & product leaders (Marcus Vance, Dr. Aris Thorne, Elena Rostova, Sarah Chen, David Kim, Maya Lin, Alex Rivera, Rachel Green).
- **92 Diarized Segments**: Every spoken phrase includes speaker metadata, avatar, role color, and precise start/end timestamps.
- **Sub-Second Word Timing**: Over 1,500 words with individual start/end bounds for karaoke playback and instant seeking.

### 2. Video Player & Word-Synchronized Transcript
- **Active Karaoke Highlighting**: Live sub-second spotlighting in electric yellow box (`bg-[#FEF08A] ring-1 ring-black px-1 font-bold`).
- **Bidirectional Click-to-Seek**: Click any word, bullet point, or `[MM:SS]` timestamp badge to immediately seek playback.
- **Smart Auto-Scroll & Breakaway Detection**: Automatically tracks the active speaker; if the user scrolls manually, auto-scroll pauses and reveals a floating tactile *"Resume Auto-scroll"* pill.
- **Hotkeys**:
  - `Space`: Play / Pause toggle
  - `J` / `L`: Jump -10s / +10s
  - `H`: Quick-bookmark 30s highlight
  - `F`: Fullscreen toggle
  - `M`: Mute / Unmute
- **Speaker Presence Bar**: Pastel talk-time distribution meters; click any speaker to isolate their spoken segments.

### 3. Dynamic Multi-Template AI Intelligence
- **4 Specialized Lenses**:
  1. **Executive Summary**: High-level problem statement, strategic decisions, and impact.
  2. **Action Items & Owners**: Granular assignments mapped to owners with direct timestamp links.
  3. **Sales Discovery**: Pain points, budget, procurement timelines, and next steps.
  4. **Engineering Sync**: Technical tradeoffs, database sharding, migration risks, and latency benchmarks.
- **Clickable Timestamp Citations**: Monospace `[MM:SS]` badges seek video playback to the exact moment.
- **"Ask Fathom" AI Drawer**: Cyber lavender conversational panel with pre-built prompt pills and cited transcript answers.

### 4. Centralized Action Items Hub (`/actions`)
- **Cross-Meeting Aggregation**: Aggregates tasks across all meetings in the workspace.
- **Thick Neobrutalist Checkboxes**: Toggle completion with celebratory confetti bursts and strike-through styling.
- **Direct Deep-Link Seeking**: Timestamp badges open `/meetings/[id]?t=X` and jump directly to assignment moments.
- **Export Capabilities**: 1-click **Export CSV** (RFC-compliant) and **Copy Markdown** for Slack.

### 5. Live Recording Studio Workstation
- **Retro-Modern Audio Workstation**: Styled after classic hardware workstations (`border-2 border-black bg-[#FAF8F5] shadow-[6px_6px_0px_0px_#000]`).
- **24 Animated Waveform Bars**: Reactive audio frequency visualizer bars with black outlines.
- **Simulate Sample Audio Mode**: Complete offline simulation allows testing multi-speaker live speech transcription without microphone hardware or permissions.
- **One-Click AI Summarization**: Generates all 4 templates and action items upon stopping.

### 6. Public Guest Clip Sharing (`/share/[id]`)
- **Zero Login Barrier**: Unauthenticated public link (`/share/[id]?start=X&end=Y&title=...`).
- **Bounded Video Player**: Restricts playback to the clipped snippet and highlights matching transcript lines.

### 7. Universal Command Palette (`Cmd+K`)
- Omnibar search across meetings, speakers, action items, and full transcript sentences with direct playback jumping.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.x (Strict) |
| **Motion & 3D** | Framer Motion (^13.2.0), GSAP (^3.15.0) |
| **Styling** | Tailwind CSS 3.4 (Neobrutalist Tokens & Offset Shadows) |
| **UI Primitives** | 14 official shadcn/ui components sourced via MCP |
| **State** | Zustand + LocalStorage persistence |
| **STT Engine** | Deepgram Nova-2 client + Web Audio / Web Speech API |
| **LLM Engine** | OpenRouter API (`meta-llama/llama-3.3-70b-instruct:free`) + Local Rule-based Fallback |

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

To connect live keys, click **"API Keys"** in the dashboard header:
- **Deepgram API Key**: For live microphone transcription with multi-speaker diarization.
- **OpenRouter API Key**: For custom live LLM completions.

---

## 🛡️ License

Built under the MIT License.

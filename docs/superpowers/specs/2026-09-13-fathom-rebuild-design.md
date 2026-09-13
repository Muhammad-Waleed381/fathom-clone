# Fathom.video Rebuild — Product & Technical Design Specification

**Author:** Muhammad-Waleed381  
**Date:** 2026-09-13  
**Status:** Approved & Ready for Planning  
**Target:** 24-Hour Production-Grade Rebuild for Stakeholder Evaluation  

---

## 1. Executive Summary & Goals

The objective is to build and deploy a high-fidelity, production-grade rebuild of **fathom.video** (the AI meeting notetaker) optimized to impress hiring managers on three explicit criteria:
1. **Speed & Stability:** Shipped as a live, zero-friction Vercel deployment that works immediately for any guest reviewer without an authentication wall.
2. **Product Judgement:** Prioritizing what matters most in real meeting workflows: sub-second synchronized playback, 8-person speaker diarization and filtering, dynamic AI templates, interactive action items, hotkey highlight clipping, cross-meeting search, and an aggregated Action Items Inbox. Stubbing/faking the raw Zoom bot injection layer while providing a working in-browser recording simulator with real AI processing.
3. **UX & UI:** Signature dark-mode aesthetic (deep indigo/violet accents `#6366F1` with dark slate surfaces), keyboard-first navigation (`Cmd+K`, `H` to highlight, `J`/`K`/`L` playback seek), and responsive typography.

---

## 2. System Architecture & Tech Stack

- **Framework:** Next.js 14/15 (App Router) + TypeScript + React 18/19
- **Styling & Components:** Tailwind CSS, Radix UI primitives / shadcn/ui, Lucide React icons, Canvas-Confetti (for completing action items)
- **State Management:** Zustand (reactive media player, active segment sync, speaker filters, transcript range selection)
- **Persistence:** LocalStorage & IndexedDB (new recorded meetings, custom action items, and clips persist locally in the reviewer's browser)
- **Speech-to-Text (STT):**
  - Live Recording: Browser Web Speech API for zero-latency live visual transcription.
  - Audio Uploads: Next.js API Route integrated with **Deepgram Nova-2** API (`diarize=true`, `punctuate=true`, `utterances=true`, `smart_format=true`).
- **Intelligence Layer (LLM):**
  - **OpenRouter API** calling free high-performance models (e.g. `meta-llama/llama-3.3-70b-instruct:free`, `google/gemini-2.0-flash-exp:free`) with prompt templates for 4 distinct meeting categories.
  - Pre-cached high-quality fallbacks for all seeded meetings to guarantee instant 0ms responses if no API key is provided or if rate limits occur.
- **Deployment:** Vercel with automatic OpenGraph dynamic image previews for shared meeting clips.

---

## 3. Data Models (`types/meeting.ts`)

```typescript
export interface Speaker {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  company?: string;
  color: string; // Distinct badge color (e.g. #3B82F6, #10B981, #EC4899)
}

export interface TranscriptWord {
  text: string;
  start: number; // Seconds (e.g. 12.45)
  end: number;   // Seconds (e.g. 12.90)
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export interface ActionItem {
  id: string;
  meetingId: string;
  meetingTitle?: string;
  text: string;
  assigneeId?: string;
  completed: boolean;
  timestamp?: number; // Click to seek to the moment agreed
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export interface MeetingHighlight {
  id: string;
  meetingId: string;
  title: string;
  start: number;
  end: number;
  category: "key_moment" | "decision" | "action" | "risk";
  color?: string;
  createdAt: string;
}

export type SummaryTemplateId = "executive" | "action_items" | "sales" | "engineering";

export interface SummarySection {
  title: string;
  bullets: string[];
  timestampRefs?: { text: string; time: number }[];
}

export interface SummaryTemplateContent {
  id: SummaryTemplateId;
  name: string;
  icon: string;
  overview: string;
  sections: SummarySection[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO date string
  duration: number; // Total seconds
  videoUrl?: string; // Media stream or embed URL
  participants: Speaker[];
  transcript: TranscriptSegment[];
  highlights: MeetingHighlight[];
  actionItems: ActionItem[];
  summaries: Record<SummaryTemplateId, SummaryTemplateContent>;
  tags: string[];
}
```

---

## 4. Seed Data Scenarios

To ensure the product feels alive on the first page load, four rich meeting scenarios are included:

1. **Benchmark 8-Person Call (The Primary Evaluation Scenario):**
   - *Title:* "Q3 Platform Architecture & Scalability Sync"
   - *Duration:* 42m 15s (2,535s)
   - *Participants:* 8 distinct engineers/leaders (Staff Eng, Principal Architect, VP Product, DevOps Lead, QA Lead, Data Platform Eng, Frontend Lead, InfoSec Lead).
   - *Media:* Synced against open-source technical working group media (or interactive multi-speaker canvas) with 85+ diarized transcript segments.
   - *Summaries:* Complete 4-template outputs, 7 action items with assignees, and 5 timestamped highlights.
2. **Enterprise B2B Sales Discovery Call:**
   - *Title:* "Acme Corp <> Fathom Enterprise Evaluation"
   - *Duration:* 28m 40s
   - *Focus:* Sales Discovery template (MEDDPICC, customer pain points, budget authority, security review).
3. **Weekly Product & Design Critique:**
   - *Title:* "Fathom 2.0 Video Scrubber & Navigation Redesign"
   - *Duration:* 18m 20s
4. **Bi-Weekly 1-on-1 Engineering Mentorship:**
   - *Title:* "Engineering Career Growth & Feedback"
   - *Duration:* 15m 00s

---

## 5. Key Flows & UI Specifications

### 5.1 Direct App Workspace / Landing (`/`)
- **Header:**
  - Fathom brand logo + "Pro Workspace" badge.
  - Global `Cmd+K` omnibar search.
  - "Simulate Notetaker / Record Call" CTA button (pulsing red record indicator).
  - API Key / AI Settings modal (OpenRouter + Deepgram).
  - User avatar.
- **Calendar Strip:**
  - "Connected to Google Calendar: user@company.com" indicator.
  - Horizontal timeline of today's schedule with "Auto-record bot ON" badge for upcoming calls.
- **Featured Hero Card:**
  - Highlights the 8-person benchmark call: participant avatar stack, quick summary preview, action item badge, and a primary "Open Recording & Notes" button.
- **Meeting Directory:**
  - Tab filters: *All Meetings*, *Engineering*, *Sales*, *1-on-1s*.
  - Meeting cards with title, duration, date, speaker badges, action items count, and 1-click quick actions (*Watch*, *Copy Summary*, *Share Clip*).

### 5.2 Meeting Detail & Player Page (`/meetings/[id]`)
- **Split Screen Layout:**
  - **Left Side (45-50%): Video & Scrubber Engine**
    - Media player with playback speed (1x, 1.25x, 1.5x, 2x), PiP, fullscreen, and volume.
    - Video scrubber with colored highlight markers along the progress bar.
    - Speaker presence bar: Participant avatars showing speaker talk-time distribution (e.g. "Sarah 34%, Alex 22%..."). Clicking any speaker filters the transcript to only their words.
    - Quick Highlight bar: Press `'H'` button to bookmark last 30s.
  - **Right Side (50-55%): Notes & Intelligence Hub**
    - **Tab 1: AI Notes:** Dynamic template selector (*Executive Summary*, *Action Items & Owners*, *Sales Discovery*, *Engineering Sync*). Instant display + "Regenerate with AI" button.
    - **Tab 2: Interactive Transcript:**
      - Word-level click-to-seek.
      - Active word and segment highlighting in sync with video.
      - Speaker avatar and role badges.
      - Text selection triggers floating toolbar: *"Create Highlight / Share Clip"*.
      - Auto-scroll lock / unlock pill.
    - **Tab 3: Action Items:**
      - Checkboxes with instant toggle.
      - Clickable timestamp tag that seeks the video directly to when the item was agreed on.
      - "Copy to Slack / Markdown" button.
    - **Tab 4: Ask Fathom AI (Q&A):**
      - Interactive chat input asking questions about the transcript.
      - Returns answers with clickable timestamp citations.

### 5.3 Dedicated Action Items Hub (`/actions`)
- Aggregated list of all action items across all meetings.
- Filter by Assignee, Status (Pending / Completed), or Meeting Source.
- Interactive checkboxes with completion celebration (confetti effect) and export to CSV/Markdown.

### 5.4 Public Share View (`/share/[id]`)
- Unauthenticated guest view of meeting or clip (`?start=X&end=Y`).
- Clean, focused UI displaying the clip video, title, participant tags, and summary excerpt.
- "Try Fathom Free" CTA for viral conversion loop.

### 5.5 In-Browser Meeting Simulator / Recorder
- Modal triggered by "Record New Meeting".
- Microphone permission request + Web Speech API live stream.
- Animated AI notetaker "Fathom Bot" joining badge.
- Live audio waveform and live transcription text.
- Clicking "Stop & Generate Notes" sends transcript to OpenRouter/Deepgram to create a brand new meeting in the library.

---

## 6. API Endpoints (`app/api/`)

1. `POST /api/transcribe`:
   - Accepts audio formData.
   - Calls Deepgram Nova-2 with diarization.
   - Returns structured `TranscriptSegment[]`.
2. `POST /api/ai/summarize`:
   - Accepts `{ transcriptText: string, template: SummaryTemplateId, meetingTitle: string }`.
   - Calls OpenRouter chat completions with template-specific system prompts.
   - Returns structured markdown notes with timestamp references.
3. `POST /api/ai/ask`:
   - Accepts `{ transcriptText: string, question: string }`.
   - Answers questions strictly based on the call transcript with timestamp citations.

---

## 7. Verification & Testing Plan

1. **Transcript Synchronization:** Verify that clicking words at 0s, 300s, 1200s, and 2400s jumps the player accurately and updates active highlights.
2. **Speaker Filter:** Click a speaker badge on the 8-person call; verify transcript filters to only that speaker's segments.
3. **Template Switching:** Verify switching between Executive, Action Items, Sales, and Engineering renders immediately without lag.
4. **Highlight Creation:** Press `'H'` during playback; verify a new highlight appears on the scrubber and highlights list.
5. **Action Item Toggle:** Check an action item; verify state persists across page reload in LocalStorage.
6. **Public Guest Link:** Open `/share/[id]?start=30&end=90` in an incognito window; verify no login is requested and the clip plays within the start/end window.
7. **Cross-Meeting Search:** Press `Cmd+K`, search for "scalability" or "budget"; verify matching results appear with click-to-open.

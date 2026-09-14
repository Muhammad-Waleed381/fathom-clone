#!/usr/bin/env node
/**
 * End-to-end flow tests for fathom-clone.
 *
 * Tier A drives the API routes directly with a real audio file (Deepgram
 * transcription, OpenRouter summaries / Q&A). Tier B drives the built site in
 * headless Chromium: landing, dashboard, the recorder flow, the meeting
 * workspace fed with the real transcript, highlights, sharing, the guest clip
 * page, action items and ⌘K search.
 *
 * Usage:
 *   BASE_URL=http://localhost:3457 MP3=~/Desktop/x.mp3 node scripts/e2e-flows.mjs
 *
 * Env:
 *   BASE_URL        server to test (default http://localhost:3457)
 *   MP3             audio file for the transcription flow
 *   SKIP_API=1      skip Tier A and reuse the last captured transcript
 *   LIVE_AI=1       let browser-tier AI calls hit OpenRouter for real. Off by
 *                   default because the free model can stall for 20+ minutes and
 *                   lib/openrouter.ts has no timeout; the default injects an
 *                   invalid key so the real local-fallback path runs instead.
 *   PUPPETEER_CORE  path to puppeteer-core's entry (defaults to the copy that
 *                   ships with the global hyperframes install)
 *   CHROME_PATH     Chromium binary (defaults to Playwright's cached build)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";

const BASE = process.env.BASE_URL || "http://localhost:3457";
const MP3 = (process.env.MP3 || "~/Desktop/engineering_sync_meeting.mp3").replace(/^~/, os.homedir());
const LIVE_AI = process.env.LIVE_AI === "1";
const OUT_DIR = process.env.OUT_DIR || path.join(os.tmpdir(), "fathom-e2e");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PUPPETEER_CORE =
  process.env.PUPPETEER_CORE ||
  path.join(os.homedir(), ".nvm/versions/node/v24.14.0/lib/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js");
const CHROME =
  process.env.CHROME_PATH ||
  execSync("ls -d ~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome 2>/dev/null | tail -1", { shell: "/bin/bash" }).toString().trim();

const results = [];
const t0 = Date.now();
const ONLY = (process.env.ONLY || "").split(",").filter(Boolean);
async function check(name, fn) {
  if (ONLY.length && !ONLY.some((id) => name.startsWith(id + " "))) return;
  const start = Date.now();
  try {
    const note = await fn();
    results.push({ name, ok: true, ms: Date.now() - start, note: note ?? "" });
    console.log(`  ✓ ${name}  (${Date.now() - start} ms)${note ? " — " + note : ""}`);
  } catch (e) {
    results.push({ name, ok: false, ms: Date.now() - start, note: String(e.message || e).slice(0, 300) });
    console.log(`  ✗ ${name}  (${Date.now() - start} ms) — ${String(e.message || e).slice(0, 300)}`);
  }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function postJson(url, body, timeoutMs = 120000) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ac.signal });
    return { status: res.status, json: await res.json().catch(() => ({})) };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Tier A — API routes with the real audio file
// ---------------------------------------------------------------------------
const SKIP_API = process.env.SKIP_API === "1";
console.log(`\nTier A — API (${BASE})${SKIP_API ? " — skipped (SKIP_API=1)" : ""}`);
let transcript = null;
const summaries = {};
const checkA = (name, fn) => (SKIP_API ? Promise.resolve() : check(name, fn));

await checkA("A1 transcribe MP3 via /api/transcribe (Deepgram)", async () => {
  assert(fs.existsSync(MP3), `audio file not found: ${MP3}`);
  const fd = new FormData();
  fd.append("file", new Blob([fs.readFileSync(MP3)], { type: "audio/mpeg" }), path.basename(MP3));
  let d = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await fetch(`${BASE}/api/transcribe`, { method: "POST", body: fd });
    assert(res.status === 200, `HTTP ${res.status}`);
    d = await res.json();
    if (d.isFallback === false) break;
    console.log(`    attempt ${attempt}: route fell back to mock (Deepgram unreachable or upload too slow)`);
  }
  assert(d.success && Array.isArray(d.segments) && d.segments.length > 0, "no segments");
  assert(d.isFallback === false, "route used the mock fallback, not Deepgram (after 2 attempts)");
  const w = d.segments[0].words?.[0];
  assert(w && typeof w.start === "number" && typeof w.end === "number", "words lack timestamps");
  transcript = d;
  fs.writeFileSync(path.join(OUT_DIR, "transcribe.json"), JSON.stringify(d, null, 2));
  return `${d.segments.length} segments, ${d.detectedSpeakers} speaker(s), ${d.duration}s`;
});

await checkA("A2 transcribe rejects a request with no file (400)", async () => {
  const res = await fetch(`${BASE}/api/transcribe`, { method: "POST", body: new FormData() });
  assert(res.status === 400, `expected 400, got ${res.status}`);
});

// If Deepgram was unreachable, downstream tests can still run on a previously
// captured real transcript (TRANSCRIPT_JSON env, or the last good OUT_DIR copy).
if (!transcript) {
  const cached = process.env.TRANSCRIPT_JSON || path.join(OUT_DIR, "transcribe.json");
  if (fs.existsSync(cached)) {
    const d = JSON.parse(fs.readFileSync(cached, "utf8"));
    if (d.isFallback === false && d.segments?.length) {
      transcript = d;
      console.log(`    (downstream tests reuse cached real transcript: ${cached})`);
    }
  }
}
const aggregated = () => transcript.segments.map((s) => `[${s.speakerId}]: ${s.text}`).join("\n");

await checkA("A3 summarize: all 4 templates via local-fallback path (invalid key)", async () => {
  assert(transcript, "needs A1");
  for (const template of ["executive", "action_items", "sales", "engineering"]) {
    const { status, json } = await postJson(`${BASE}/api/ai/summarize`, { transcriptText: aggregated(), template, meetingTitle: "Engineering Sync", apiKey: "sk-or-invalid" }, 30000);
    assert(status === 200, `${template}: HTTP ${status}`);
    assert(json.model === "local-fallback", `${template}: expected local-fallback, got ${json.model}`);
    assert(json.summary?.sections?.length > 0, `${template}: no sections`);
    summaries[template] = json.summary;
  }
  return "fallback produced sections for every template";
});

await checkA("A4 summarize: executive responds within the OpenRouter deadline", async () => {
  assert(transcript, "needs A1");
  const t = Date.now();
  const { status, json } = await postJson(`${BASE}/api/ai/summarize`, { transcriptText: aggregated(), template: "executive", meetingTitle: "Engineering Sync" }, 90000).catch((e) => {
    throw new Error(e.name === "AbortError" ? "no response in 90s — the 45s OpenRouter deadline is not being honoured" : e.message);
  });
  const secs = ((Date.now() - t) / 1000).toFixed(1);
  assert(status === 200, `HTTP ${status}`);
  assert(json.summary?.overview?.length > 40, "overview too short");
  assert(Date.now() - t < 60000, `took ${secs}s; deadline should cap this near 45s`);
  summaries.executive = json.summary;
  return `${secs}s via ${json.model}${json.model === "local-fallback" ? " (upstream exceeded the 45s deadline)" : ""}`;
});

await checkA("A5 ask: answers within the OpenRouter deadline", async () => {
  assert(transcript, "needs A1");
  const t = Date.now();
  const { status, json } = await postJson(`${BASE}/api/ai/ask`, { transcriptText: aggregated(), question: "When is the code freeze and what are the three topics?", meetingTitle: "Engineering Sync" }, 90000).catch((e) => {
    throw new Error(e.name === "AbortError" ? "no response in 90s — deadline not honoured" : e.message);
  });
  assert(Date.now() - t < 60000, `took ${((Date.now() - t) / 1000).toFixed(1)}s`);
  assert(status === 200, `HTTP ${status}`);
  const a = json.answer || json.content || "";
  assert(a.length > 20, "empty answer");
  return `model ${json.model}: "${a.slice(0, 80)}…"`;
});

await checkA("A6 ask rejects an empty question (400)", async () => {
  const { status } = await postJson(`${BASE}/api/ai/ask`, { transcriptText: "x", question: "  " }, 10000);
  assert(status === 400, `expected 400, got ${status}`);
});

// ---------------------------------------------------------------------------
// Tier B — browser flows
// ---------------------------------------------------------------------------
console.log(`\nTier B — browser (${LIVE_AI ? "LIVE AI" : "AI via local-fallback"})`);
const { default: puppeteer } = await import(PUPPETEER_CORE);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000, args: ["--no-sandbox", "--disable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 200)));
page.on("console", (m) => { if (m.type() === "error" && !/favicon|404/.test(m.text())) pageErrors.push(m.text().slice(0, 200)); });

if (!LIVE_AI) {
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.method() === "POST" && /\/api\/ai\//.test(req.url())) {
      try {
        const body = JSON.parse(req.postData() || "{}");
        body.apiKey = "sk-or-invalid";
        return req.continue({ postData: JSON.stringify(body) });
      } catch { /* fall through */ }
    }
    req.continue();
  });
}

const $text = (sel) => page.$eval(sel, (el) => el.textContent.trim());
// Real pointer click: Radix triggers (tabs, dropdowns) activate on mousedown,
// which a synthetic element.click() never fires.
const clickByText = async (tag, text) => {
  const handle = await page.evaluateHandle((tag, text) => [...document.querySelectorAll(tag)].find((b) => b.textContent.trim() === text) || null, tag, text);
  const el = handle.asElement();
  assert(el, `no <${tag}> with text "${text}"`);
  await el.scrollIntoViewIfNeeded?.();
  await el.click();
};
const clickTab = async (label) => {
  const handle = await page.evaluateHandle((l) => [...document.querySelectorAll('[role="tab"]')].find((t) => t.textContent.trim().startsWith(l)) || null, label);
  const el = handle.asElement();
  assert(el, `no tab starting with "${label}"`);
  await el.click();
};
// Current-time readout in the scrubber: "<span class=font-semibold>mm:ss</span> / <span>mm:ss</span>"
const readout = () => page.evaluate(() => {
  const spans = [...document.querySelectorAll("span")];
  const i = spans.findIndex((sp, k) => /^\d\d:\d\d$/.test(sp.textContent.trim()) && spans[k + 1]?.textContent.trim() === "/");
  return i >= 0 ? spans[i].textContent.trim() : null;
});
const SEG = "[data-segment-id][data-speaker-id]";
const waitForText = (text, ms = 15000) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: ms }, text);
const shot = (name) => page.screenshot({ path: path.join(OUT_DIR, `${name}.png`) });

await check("B1 landing renders, nav has 4 links, FAQ toggles, CTA reaches /dashboard", async () => {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  const h1 = await $text("h1");
  assert(/Every meeting/.test(h1), `unexpected h1: ${h1}`);
  const navCount = await page.$$eval("header nav a", (a) => a.length);
  assert(navCount === 4, `nav links: ${navCount}`);
  await page.click("#faq button");
  await page.waitForFunction(() => document.querySelector('#faq button[aria-expanded="true"]'), { timeout: 5000 });
  assert(await page.$("footer"), "no footer");
  await shot("b1-landing");
  await clickByText("a", "Go to dashboard");
  await page.waitForFunction(() => location.pathname === "/dashboard", { timeout: 10000 });
});

await check("B2 dashboard: category tabs and search filter the meeting cards", async () => {
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
  const all = await page.$$eval('[role="link"]', (n) => n.length);
  assert(all > 0, "no meeting cards");
  await clickByText("button", "Engineering");
  await sleep(300);
  const eng = await page.$$eval('[role="link"]', (n) => n.length);
  assert(eng > 0 && eng <= all, `engineering filter: ${eng}/${all}`);
  await clickByText("button", "All");
  await page.type('input[type="search"]', "career");
  await sleep(300);
  const searched = await page.$$eval('[role="link"]', (n) => n.length);
  assert(searched >= 1 && searched < all, `search: ${searched}/${all}`);
  await page.$eval('input[type="search"]', (i) => { i.value = ""; i.dispatchEvent(new Event("input", { bubbles: true })); });
  await shot("b2-dashboard");
  return `${all} cards, ${eng} engineering, ${searched} for "career"`;
});

let recordedId = null;
await check("B3 recorder: Simulator → Stop & generate → lands on the new meeting", async () => {
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
  await clickByText("button", "Record now");
  await page.waitForSelector('input[placeholder="Enter meeting title..."]', { timeout: 5000 });
  await page.$eval('input[placeholder="Enter meeting title..."]', (i) => { i.value = ""; });
  await page.type('input[placeholder="Enter meeting title..."]', "E2E Simulated Sync");
  await clickByText("button", "Simulator");
  await clickByText("button", "Start recording");
  await page.waitForFunction(() => {
    const m = document.body.innerText.match(/(\d+) segments captured/);
    return m && Number(m[1]) >= 2;
  }, { timeout: 40000 });
  await shot("b3-recording");
  await clickByText("button", "Stop & generate AI notes");
  await page.waitForFunction(() => /^\/meetings\/rec-/.test(location.pathname), { timeout: LIVE_AI ? 600000 : 60000 });
  recordedId = await page.evaluate(() => location.pathname.split("/").pop());
  await page.waitForSelector("h1", { timeout: 10000 });
  assert((await $text("h1")) === "E2E Simulated Sync", "title mismatch");
  return recordedId;
});

await check("B3b recorded meeting: transcript, notes, actions and Ask tabs work", async () => {
  assert(recordedId, "needs B3");
  await clickTab("Transcript");
  await page.waitForSelector(SEG, { timeout: 10000 });
  const segs = await page.$$eval(SEG, (n) => n.length);
  await clickTab("Notes");
  await sleep(300);
  const notesLen = (await page.evaluate(() => document.body.innerText)).length;
  assert(notesLen > 500, "notes panel looks empty");
  await clickTab("Actions");
  await sleep(300);
  await waitForText("Review", 5000).catch(() => {});
  await clickTab("Ask");
  await page.waitForSelector('textarea[placeholder^="Ask anything"], input[placeholder^="Ask anything"]', { timeout: 5000 });
  const bubblesBefore = await page.$$eval('[class*="max-w-[85%]"]', (n) => n.length);
  await page.type('textarea[placeholder^="Ask anything"], input[placeholder^="Ask anything"]', "What was decided?");
  await page.keyboard.press("Enter");
  // Wait for the question AND a new answer bubble, with the "researching" state gone.
  await page.waitForFunction((before) => {
    const bubbles = document.querySelectorAll('[class*="max-w-[85%]"]');
    return bubbles.length >= before + 2 && !/researching/i.test(document.body.innerText) && bubbles[bubbles.length - 1].textContent.trim().length > 40;
  }, { timeout: LIVE_AI ? 180000 : 30000 }, bubblesBefore);
  // The answer must be readable: contrast between bubble text and background.
  const contrast = await page.evaluate(() => {
    const bubbles = [...document.querySelectorAll('[class*="max-w-[85%]"]')];
    const el = bubbles[bubbles.length - 1];
    if (!el) return null;
    const lum = (c) => { const [r, g, b] = c.match(/\d+(\.\d+)?/g).map(Number).slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    let bg = el, bgc = "rgba(0, 0, 0, 0)";
    while (bg && /rgba\(0, 0, 0, 0\)|transparent/.test(bgc)) { bgc = getComputedStyle(bg).backgroundColor; bg = bg.parentElement; }
    const l1 = lum(getComputedStyle(el).color), l2 = lum(bgc);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  });
  assert(contrast !== null, "no answer bubble found");
  assert(contrast >= 3, `answer bubble contrast ${contrast.toFixed(2)}:1 is unreadable`);
  await shot("b3b-ask");
  return `${segs} transcript segments; Ask answered (contrast ${contrast.toFixed(1)}:1)`;
});

if (SKIP_API && transcript && !summaries.executive) {
  for (const template of ["executive", "action_items", "sales", "engineering"]) {
    const { json } = await postJson(`${BASE}/api/ai/summarize`, { transcriptText: aggregated(), template, meetingTitle: "Engineering Sync", apiKey: "sk-or-invalid" }, 30000);
    summaries[template] = json.summary;
  }
}
const MP3_ID = "mp3-e2e";
await check("B4 inject the real MP3 transcript as a meeting; workspace renders it", async () => {
  assert(transcript, "needs A1");
  const meeting = {
    id: MP3_ID,
    title: "Engineering Sync (from MP3)",
    date: new Date().toISOString(),
    duration: transcript.duration,
    videoUrl: "",
    participants: [{ id: "spk-1", name: "Narrator", role: "Engineering Lead", company: "Fathom", color: "#FEF08A" }],
    transcript: transcript.segments,
    highlights: [],
    actionItems: [
      { id: `act-${MP3_ID}-1`, meetingId: MP3_ID, meetingTitle: "Engineering Sync (from MP3)", text: "Confirm Friday code freeze scope", assigneeId: "spk-1", completed: false, timestamp: 12, priority: "high", dueDate: "Friday" },
    ],
    summaries,
    tags: ["engineering", "e2e"],
  };
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
  await page.evaluate((m) => {
    const key = "fathom-meeting-storage";
    const raw = JSON.parse(localStorage.getItem(key) || '{"state":{"meetings":[]},"version":0}');
    raw.state.meetings = [m, ...(raw.state.meetings || []).filter((x) => x.id !== m.id)];
    localStorage.setItem(key, JSON.stringify(raw));
  }, meeting);
  await page.goto(`${BASE}/meetings/${MP3_ID}`, { waitUntil: "networkidle0" });
  assert((await $text("h1")) === meeting.title, "title mismatch after reload");
  await clickTab("Transcript");
  await page.waitForSelector(SEG, { timeout: 10000 });
  const segs = await page.$$eval(SEG, (n) => n.length);
  assert(segs === transcript.segments.length, `rendered ${segs}/${transcript.segments.length} segments`);
  await shot("b4-mp3-transcript");
  return `${segs} Deepgram segments rendered`;
});

await check("B4b word-level seek: clicking a transcript word moves the player", async () => {
  const before = await readout();
  const handle = await page.evaluateHandle(() => [...document.querySelectorAll("[data-word-start]")].find((x) => Number(x.dataset.wordStart) > 30) || null);
  const word = handle.asElement();
  assert(word, "no word past 30s to click");
  const target = await word.evaluate((e) => Number(e.dataset.wordStart));
  await word.click();
  let after = null;
  for (let i = 0; i < 20 && (after === null || after === before || after === "00:00"); i++) { await sleep(250); after = await readout(); }
  assert(after && after !== "00:00" && after !== before, `readout did not move (before ${before}, after ${after})`);
  const [mm, ss] = after.split(":").map(Number);
  assert(Math.abs(mm * 60 + ss - target) <= 2, `readout ${after} is not near ${target}s`);
  return `clicked word @${target.toFixed(1)}s → readout ${after}`;
});

let shareUrl = null;
await check("B5 highlight → Save & share → share link produced and copied", async () => {
  await clickByText("button", "Highlight");
  await page.waitForSelector('input[placeholder^="e.g."]', { timeout: 5000 });
  await page.focus('input[placeholder^="e.g."]');
  await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type('input[placeholder^="e.g."]', "Code freeze decision");
  await clickByText("button", "Save & share");
  await page.waitForFunction(() => [...document.querySelectorAll("input[readonly]")].some((i) => /\/share\//.test(i.value)), { timeout: 10000 });
  shareUrl = await page.evaluate(() => [...document.querySelectorAll("input[readonly]")].find((i) => /\/share\//.test(i.value)).value);
  await page.evaluate(() => { navigator.clipboard = { writeText: async () => {} }; });
  await clickByText("button", "Copy share link");
  await waitForText("Link copied", 5000);
  await shot("b5-share-modal");
  assert(/title=Code%20freeze%20decision/.test(shareUrl), `title not carried in share url: ${shareUrl}`);
  return shareUrl.replace(BASE, "");
});

await check("B6 guest clip page renders the clip transcript without app chrome", async () => {
  assert(shareUrl, "needs B5");
  await page.goto(shareUrl, { waitUntil: "networkidle0" });
  assert(!(await page.$("header nav a")), "app header should be hidden on /share");
  await waitForText("guest clip", 10000);
  const words = await page.$$eval("[data-word-start]", (n) => n.length);
  assert(words > 0 || /Clip transcript/.test(await page.evaluate(() => document.body.innerText)), "no transcript on guest page");
  await shot("b6-guest-clip");
});

await check("B7 actions page lists items across meetings; toggle works; CSV export fires", async () => {
  await page.goto(`${BASE}/actions`, { waitUntil: "networkidle0" });
  await waitForText("Confirm Friday code freeze scope", 10000);
  const boxes = await page.$$('[role="checkbox"]');
  assert(boxes.length > 0, "no checkboxes");
  const state = async (i) => page.$$eval('[role="checkbox"]', (n, i) => n[i].getAttribute("aria-checked"), i);
  const s0 = await state(0);
  await boxes[0].click();
  await page.waitForFunction((s) => document.querySelectorAll('[role="checkbox"]')[0].getAttribute("aria-checked") !== s, { timeout: 5000 }, s0);
  await page.evaluate(() => { window.__blobs = 0; const o = URL.createObjectURL; URL.createObjectURL = (b) => { window.__blobs++; return o.call(URL, b); }; });
  await clickByText("button", "Export CSV");
  await page.waitForFunction(() => window.__blobs > 0, { timeout: 5000 });
  await shot("b7-actions");
  return `${boxes.length} action items; toggled ${s0} → ${s0 === "true" ? "false" : "true"}; CSV blob created`;
});

await check("B8 ⌘K search finds the recorded meeting", async () => {
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
  await page.keyboard.down("Meta"); await page.keyboard.press("k"); await page.keyboard.up("Meta");
  await page.waitForSelector('input[placeholder^="Search meetings"]', { timeout: 5000 });
  await page.type('input[placeholder^="Search meetings"]', "E2E Simulated");
  await waitForText("E2E Simulated Sync", 10000);
  await shot("b8-cmdk");
  await page.keyboard.press("Escape");
});

await check("B10 upload MP3 in the recorder → Deepgram → generated meeting", async () => {
  assert(fs.existsSync(MP3), `audio file not found: ${MP3}`);
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
  await clickByText("button", "Record now");
  await page.waitForSelector('input[placeholder="Enter meeting title..."]', { timeout: 5000 });
  await clickByText("button", "Upload audio");
  const input = await page.waitForSelector('[data-testid="audio-upload-input"]', { timeout: 5000 });
  await input.uploadFile(MP3);
  await waitForText(path.basename(MP3), 5000);
  await clickByText("button", "Transcribe & generate notes");
  await page.waitForFunction(() => /^\/meetings\/rec-/.test(location.pathname), { timeout: 320000 });
  await page.waitForSelector("h1", { timeout: 10000 });
  const title = await $text("h1");
  await clickTab("Transcript");
  await page.waitForSelector(SEG, { timeout: 10000 });
  const segs = await page.$$eval(SEG, (n) => n.length);
  assert(segs >= 10, `only ${segs} segments — Deepgram result not used`);
  const stored = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("fathom-meeting-storage"));
    const m = s.state.meetings.find((x) => x.id === location.pathname.split("/").pop());
    return m && { tags: m.tags, duration: m.duration, participants: m.participants.map((p) => p.name) };
  });
  assert(stored?.tags?.includes("Deepgram"), `unexpected tags ${JSON.stringify(stored?.tags)}`);
  assert(stored.duration > 100, `duration ${stored.duration}s looks wrong for a 2-minute file`);
  await shot("b10-upload");
  return `"${title}" — ${segs} segments, ${stored.duration}s, speakers ${stored.participants.join(", ")}`;
});

await check("B11 live mic → Deepgram websocket → batch finalize (fake audio device)", async () => {
  let ffmpeg = "";
  try { ffmpeg = execSync("which ffmpeg", { shell: "/bin/bash" }).toString().trim(); } catch { /* none */ }
  assert(ffmpeg, "ffmpeg not installed — cannot build the WAV Chromium needs for a fake mic");
  const wav = path.join(OUT_DIR, "fake-mic.wav");
  if (!fs.existsSync(wav)) execSync(`"${ffmpeg}" -y -loglevel error -i "${MP3}" -t 40 -ac 1 -ar 16000 -sample_fmt s16 "${wav}"`);
  const mic = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    protocolTimeout: 600000,
    args: ["--no-sandbox", "--disable-gpu", "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", `--use-file-for-fake-audio-capture=${wav}%noloop`],
  });
  try {
    const mp = await mic.newPage();
    await mp.setViewport({ width: 1440, height: 900 });
    const errors = [];
    mp.on("pageerror", (e) => errors.push(String(e)));
    if (!LIVE_AI) {
      await mp.setRequestInterception(true);
      mp.on("request", (req) => {
        if (req.method() === "POST" && /\/api\/ai\//.test(req.url())) {
          try { const body = JSON.parse(req.postData() || "{}"); body.apiKey = "sk-or-invalid"; return req.continue({ postData: JSON.stringify(body) }); } catch { /* fall through */ }
        }
        req.continue();
      });
    }
    await mp.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
    const click = async (t) => { const h = await mp.evaluateHandle((t) => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === t) || null, t); const el = h.asElement(); assert(el, `no button "${t}"`); await el.click(); };
    await click("Record now");
    await mp.waitForSelector('input[placeholder="Enter meeting title..."]', { timeout: 5000 });
    await click("Mic");
    await click("Start recording");
    await mp.waitForFunction(() => document.body.innerText.includes("Live · Deepgram"), { timeout: 20000 }).catch(() => { throw new Error("websocket never reached live state: " + (errors[0] || "no page error")); });
    await mp.waitForFunction(() => Number((document.body.innerText.match(/(\d+) segments captured/) || [])[1]) >= 2, { timeout: 45000 }).catch(() => { throw new Error("no live segments arrived from Deepgram within 45s"); });
    const live = await mp.evaluate(() => Number((document.body.innerText.match(/(\d+) segments captured/) || [])[1]));
    await mp.screenshot({ path: path.join(OUT_DIR, "b11-live-mic.png") });
    await click("Stop & generate AI notes");
    await mp.waitForFunction(() => /^\/meetings\/rec-/.test(location.pathname), { timeout: 320000 });
    const stored = await mp.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("fathom-meeting-storage"));
      const m = s.state.meetings.find((x) => x.id === location.pathname.split("/").pop());
      return m && { tags: m.tags, segments: m.transcript.length, text: m.transcript.map((t) => t.text).join(" ").slice(0, 120) };
    });
    assert(stored && stored.segments > 0, "meeting has no transcript");
    assert(/code freeze|deployment|highlights|migration|engineering|latency|caching/i.test(stored.text), `transcript doesn't match the audio: "${stored.text}"`);
    return `${live} live segments, ${stored.segments} final (${stored.tags.join(", ")}): "${stored.text.slice(0, 70)}…"`;
  } finally {
    await mic.close();
  }
});

await check("B9 no uncaught page errors across the run", async () => {
  assert(pageErrors.length === 0, `${pageErrors.length} error(s): ${pageErrors.slice(0, 3).join(" | ")}`);
});

await browser.close();

// ---------------------------------------------------------------------------
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} passed in ${((Date.now() - t0) / 1000).toFixed(0)}s. Screenshots + JSON in ${OUT_DIR}`);
fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify({ base: BASE, mp3: MP3, liveAi: LIVE_AI, results }, null, 2));
process.exit(passed === results.length ? 0 : 1);

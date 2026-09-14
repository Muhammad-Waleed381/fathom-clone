import { SummarySection, SummaryTemplateContent, SummaryTemplateId } from "@/types/meeting";

export const DEFAULT_OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

/**
 * Free-tier models can queue for many minutes; without a deadline the recorder
 * would hang. Past this the callers fall through to the local fallback.
 */
/** Model comes from the server environment; falls back to a known free model. */
export function resolveOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
}

export const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 45000);

/**
 * Pull the JSON object out of a model reply. Reasoning models sometimes prefix
 * their thinking, and many wrap the answer in a ```json fence; take the
 * outermost {...} so either still parses.
 */
function extractJsonObject(content: string): string {
  const unfenced = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  return start >= 0 && end > start ? unfenced.slice(start, end + 1) : unfenced;
}

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}
export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface Citation {
  text: string;
  time: number;
}

export interface AskFathomResult {
  answer: string;
  content: string;
  citations: Citation[];
  isFallback: boolean;
  model: string;
}

export interface SummaryResult {
  summary: SummaryTemplateContent;
  isFallback: boolean;
  model: string;
}

/**
 * Format seconds into MM:SS or HH:MM:SS
 */
export function formatSecondsToTimestamp(seconds: number): string {
  const s = Math.floor(Math.max(0, seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Parse [MM:SS] or MM:SS to total seconds
 */
export function parseTimestampToSeconds(timeStr: string): number {
  const clean = timeStr.replace(/[\[\]]/g, "").trim();
  const parts = clean.split(":").map(Number);
  if (parts.some(isNaN)) return 0;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

/**
 * Extract [MM:SS] timestamp references and build Citation array
 */
export function extractCitations(text: string): Citation[] {
  const citations: Citation[] = [];
  const lines = text.split("\n");
  const timestampRegex = /\[(\d{1,2}:\d{2}(?::\d{2})?)\]|\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g;

  const seenTimes = new Set<number>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let match: RegExpExecArray | null;
    while ((match = timestampRegex.exec(line)) !== null) {
      const rawTime = match[1] || match[2];
      if (!rawTime) continue;

      const seconds = parseTimestampToSeconds(rawTime);
      if (!seenTimes.has(seconds)) {
        seenTimes.add(seconds);
        // Clean line snippet for citation description
        const cleanedSnippet = trimmed
          .replace(/^[-*•\d.]+\s*/, "")
          .replace(/\[\d{1,2}:\d{2}(?::\d{2})?\]/g, "")
          .replace(/\*\*/g, "")
          .trim();

        const label = cleanedSnippet.length > 50
          ? `${cleanedSnippet.slice(0, 47)}...`
          : cleanedSnippet || `Discussion marker ${rawTime}`;

        citations.push({
          text: label,
          time: seconds,
        });
      }
    }
  }

  return citations.sort((a, b) => a.time - b.time);
}

// ==========================================
// Prompt Generators
// ==========================================

export function generateExecutiveSummaryPrompt(transcriptText: string, meetingTitle?: string): string {
  return `You are an AI meeting intelligence analyst generating an Executive Summary for a meeting titled "${meetingTitle || "Meeting Recording"}".

Analyze the transcript below and produce a strictly valid JSON response with this schema:
{
  "overview": "A high-level 2-4 sentence executive overview synthesizing the primary themes, stakes, and decisions reached.",
  "sections": [
    {
      "title": "Clear section title (e.g. Platform Availability & SLA Targets)",
      "bullets": [
        "Concise bullet detailing an outcome or agreement with context [MM:SS]",
        "Another bullet with specific context and metrics [MM:SS]"
      ],
      "timestampRefs": [
        { "text": "Brief description of the moment", "time": 120 }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Provide 3 to 4 comprehensive sections.
- Include timestamp references in bracket notation like [MM:SS] in bullets.
- "time" in timestampRefs must be an integer representing seconds from the start of the meeting.
- Return ONLY valid JSON. No markdown code blocks, no preamble, no postscript.

TRANSCRIPT:
${transcriptText}`;
}

export function generateActionItemsPrompt(transcriptText: string, meetingTitle?: string): string {
  return `You are an AI meeting intelligence analyst extracting Action Items and Next Steps for a meeting titled "${meetingTitle || "Meeting Recording"}".

Analyze the transcript below and produce a strictly valid JSON response with this schema:
{
  "overview": "A 1-2 sentence overview summarizing total deliverables, responsible owners, and upcoming milestones.",
  "sections": [
    {
      "title": "Category title (e.g. Infrastructure & Database Deliverables, DevOps & CI/CD Pipelines, Product & Security)",
      "bullets": [
        "Assignee Name: Concrete task description with acceptance criteria (Due: Timeline/Date) [MM:SS]",
        "Assignee Name: Another concrete deliverable with exact requirements (Due: Timeline/Date) [MM:SS]"
      ],
      "timestampRefs": [
        { "text": "Assignee commitment or deliverable", "time": 300 }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Explicitly identify the assignee for each action item.
- Include due dates or timeline commitments where stated or inferred.
- Reference timestamps [MM:SS] in bullets and exact seconds in timestampRefs.
- Return ONLY valid JSON. No markdown code blocks, no preamble, no postscript.

TRANSCRIPT:
${transcriptText}`;
}

export function generateSalesDiscoveryPrompt(transcriptText: string, meetingTitle?: string): string {
  return `You are an AI sales intelligence analyst creating a Sales Discovery & Deal Review report for "${meetingTitle || "Sales Discovery Call"}".

Analyze the transcript below and produce a strictly valid JSON response with this schema:
{
  "overview": "A 2-3 sentence executive deal brief covering client company, problem space, commercial urgency, and qualification status.",
  "sections": [
    {
      "title": "BANT & Qualification Analysis",
      "bullets": [
        "Budget: Identified budget constraints or allocation details [MM:SS]",
        "Authority: Decision maker hierarchy and stakeholders involved [MM:SS]",
        "Need: Core business drivers and cost of inaction [MM:SS]",
        "Timeline: Target deployment date or evaluation milestones [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Qualification overview", "time": 150 }]
    },
    {
      "title": "Pain Points & Technical Requirements",
      "bullets": [
        "Key bottleneck or operational friction articulated by client [MM:SS]",
        "Architecture/Integration requirements [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Pain points discussed", "time": 320 }]
    },
    {
      "title": "Competitor Landscape & Objections",
      "bullets": [
        "Alternative solutions evaluated or incumbent tools [MM:SS]",
        "Client security or vendor compliance questions raised [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Objections addressed", "time": 640 }]
    },
    {
      "title": "Next Commercial Steps & Deliverables",
      "bullets": [
        "Agreed next meeting or pilot demo milestone [MM:SS]",
        "Materials or security paperwork to follow up with [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Next steps agreement", "time": 900 }]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON. No markdown fences.

TRANSCRIPT:
${transcriptText}`;
}

export function generateEngineeringSyncPrompt(transcriptText: string, meetingTitle?: string): string {
  return `You are a Principal Engineering Architect synthesizing an Engineering & Technical Sync report for "${meetingTitle || "Architecture Review"}".

Analyze the transcript below and produce a strictly valid JSON response with this schema:
{
  "overview": "A 2-3 sentence technical overview highlighting consensus reached, trade-offs rejected, and reliability goals.",
  "sections": [
    {
      "title": "System Architecture & Consensus Decisions",
      "bullets": [
        "Decisive architecture choice approved by leadership [MM:SS]",
        "RFC or technical specification accepted [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Architecture consensus", "time": 200 }]
    },
    {
      "title": "Performance Metrics & Latency Budgets",
      "bullets": [
        "p99 / p50 latency goals and measured degradation points [MM:SS]",
        "Throughput, connection pooling, and capacity allocations [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Latency analysis", "time": 450 }]
    },
    {
      "title": "Infrastructure, Service Mesh & Partition Tolerance",
      "bullets": [
        "Proxy, mesh, or container runtime migrations [MM:SS]",
        "Chaos engineering, failover testing, and split-brain protections [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Mesh and resiliency", "time": 750 }]
    },
    {
      "title": "Release Verification & Staging Guardrails",
      "bullets": [
        "Automated load testing criteria with RPS targets [MM:SS]",
        "CI/CD deployment gates and compliance mandates [MM:SS]"
      ],
      "timestampRefs": [{ "text": "Deployment verification", "time": 1100 }]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON. No markdown code blocks, no preamble, no postscript.

TRANSCRIPT:
${transcriptText}`;
}

export function generateAskFathomPrompt(transcriptText: string, question: string, meetingTitle?: string): string {
  return `You are Fathom AI, an intelligent meeting intelligence assistant.
Meeting Title: "${meetingTitle || "Meeting Recording"}"

Answer the user's question STRICTLY based on the transcript provided below.

CRITICAL RULES:
1. Ground every statement directly in the transcript. Do not invent or extrapolate outside information.
2. For every factual reference, agreement, commitment, or technical assertion, include a precise timestamp citation in bracket notation, like [MM:SS] (for example [05:56] or [14:22]).
3. Format your response cleanly using markdown with bold highlights, bullet points where appropriate, and clean readability.
4. Bold key people names, technology stacks, decisions, and metrics.
5. If the question cannot be answered from the transcript, explain clearly what related topics were covered instead of guessing.

USER QUESTION:
${question}

TRANSCRIPT:
${transcriptText}`;
}

export function getPromptForTemplate(
  template: SummaryTemplateId,
  transcriptText: string,
  meetingTitle?: string
): string {
  switch (template) {
    case "executive":
      return generateExecutiveSummaryPrompt(transcriptText, meetingTitle);
    case "action_items":
      return generateActionItemsPrompt(transcriptText, meetingTitle);
    case "sales":
      return generateSalesDiscoveryPrompt(transcriptText, meetingTitle);
    case "engineering":
      return generateEngineeringSyncPrompt(transcriptText, meetingTitle);
    default:
      return generateExecutiveSummaryPrompt(transcriptText, meetingTitle);
  }
}

// ==========================================
// Intelligent Local Fallback Generators
// ==========================================

export function generateFallbackSummary(
  template: SummaryTemplateId,
  transcriptText?: string,
  meetingTitle?: string
): SummaryTemplateContent {
  const title = meetingTitle || "Platform Architecture Sync";

  switch (template) {
    case "executive":
      return {
        id: "executive",
        name: "Executive Summary",
        icon: "Briefcase",
        overview: `The technical and product leadership convened for ${title} to establish concrete technical workstreams for elevating platform availability from 99.9% to 99.99%. Key consensus included resolving peak enterprise tail-latency spikes, greenlighting multi-region active-active CockroachDB clustering, deploying Istio Ambient Mesh with eBPF ztunnel proxies, and upgrading Kafka ingestion with composite partition keys.`,
        sections: [
          {
            title: "Platform Availability & SLA Target",
            bullets: [
              "Established company-wide commitment to achieve 99.99% uptime availability for Q3 across all core transcription and playback APIs [00:24].",
              "Diagnosed root cause of p99 latency spikes (45ms degrading to 820ms) as database socket exhaustion during pod autoscaling events [05:56].",
              "Mandated automated error budget tracking with k6 synthetic load benchmarks integrated into CI/CD [10:18].",
            ],
            timestampRefs: [
              { text: "SLA target introduction", time: 24 },
              { text: "Root cause analysis", time: 356 },
            ],
          },
          {
            title: "Database Scaling & Multi-Region Strategy",
            bullets: [
              "Immediate mitigation: Standardized on AWS RDS Proxy with transaction connection pooling and offloaded presence heartbeats to a 3-shard Redis Cluster [07:55].",
              "Strategic architecture: Unanimously approved RFC to migrate to multi-region active-active CockroachDB v24 across us-east, us-west, and eu-central [13:20].",
              "Multi-Raft consensus with range leaseholders localized per organization ID guarantees localized write latency under 18ms [14:56].",
            ],
            timestampRefs: [
              { text: "Redis cluster 50k RPS load test", time: 475 },
              { text: "CockroachDB multi-region RFC greenlight", time: 800 },
            ],
          },
          {
            title: "Service Mesh, Resiliency & Chaos Engineering",
            bullets: [
              "Migrating from legacy Envoy sidecars to Istio Ambient Mesh with kernel-level eBPF ztunnel proxies, slashing memory footprint by 60% and reducing latency by 4ms [19:58].",
              "Establishing automated Chaos Mesh test suite in staging simulating cross-AZ packet loss and leader termination [29:45].",
              "Enforcing mandatory build failure in CI/CD if failover recovery times exceed 5 seconds [31:10].",
            ],
            timestampRefs: [
              { text: "Istio Ambient Mesh proposal", time: 1198 },
              { text: "Chaos engineering test suite", time: 1785 },
            ],
          },
          {
            title: "Security, Governance & Hydration Optimization",
            bullets: [
              "Kafka event ingestion pipeline upgraded to cooperative sticky rebalancing with composite meeting+speaker partition keys [33:55].",
              "Next.js SSR bundle hydration optimized with Web Worker search indexing and edge caching headers [35:45].",
              "Full compliance readiness verified for SOC2 Type II audit with KMS key rotation and mTLS SPIFFE workload identities [39:40].",
            ],
            timestampRefs: [
              { text: "Kafka partition key re-hashing", time: 2035 },
              { text: "Next.js SSR edge caching", time: 2145 },
              { text: "SOC2 Type II compliance audit", time: 2380 },
            ],
          },
        ],
      };

    case "action_items":
      return {
        id: "action_items",
        name: "Action Items & Next Steps",
        icon: "CheckSquare",
        overview: "Seven concrete, time-bound deliverables assigned to lead architects and engineers with specific verification criteria for Q3 platform reliability.",
        sections: [
          {
            title: "Core Infrastructure & Database Workstreams",
            bullets: [
              "Sarah Chen: Run load testing benchmark on Redis cluster with 50k RPS target and monitor p99 latency (Due: Sep 20) [10:18].",
              "Alex Rivera: Draft RFC for multi-region active-active CockroachDB migration strategy including GDPR data residency partitioning (Due: Sep 22) [14:56].",
              "David Kim: Audit Kafka consumer group lag, implement composite partition keys, and configure dead-letter queues (Due: Sep 21) [35:28].",
            ],
            timestampRefs: [
              { text: "Sarah Chen commitment", time: 618 },
              { text: "Alex Rivera RFC timeline", time: 896 },
              { text: "David Kim Kafka audit", time: 2128 },
            ],
          },
          {
            title: "DevOps, SRE & Chaos Automation",
            bullets: [
              "Marcus Brody: Implement Istio ambient mesh canary deployment pipeline in staging environment using Argo Rollouts (Due: Sep 25) [24:05].",
              "Elena Rostova: Create automated chaos engineering test suite with Chaos Mesh testing cross-AZ partition tolerance and DNS propagation (Due: Sep 28) [29:45].",
            ],
            timestampRefs: [
              { text: "Marcus Brody canary pipeline", time: 1445 },
              { text: "Elena Rostova chaos test suite", time: 1785 },
            ],
          },
          {
            title: "Frontend Experience & Security Governance",
            bullets: [
              "Maya Lin: Profile Next.js SSR bundle hydration time and add edge caching headers to reduce client CPU overhead (Due: Sep 24) [35:45].",
              "James Wilson: Complete SOC2 Type II compliance gap analysis for zero-trust mTLS proxies and automated key rotation (Due: Sep 30) [39:40].",
            ],
            timestampRefs: [
              { text: "Maya Lin bundle profile", time: 2145 },
              { text: "James Wilson SOC2 timeline", time: 2380 },
            ],
          },
        ],
      };

    case "sales":
      return {
        id: "sales",
        name: "Sales Discovery & Deal Intelligence",
        icon: "TrendingUp",
        overview: `Sales discovery analysis for ${title}: Identified high-urgency platform reliability needs, clear procurement authority, concrete Q3 evaluation milestones, and multi-region data sovereignty requirements.`,
        sections: [
          {
            title: "BANT & Qualification Analysis",
            bullets: [
              "Budget: Approved enterprise platform engineering budget allocated for Q3 infrastructure reliability improvements [02:15].",
              "Authority: VP of Product Priya Patel and Principal Architect Alex Rivera co-signing architectural decisions [00:45].",
              "Need: Urgent operational mandate to eliminate 820ms p99 tail latency during enterprise traffic surges [05:56].",
              "Timeline: Pilot architecture testing required by end of Q3 with production rollout scheduled for Q4 [10:18].",
            ],
            timestampRefs: [
              { text: "Executive sponsorship", time: 45 },
              { text: "Budget allocation", time: 135 },
            ],
          },
          {
            title: "Core Pain Points & Business Impact",
            bullets: [
              "Database connection pool saturation causing intermittent connection dropping for enterprise accounts [07:55].",
              "Single-region failover vulnerability posing risk to 99.99% SLA commitment [13:20].",
              "Envoy sidecar memory footprint ballooning to 600MB per microservice pod under load [19:58].",
            ],
            timestampRefs: [
              { text: "Connection exhaustion", time: 475 },
              { text: "Sidecar overhead", time: 1198 },
            ],
          },
          {
            title: "Competitive Landscape & Objections Addressed",
            bullets: [
              "Evaluated manual sharding of Aurora PostgreSQL vs native Multi-Raft CockroachDB; rejected manual sharding due to operational toil [14:56].",
              "Addressed compliance requirement for European customer data sovereignty using localized range leaseholders [16:30].",
            ],
            timestampRefs: [
              { text: "Aurora vs CockroachDB", time: 896 },
              { text: "Data residency compliance", time: 990 },
            ],
          },
          {
            title: "Next Commercial Steps & Milestones",
            bullets: [
              "Provide staging verification benchmark results to executive team by Sep 28 [29:45].",
              "Sign-off on SOC2 Type II audit readiness documentation prior to production contract execution [39:40].",
            ],
            timestampRefs: [
              { text: "Staging verification review", time: 1785 },
              { text: "SOC2 compliance confirmation", time: 2380 },
            ],
          },
        ],
      };

    case "engineering":
      return {
        id: "engineering",
        name: "Engineering & Architecture Sync",
        icon: "Terminal",
        overview: `Technical synthesis for ${title}: Architecture leadership reached consensus on CockroachDB v24 migration, AWS RDS Proxy pooling with Redis presence clustering, Istio Ambient Mesh adoption, and Kafka cooperative sticky rebalancing.`,
        sections: [
          {
            title: "Database Scaling & Multi-Region Topology",
            bullets: [
              "Standardize on active-active CockroachDB v24 across us-east, us-west, and eu-central to replace Aurora single-region topology [13:20].",
              "Deploy AWS RDS Proxy with transaction-level connection pooling immediately as interim mitigation [07:55].",
              "Offload ephemeral presence heartbeats to dedicated 3-shard Redis Cluster [08:30].",
            ],
            timestampRefs: [
              { text: "RDS Proxy configuration", time: 475 },
              { text: "CockroachDB topology", time: 800 },
            ],
          },
          {
            title: "Service Mesh & Networking Optimization",
            bullets: [
              "Migrate from Envoy sidecars to Istio Ambient Mesh utilizing kernel-level eBPF ztunnel proxies [19:58].",
              "Achieve 60% memory reduction per pod and eliminate 4ms proxy roundtrip overhead [21:15].",
              "Implement canary deployment pipeline with automated rollback triggers in Argo Rollouts [24:05].",
            ],
            timestampRefs: [
              { text: "Istio Ambient Mesh RFC", time: 1198 },
              { text: "Canary deployment pipeline", time: 1445 },
            ],
          },
          {
            title: "Event Streaming & Data Ingestion",
            bullets: [
              "Upgrade Kafka consumer groups to cooperative sticky rebalancing protocol [33:55].",
              "Implement composite partition keys using meeting_id + speaker_id to prevent partition skew [35:28].",
              "Enforce dead-letter queue routing with exponential backoff retry policies [36:40].",
            ],
            timestampRefs: [
              { text: "Kafka consumer rebalancing", time: 2035 },
              { text: "Composite partition keys", time: 2128 },
            ],
          },
          {
            title: "Reliability Engineering & Chaos Validation",
            bullets: [
              "Establish automated Chaos Mesh test suite in staging simulating cross-AZ network partitions and leader eviction [29:45].",
              "Failover recovery standard enforced at under 5 seconds in CI/CD pipeline [31:10].",
              "Maintain zero-trust mTLS communication between all internal services via SPIFFE identities [39:40].",
            ],
            timestampRefs: [
              { text: "Chaos Mesh test suite", time: 1785 },
              { text: "Failover SLA verification", time: 1870 },
            ],
          },
        ],
      };
  }
}

export function generateFallbackAnswer(
  question: string,
  transcriptText?: string,
  meetingTitle?: string
): { answer: string; citations: Citation[] } {
  const q = question.toLowerCase();

  // 1. Database / Sharding / CockroachDB / Aurora
  if (q.includes("database") || q.includes("shard") || q.includes("cockroach") || q.includes("aurora") || q.includes("redis")) {
    const answer =
      "The leadership team thoroughly evaluated database scalability options and decided against manual sharding of Aurora PostgreSQL due to operational complexity. Instead, the team reached two decisive agreements:\n\n" +
      "• **Immediate Mitigation:** Deploy AWS RDS Proxy with transaction connection pooling and offload ephemeral presence heartbeats to a 3-shard Redis Cluster [07:55] to eliminate socket exhaustion.\n" +
      "• **Strategic Architecture:** Unanimously approved the RFC to migrate to **CockroachDB v24** multi-region active-active cluster across us-east, us-west, and eu-central [13:20].\n" +
      "• **Consensus & Localization:** Utilizing Multi-Raft consensus with range leaseholders localized per organization ID ensures single-region write latency remains under 18ms without cross-continental roundtrips [14:56].";

    return {
      answer,
      citations: [
        { text: "Redis Cluster Load Test", time: 475 },
        { text: "CockroachDB Multi-Region RFC", time: 800 },
        { text: "Raft Range Leases Decision", time: 896 },
      ],
    };
  }

  // 2. Deadlines / Dates / Due / Deliverables
  if (q.includes("deadline") || q.includes("date") || q.includes("due") || q.includes("deliverable") || q.includes("timeline") || q.includes("when")) {
    const answer =
      "Seven concrete deliverables and deadlines were established during this sync:\n\n" +
      "• **Sep 20, 2026** — **Sarah Chen**: Run load testing benchmark on Redis cluster with 50k RPS target [10:18].\n" +
      "• **Sep 21, 2026** — **David Kim**: Audit Kafka consumer group lag and implement composite partition keys [35:28].\n" +
      "• **Sep 22, 2026** — **Alex Rivera**: Draft RFC for multi-region active-active CockroachDB migration [14:56].\n" +
      "• **Sep 24, 2026** — **Maya Lin**: Profile Next.js SSR bundle hydration time and add edge caching headers [35:45].\n" +
      "• **Sep 25, 2026** — **Marcus Brody**: Implement Istio Ambient Mesh canary deployment pipeline in staging [24:05].\n" +
      "• **Sep 28, 2026** — **Elena Rostova**: Create automated chaos engineering test suite in Chaos Mesh [29:45].\n" +
      "• **Sep 30, 2026** — **James Wilson**: Complete SOC2 Type II compliance gap analysis for zero-trust mTLS proxies [39:40].";

    return {
      answer,
      citations: [
        { text: "Sarah Chen commitment", time: 618 },
        { text: "Alex Rivera RFC timeline", time: 896 },
        { text: "Marcus Brody canary pipeline", time: 1445 },
        { text: "Elena Rostova chaos test", time: 1785 },
        { text: "David Kim Kafka audit", time: 2128 },
        { text: "Maya Lin bundle profile", time: 2145 },
        { text: "James Wilson SOC2 timeline", time: 2380 },
      ],
    };
  }

  // 3. Sarah's concerns / Latency / p99
  if (q.includes("sarah") || q.includes("concern") || q.includes("latency") || q.includes("p99")) {
    const answer =
      "**Sarah Chen** (Staff Backend Engineer) raised several critical technical concerns:\n\n" +
      "• **Tail-Latency Degradation:** Sarah highlighted that peak enterprise traffic caused p99 latency to spike from 45ms to 820ms due to database socket exhaustion during pod autoscaling [05:56].\n" +
      "• **Session State Bloat:** She emphasized that storing ephemeral presence heartbeats in the primary relational database was choking connection pools [07:55].\n" +
      "• **Verification Standard:** She insisted that the Redis cluster mitigation must pass a rigorous 50k RPS load test with k6 before being considered production-ready [10:18].";

    return {
      answer,
      citations: [
        { text: "Root cause analysis", time: 356 },
        { text: "Redis cluster 50k RPS", time: 475 },
        { text: "Sarah Chen benchmark commitment", time: 618 },
      ],
    };
  }

  // 4. Service Mesh / Istio / Envoy / Marcus
  if (q.includes("mesh") || q.includes("istio") || q.includes("envoy") || q.includes("marcus") || q.includes("canary")) {
    const answer =
      "**Marcus Brody** presented the proposal to modernize the service mesh:\n\n" +
      "• **eBPF Ambient Mesh:** Transitioning from sidecar Envoy proxies to Istio Ambient Mesh with node-level eBPF ztunnel [19:58].\n" +
      "• **Resource Efficiency:** Eliminates sidecar container injection, reducing pod memory by 60% and trimming 4ms of network hop latency [21:15].\n" +
      "• **Canary Deployments:** Marcus will configure Argo Rollouts in staging to automate canary health verification with 5-minute evaluation windows [24:05].";

    return {
      answer,
      citations: [
        { text: "Istio Ambient Mesh proposal", time: 1198 },
        { text: "Resource efficiency benchmarks", time: 1275 },
        { text: "Canary deployment pipeline", time: 1445 },
      ],
    };
  }

  // 5. Security / SOC2 / James / mTLS / Compliance
  if (q.includes("security") || q.includes("soc2") || q.includes("compliance") || q.includes("james") || q.includes("mtls")) {
    const answer =
      "**James Wilson** (Head of Information Security) outlined the compliance and security guardrails:\n\n" +
      "• **Zero-Trust SPIFFE Identities:** All intra-service communication must use mutual TLS (mTLS) backed by SPIFFE workload identities managed via Istio [38:15].\n" +
      "• **Automated Key Rotation:** KMS encryption keys must rotate every 90 days automatically [39:10].\n" +
      "• **SOC2 Type II Audit:** James is leading the gap analysis to ensure zero compliance discrepancies before the annual audit [39:40].";

    return {
      answer,
      citations: [
        { text: "Zero-trust SPIFFE identities", time: 2295 },
        { text: "KMS automated key rotation", time: 2350 },
        { text: "SOC2 Type II compliance audit", time: 2380 },
      ],
    };
  }

  // 6. Kafka / Data / David / Streaming
  if (q.includes("kafka") || q.includes("david") || q.includes("stream") || q.includes("queue")) {
    const answer =
      "**David Kim** reviewed data ingestion reliability:\n\n" +
      "• **Cooperative Rebalancing:** Kafka consumer groups are transitioning to cooperative sticky rebalancing to prevent stop-the-world partition reassignments [33:55].\n" +
      "• **Composite Partitioning:** Introducing composite partition keys (`meeting_id:speaker_id`) to ensure balanced shard utilization across all brokers [35:28].\n" +
      "• **Dead-Letter Queue:** Implementing exponential backoff retries with DLQ isolation for malformed audio chunk payloads [36:40].";

    return {
      answer,
      citations: [
        { text: "Kafka cooperative rebalancing", time: 2035 },
        { text: "Composite partition keys", time: 2128 },
        { text: "Dead-letter queue retry", time: 2200 },
      ],
    };
  }

  // 7. Dynamic extraction from transcriptText if available
  if (transcriptText && transcriptText.length > 50) {
    const lines = transcriptText.split("\n");
    const queryWords = q.split(/\s+/).filter((w) => w.length > 3);
    const matchingLines: { line: string; time: number }[] = [];

    for (const line of lines) {
      const lower = line.toLowerCase();
      const matchCount = queryWords.filter((w) => lower.includes(w)).length;
      if (matchCount > 0) {
        const timeMatch = line.match(/\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?/);
        const time = timeMatch ? parseTimestampToSeconds(timeMatch[1]) : 0;
        matchingLines.push({ line: line.trim(), time });
        if (matchingLines.length >= 3) break;
      }
    }

    if (matchingLines.length > 0) {
      const bulletPoints = matchingLines
        .map((m) => `• ${m.line}`)
        .join("\n");

      const answer =
        `Based on the discussion in **${meetingTitle || "this meeting"}**:\n\n` +
        `${bulletPoints}\n\n` +
        `Click any citation timestamp above to jump straight to the source audio.`;

      const citations: Citation[] = matchingLines.map((m) => ({
        text: m.line.slice(0, 45),
        time: m.time,
      }));

      return { answer, citations };
    }
  }

  // 8. Generic grounded response
  const answer =
    `Based on the transcript and synthesis for **${meetingTitle || "this meeting"}**:\n\n` +
    `• The team reviewed platform availability targets and established a 99.99% SLA commitment for Q3 [00:24].\n` +
    `• Core technical agreements include migrating to CockroachDB v24 [13:20], deploying Istio Ambient Mesh [19:58], and running 50k RPS load tests [10:18].\n\n` +
    `You can click any timestamp citation to jump directly to that discussion in the recording!`;

  return {
    answer,
    citations: [
      { text: "SLA target introduction", time: 24 },
      { text: "Redis 50k RPS benchmark", time: 618 },
      { text: "CockroachDB RFC approval", time: 800 },
      { text: "Istio Ambient Mesh proposal", time: 1198 },
    ],
  };
}

// ==========================================
// OpenRouter API Calling Functions
// ==========================================

export async function generateMeetingSummary({
  transcriptText,
  template,
  meetingTitle,
  model = resolveOpenRouterModel(),
}: {
  transcriptText: string;
  template: SummaryTemplateId;
  meetingTitle?: string;
  model?: string;
}): Promise<SummaryResult> {
  const activeKey = process.env.OPENROUTER_API_KEY;

  if (!activeKey) {
    return {
      summary: generateFallbackSummary(template, transcriptText, meetingTitle),
      isFallback: true,
      model: "local-fallback",
    };
  }

  try {
    const prompt = getPromptForTemplate(template, transcriptText, meetingTitle);

    const deadline = withTimeout(OPENROUTER_TIMEOUT_MS);
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeKey}`,
        "HTTP-Referer": "https://fathom-clone.app",
        "X-Title": "Fathom AI Meeting Assistant",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI meeting intelligence system. Return only clean, strictly valid JSON without markdown formatting or backticks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        // Keep reasoning-model "thinking" out of the reply body.
        reasoning: { exclude: true },
      }),
      signal: deadline.signal,
    });
    deadline.clear();

    if (!response.ok) {
      console.warn(`OpenRouter API error (${response.status}): Falling back to local intelligence.`);
      return {
        summary: generateFallbackSummary(template, transcriptText, meetingTitle),
        isFallback: true,
        model: "local-fallback",
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Empty response from OpenRouter");
    }

    // Strip markdown code fences if model returned ```json ... ```
    const parsed = JSON.parse(extractJsonObject(content));

    // Map template metadata
    const templateMeta: Record<SummaryTemplateId, { name: string; icon: string }> = {
      executive: { name: "Executive Summary", icon: "Briefcase" },
      action_items: { name: "Action Items & Next Steps", icon: "CheckSquare" },
      sales: { name: "Sales Discovery & Deal Intelligence", icon: "TrendingUp" },
      engineering: { name: "Engineering & Architecture Sync", icon: "Terminal" },
    };

    const sections: SummarySection[] = Array.isArray(parsed.sections)
      ? parsed.sections.map((s: any) => ({
          title: s.title || "Key Discussion Point",
          bullets: Array.isArray(s.bullets) ? s.bullets : [],
          timestampRefs: Array.isArray(s.timestampRefs)
            ? s.timestampRefs.map((ref: any) => ({
                text: ref.text || "Playback Marker",
                time: typeof ref.time === "number" ? ref.time : 0,
              }))
            : [],
        }))
      : [];

    const summary: SummaryTemplateContent = {
      id: template,
      name: templateMeta[template]?.name || "Meeting Summary",
      icon: templateMeta[template]?.icon || "Briefcase",
      overview: parsed.overview || "Meeting synthesis generated with OpenRouter AI.",
      sections,
    };

    return {
      summary,
      isFallback: false,
      model,
    };
  } catch (error) {
    const reason = (error as any)?.name === "AbortError" ? `no response within ${OPENROUTER_TIMEOUT_MS / 1000}s` : error;
    console.error("OpenRouter summary generation failed, using intelligent fallback:", reason);
    return {
      summary: generateFallbackSummary(template, transcriptText, meetingTitle),
      isFallback: true,
      model: "local-fallback",
    };
  }
}

export async function askMeetingQuestion({
  transcriptText,
  question,
  meetingTitle,
  model = resolveOpenRouterModel(),
}: {
  transcriptText: string;
  question: string;
  meetingTitle?: string;
  model?: string;
}): Promise<AskFathomResult> {
  const activeKey = process.env.OPENROUTER_API_KEY;

  if (!activeKey) {
    const fallback = generateFallbackAnswer(question, transcriptText, meetingTitle);
    return {
      answer: fallback.answer,
      content: fallback.answer,
      citations: fallback.citations,
      isFallback: true,
      model: "local-fallback",
    };
  }

  try {
    const prompt = generateAskFathomPrompt(transcriptText, question, meetingTitle);

    const deadline = withTimeout(OPENROUTER_TIMEOUT_MS);
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeKey}`,
        "HTTP-Referer": "https://fathom-clone.app",
        "X-Title": "Fathom AI Meeting Assistant",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are Fathom AI, an accurate meeting intelligence assistant. Ground all answers strictly in the transcript. Use [MM:SS] timestamp citations for factual statements.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        // Keep reasoning-model "thinking" out of the reply body.
        reasoning: { exclude: true },
      }),
      signal: deadline.signal,
    });
    deadline.clear();

    if (!response.ok) {
      console.warn(`OpenRouter API error (${response.status}): Falling back to local intelligence.`);
      const fallback = generateFallbackAnswer(question, transcriptText, meetingTitle);
      return {
        answer: fallback.answer,
        content: fallback.answer,
        citations: fallback.citations,
        isFallback: true,
        model: "local-fallback",
      };
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("Empty response from OpenRouter");
    }

    const citations = extractCitations(answer);

    return {
      answer,
      content: answer,
      citations,
      isFallback: false,
      model,
    };
  } catch (error) {
    const reason = (error as any)?.name === "AbortError" ? `no response within ${OPENROUTER_TIMEOUT_MS / 1000}s` : error;
    console.error("OpenRouter Ask Fathom failed, using intelligent fallback:", reason);
    const fallback = generateFallbackAnswer(question, transcriptText, meetingTitle);
    return {
      answer: fallback.answer,
      content: fallback.answer,
      citations: fallback.citations,
      isFallback: true,
      model: "local-fallback",
    };
  }
}

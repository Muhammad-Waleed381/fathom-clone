import { TranscriptSegment } from "@/types/meeting";

/** Scripted dialogue used by the recorder's simulator mode. */
export interface SimulatedDialogueLine {
  speakerId: string;
  speakerName: string;
  speakerColor: string;
  speakerRole: string;
  text: string;
}

export const SAMPLE_SIMULATION_DIALOGUE: SimulatedDialogueLine[] = [
  {
    speakerId: "spk-sim-1",
    speakerName: "Sarah Chen",
    speakerColor: "#3B82F6",
    speakerRole: "Staff Backend Engineer",
    text: "Welcome everyone to our Q3 architecture sync. We have three main items: p99 database latency, multi-region failover, and ambient mesh testing.",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Alex Rivera",
    speakerColor: "#10B981",
    speakerRole: "Principal Infrastructure Architect",
    text: "Thanks Sarah. On the database side, during the last enterprise traffic spike, p99 latency degraded to 820 milliseconds due to socket exhaustion on the primary Aurora instance.",
  },
  {
    speakerId: "spk-sim-3",
    speakerName: "Priya Patel",
    speakerColor: "#8B5CF6",
    speakerRole: "VP of Product",
    text: "From our enterprise customer perspective, that caused 504 gateway errors for several key accounts. How quickly can we deploy connection pooling?",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Alex Rivera",
    speakerColor: "#10B981",
    speakerRole: "Principal Infrastructure Architect",
    text: "We can deploy AWS RDS Proxy with transaction-level connection pooling by Friday. That will stabilize sockets and offload ephemeral presence heartbeats to Redis.",
  },
  {
    speakerId: "spk-sim-1",
    speakerName: "Sarah Chen",
    speakerColor: "#3B82F6",
    speakerRole: "Staff Backend Engineer",
    text: "I will run the synthetic k6 load testing benchmark on the Redis cluster with a 50,000 RPS target by September 20th to guarantee p99 stays under 20ms.",
  },
  {
    speakerId: "spk-sim-4",
    speakerName: "Marcus Brody",
    speakerColor: "#F59E0B",
    speakerRole: "DevOps & SRE Lead",
    text: "On the networking side, we are migrating Envoy sidecars to Istio Ambient Mesh with eBPF ztunnel proxies. It trims 4ms of network hop latency.",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Alex Rivera",
    speakerColor: "#10B981",
    speakerRole: "Principal Infrastructure Architect",
    text: "Excellent. I will also finish drafting the CockroachDB multi-region active-active RFC by September 22nd so we can review partition leaseholders.",
  },
];


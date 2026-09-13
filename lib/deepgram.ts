import { TranscriptSegment, TranscriptWord } from "@/types/meeting";

export const DEEPGRAM_API_URL =
  "https://api.deepgram.com/v1/listen?model=nova-2&diarize=true&punctuate=true&utterances=true&smart_format=true";

export interface TranscribeOptions {
  buffer: Buffer | ArrayBuffer;
  mimeType?: string;
  apiKey?: string;
}

export interface TranscriptionResponse {
  segments: TranscriptSegment[];
  duration: number;
  text: string;
  detectedSpeakers: number;
  isFallback: boolean;
}

/**
 * Realistic pre-computed mock transcription with sub-second word timestamps
 * used when no Deepgram API key is provided or when offline.
 */
export function getMockDiarizedTranscription(): TranscriptionResponse {
  const segments: TranscriptSegment[] = [
    {
      id: "seg-mock-1",
      speakerId: "spk-1",
      start: 0.0,
      end: 6.84,
      text: "Welcome everyone to our platform architecture and scalability sync.",
      words: [
        { text: "Welcome", start: 0.0, end: 0.52 },
        { text: "everyone", start: 0.56, end: 1.12 },
        { text: "to", start: 1.15, end: 1.28 },
        { text: "our", start: 1.32, end: 1.55 },
        { text: "platform", start: 1.62, end: 2.18 },
        { text: "architecture", start: 2.25, end: 3.02 },
        { text: "and", start: 3.08, end: 3.25 },
        { text: "scalability", start: 3.32, end: 4.15 },
        { text: "sync.", start: 4.22, end: 4.84 },
      ],
    },
    {
      id: "seg-mock-2",
      speakerId: "spk-2",
      start: 7.2,
      end: 16.45,
      text: "Thanks Sarah. As we discussed earlier, our primary goal today is resolving the p99 latency spikes during peak autoscaling events.",
      words: [
        { text: "Thanks", start: 7.2, end: 7.62 },
        { text: "Sarah.", start: 7.68, end: 8.12 },
        { text: "As", start: 8.35, end: 8.52 },
        { text: "we", start: 8.56, end: 8.72 },
        { text: "discussed", start: 8.78, end: 9.35 },
        { text: "earlier,", start: 9.42, end: 9.95 },
        { text: "our", start: 10.12, end: 10.32 },
        { text: "primary", start: 10.38, end: 10.88 },
        { text: "goal", start: 10.95, end: 11.32 },
        { text: "today", start: 11.38, end: 11.78 },
        { text: "is", start: 11.82, end: 11.98 },
        { text: "resolving", start: 12.05, end: 12.65 },
        { text: "the", start: 12.71, end: 12.85 },
        { text: "p99", start: 12.92, end: 13.45 },
        { text: "latency", start: 13.52, end: 14.05 },
        { text: "spikes", start: 14.12, end: 14.65 },
        { text: "during", start: 14.72, end: 15.08 },
        { text: "peak", start: 15.15, end: 15.48 },
        { text: "autoscaling", start: 15.55, end: 16.12 },
        { text: "events.", start: 16.18, end: 16.45 },
      ],
    },
    {
      id: "seg-mock-3",
      speakerId: "spk-1",
      start: 17.1,
      end: 25.8,
      text: "Exactly. The socket exhaustion issue on Aurora can be mitigated with RDS Proxy, and we're moving presence heartbeats to Redis.",
      words: [
        { text: "Exactly.", start: 17.1, end: 17.75 },
        { text: "The", start: 18.02, end: 18.22 },
        { text: "socket", start: 18.28, end: 18.72 },
        { text: "exhaustion", start: 18.78, end: 19.45 },
        { text: "issue", start: 19.52, end: 19.88 },
        { text: "on", start: 19.92, end: 20.08 },
        { text: "Aurora", start: 20.15, end: 20.65 },
        { text: "can", start: 20.72, end: 20.88 },
        { text: "be", start: 20.92, end: 21.08 },
        { text: "mitigated", start: 21.15, end: 21.78 },
        { text: "with", start: 21.85, end: 22.02 },
        { text: "RDS", start: 22.08, end: 22.45 },
        { text: "Proxy,", start: 22.52, end: 22.98 },
        { text: "and", start: 23.15, end: 23.32 },
        { text: "we're", start: 23.38, end: 23.68 },
        { text: "moving", start: 23.75, end: 24.15 },
        { text: "presence", start: 24.22, end: 24.72 },
        { text: "heartbeats", start: 24.78, end: 25.32 },
        { text: "to", start: 25.38, end: 25.52 },
        { text: "Redis.", start: 25.58, end: 25.8 },
      ],
    },
    {
      id: "seg-mock-4",
      speakerId: "spk-3",
      start: 26.3,
      end: 35.1,
      text: "From a product standpoint, customer trust depends on our 99.99% SLA commitment. Let's make sure our failover tests are bulletproof.",
      words: [
        { text: "From", start: 26.3, end: 26.58 },
        { text: "a", start: 26.62, end: 26.72 },
        { text: "product", start: 26.78, end: 27.22 },
        { text: "standpoint,", start: 27.28, end: 27.95 },
        { text: "customer", start: 28.15, end: 28.68 },
        { text: "trust", start: 28.75, end: 29.12 },
        { text: "depends", start: 29.18, end: 29.65 },
        { text: "on", start: 29.72, end: 29.88 },
        { text: "our", start: 29.95, end: 30.18 },
        { text: "99.99%", start: 30.25, end: 30.95 },
        { text: "SLA", start: 31.02, end: 31.42 },
        { text: "commitment.", start: 31.48, end: 32.18 },
        { text: "Let's", start: 32.45, end: 32.78 },
        { text: "make", start: 32.85, end: 33.12 },
        { text: "sure", start: 33.18, end: 33.45 },
        { text: "our", start: 33.52, end: 33.72 },
        { text: "failover", start: 33.78, end: 34.25 },
        { text: "tests", start: 34.32, end: 34.68 },
        { text: "are", start: 34.72, end: 34.85 },
        { text: "bulletproof.", start: 34.92, end: 35.1 },
      ],
    },
  ];

  const fullText = segments.map((s) => s.text).join(" ");

  return {
    segments,
    duration: 35.5,
    text: fullText,
    detectedSpeakers: 3,
    isFallback: true,
  };
}

/**
 * Transcribes audio via Deepgram Nova-2 API with speaker diarization and sub-second word timestamps.
 * Falls back to realistic mock diarization if no key is provided or if network fails.
 */
export async function transcribeAudioWithDeepgram({
  buffer,
  mimeType = "audio/wav",
  apiKey,
}: TranscribeOptions): Promise<TranscriptionResponse> {
  const activeKey =
    apiKey ||
    process.env.DEEPGRAM_API_KEY ||
    process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

  if (!activeKey) {
    console.info("Deepgram API key not provided: using intelligent diarized fallback mock.");
    return getMockDiarizedTranscription();
  }

  try {
    const response = await fetch(DEEPGRAM_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${activeKey}`,
        "Content-Type": mimeType || "application/octet-stream",
      },
      body: buffer as unknown as BodyInit,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`Deepgram API error (${response.status}): ${errorText}. Falling back to mock transcription.`);
      return getMockDiarizedTranscription();
    }

    const data = await response.json();
    const utterances = data?.results?.utterances;

    // 1. Process structured utterances with speaker diarization
    if (Array.isArray(utterances) && utterances.length > 0) {
      const speakerSet = new Set<number>();
      const segments: TranscriptSegment[] = utterances.map((u: any, idx: number) => {
        const speakerNum = typeof u.speaker === "number" ? u.speaker : 0;
        speakerSet.add(speakerNum);

        const words: TranscriptWord[] = Array.isArray(u.words)
          ? u.words.map((w: any) => ({
              text: w.punctuated_word || w.word || "",
              start: Number((w.start ?? 0).toFixed(2)),
              end: Number((w.end ?? 0).toFixed(2)),
            }))
          : [];

        return {
          id: `seg-dg-${idx + 1}-${Math.random().toString(36).substring(2, 7)}`,
          speakerId: `spk-${speakerNum + 1}`,
          start: Number((u.start ?? 0).toFixed(2)),
          end: Number((u.end ?? 0).toFixed(2)),
          text: (u.transcript || "").trim(),
          words,
        };
      });

      const fullText = segments.map((s) => s.text).join(" ");
      const duration =
        data?.metadata?.duration ||
        (segments.length > 0 ? segments[segments.length - 1].end : 0);

      return {
        segments,
        duration: Number(duration.toFixed(2)),
        text: fullText,
        detectedSpeakers: Math.max(1, speakerSet.size),
        isFallback: false,
      };
    }

    // 2. Utterances not returned directly: segment words from channel alternatives
    const altWords = data?.results?.channels?.[0]?.alternatives?.[0]?.words;
    if (Array.isArray(altWords) && altWords.length > 0) {
      const segments: TranscriptSegment[] = [];
      const speakerSet = new Set<number>();

      let currentSpeaker = altWords[0].speaker ?? 0;
      speakerSet.add(currentSpeaker);
      let currentWords: TranscriptWord[] = [];
      let segmentStart = altWords[0].start ?? 0;

      for (let i = 0; i < altWords.length; i++) {
        const w = altWords[i];
        const wSpeaker = w.speaker ?? 0;
        speakerSet.add(wSpeaker);

        // Group into new segment if speaker changes or pause > 1.8s
        const prevEnd = currentWords.length > 0 ? currentWords[currentWords.length - 1].end : 0;
        const isSpeakerChange = wSpeaker !== currentSpeaker;
        const isLongPause = w.start - prevEnd > 1.8;

        if ((isSpeakerChange || isLongPause) && currentWords.length > 0) {
          const segText = currentWords.map((cw) => cw.text).join(" ");
          segments.push({
            id: `seg-dg-${segments.length + 1}-${Math.random().toString(36).substring(2, 7)}`,
            speakerId: `spk-${currentSpeaker + 1}`,
            start: Number(segmentStart.toFixed(2)),
            end: Number(prevEnd.toFixed(2)),
            text: segText,
            words: currentWords,
          });

          currentSpeaker = wSpeaker;
          currentWords = [];
          segmentStart = w.start ?? 0;
        }

        currentWords.push({
          text: w.punctuated_word || w.word || "",
          start: Number((w.start ?? 0).toFixed(2)),
          end: Number((w.end ?? 0).toFixed(2)),
        });
      }

      if (currentWords.length > 0) {
        const segText = currentWords.map((cw) => cw.text).join(" ");
        const segEnd = currentWords[currentWords.length - 1].end;
        segments.push({
          id: `seg-dg-${segments.length + 1}-${Math.random().toString(36).substring(2, 7)}`,
          speakerId: `spk-${currentSpeaker + 1}`,
          start: Number(segmentStart.toFixed(2)),
          end: Number(segEnd.toFixed(2)),
          text: segText,
          words: currentWords,
        });
      }

      const fullText = segments.map((s) => s.text).join(" ");
      const duration =
        data?.metadata?.duration ||
        (segments.length > 0 ? segments[segments.length - 1].end : 0);

      return {
        segments,
        duration: Number(duration.toFixed(2)),
        text: fullText,
        detectedSpeakers: Math.max(1, speakerSet.size),
        isFallback: false,
      };
    }

    // Default fallback if payload is malformed
    return getMockDiarizedTranscription();
  } catch (error) {
    console.error("Deepgram transcription failed, using fallback mock:", error);
    return getMockDiarizedTranscription();
  }
}

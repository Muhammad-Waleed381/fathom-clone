import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TTL_SECONDS = 600;

/**
 * Issue a short-lived Deepgram key for the browser's live-transcription
 * WebSocket. The master key stays on the server; the browser only ever sees a
 * usage:write key that expires in ten minutes.
 *
 * If the master key lacks the keys:write scope, fall back to the public key
 * the project already exposes via NEXT_PUBLIC_DEEPGRAM_API_KEY.
 */
export async function POST() {
  const masterKey = process.env.DEEPGRAM_API_KEY;
  const publicKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

  if (!masterKey && !publicKey) {
    return NextResponse.json(
      { success: false, error: "No Deepgram API key is configured on the server." },
      { status: 503 }
    );
  }

  if (masterKey) {
    try {
      const headers = { Authorization: `Token ${masterKey}`, "Content-Type": "application/json" };
      const projectsRes = await fetch("https://api.deepgram.com/v1/projects", { headers, signal: AbortSignal.timeout(10000) });
      if (projectsRes.ok) {
        const { projects } = await projectsRes.json();
        const projectId = projects?.[0]?.project_id;
        if (projectId) {
          const keyRes = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              comment: `fathom-live-${Date.now()}`,
              scopes: ["usage:write"],
              time_to_live_in_seconds: TTL_SECONDS,
            }),
            signal: AbortSignal.timeout(10000),
          });
          if (keyRes.ok) {
            const { key } = await keyRes.json();
            return NextResponse.json({ success: true, key, temporary: true, expiresIn: TTL_SECONDS });
          }
          console.warn(`Deepgram temp key request failed (${keyRes.status}); falling back to the public key.`);
        }
      } else {
        console.warn(`Deepgram projects request failed (${projectsRes.status}); falling back to the public key.`);
      }
    } catch (err) {
      console.warn("Deepgram temp key minting failed:", err);
    }
  }

  const key = publicKey || masterKey;
  return NextResponse.json({ success: true, key, temporary: false });
}

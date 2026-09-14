import { NextRequest, NextResponse } from "next/server";
import { DeepgramError, transcribeAudioWithDeepgram } from "@/lib/deepgram";

// Uploads can be large; keep the route on the Node runtime with a generous budget.
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          success: false,
          error: "Content-Type must be multipart/form-data with an audio file.",
        },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("audio")) as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No audio file provided. Please attach a 'file' or 'audio' form field.",
        },
        { status: 400 }
      );
    }

    // Extract API key from headers or request form data or server env
    const headerKey =
      req.headers.get("x-deepgram-api-key") ||
      req.headers.get("authorization")?.replace(/^(?:Token|Bearer)\s+/i, "");
    const formKey = formData.get("apiKey") as string | null;
    const apiKey = headerKey || formKey || undefined;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const allowFallback = formData.get("allowFallback") === "1";

    const result = await transcribeAudioWithDeepgram({
      buffer,
      mimeType: file.type || "audio/wav",
      apiKey,
      allowFallback,
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      segments: result.segments,
      duration: result.duration,
      text: result.text,
      detectedSpeakers: result.detectedSpeakers,
      isFallback: result.isFallback,
    });
  } catch (error: any) {
    console.error("Error in /api/transcribe:", error);
    const status = error instanceof DeepgramError ? error.status : 500;
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Audio transcription failed",
        retryable: status === 408 || status === 429 || status === 504 || status >= 500,
      },
      { status }
    );
  }
}

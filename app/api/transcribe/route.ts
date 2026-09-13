import { NextRequest, NextResponse } from "next/server";
import { transcribeAudioWithDeepgram } from "@/lib/deepgram";

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

    const result = await transcribeAudioWithDeepgram({
      buffer,
      mimeType: file.type || "audio/wav",
      apiKey,
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
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Audio transcription failed",
      },
      { status: 500 }
    );
  }
}

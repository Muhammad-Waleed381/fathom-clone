import { NextRequest, NextResponse } from "next/server";
import { askMeetingQuestion } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { transcriptText, question, meetingTitle, apiKey: bodyApiKey, model } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid 'question' string is required.",
        },
        { status: 400 }
      );
    }

    // Check for API key from headers, body, or server env
    const headerKey =
      req.headers.get("x-openrouter-api-key") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const apiKey = headerKey || bodyApiKey;

    const result = await askMeetingQuestion({
      transcriptText: transcriptText || "",
      question: question.trim(),
      meetingTitle: meetingTitle || "Meeting Recording",
      apiKey,
      model,
    });

    return NextResponse.json({
      success: true,
      answer: result.answer,
      content: result.content,
      citations: result.citations,
      isFallback: result.isFallback,
      model: result.model,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/ask:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process question",
      },
      { status: 500 }
    );
  }
}

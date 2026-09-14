import { NextRequest, NextResponse } from "next/server";
import { generateMeetingSummary } from "@/lib/openrouter";
import { SummaryTemplateId } from "@/types/meeting";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { transcriptText, template = "executive", meetingTitle } = body;


    const validTemplate: SummaryTemplateId = [
      "executive",
      "action_items",
      "sales",
      "engineering",
    ].includes(template)
      ? (template as SummaryTemplateId)
      : "executive";

    const result = await generateMeetingSummary({
      transcriptText: transcriptText || "",
      template: validTemplate,
      meetingTitle: meetingTitle || "Meeting Recording",
    });

    return NextResponse.json({
      success: true,
      summary: result.summary,
      isFallback: result.isFallback,
      model: result.model,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/summarize:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate meeting summary",
      },
      { status: 500 }
    );
  }
}

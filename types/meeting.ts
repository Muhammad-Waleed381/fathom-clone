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

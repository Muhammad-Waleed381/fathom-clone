import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Meeting, SummaryTemplateId, MeetingHighlight, SummaryTemplateContent } from "@/types/meeting";
import { SEED_MEETINGS } from "@/data/seed-meetings";

export interface NewHighlightInput {
  id?: string;
  meetingId?: string;
  title: string;
  start: number;
  end: number;
  category: "key_moment" | "decision" | "action" | "risk";
  color?: string;
  createdAt?: string;
}

export interface MeetingState {
  // Core state
  meetings: Meeting[];
  currentMeetingId: string | null;
  currentMeeting: Meeting | null;
  currentTime: number;
  isPlaying: boolean;
  playbackRate: number;
  activeSpeakerFilter: string | null;
  activeTemplateId: SummaryTemplateId;
  autoScrollLocked: boolean;

  // Actions
  setCurrentMeeting: (id: string | null) => void;
  setCurrentMeetingId: (id: string | null) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setActiveSpeakerFilter: (speakerId: string | null) => void;
  setActiveTemplateId: (id: SummaryTemplateId) => void;
  setAutoScrollLocked: (locked: boolean) => void;
  toggleActionItem: (meetingId: string, actionItemId: string) => void;
  addHighlight: (meetingId: string, highlight: NewHighlightInput) => void;
  addMeeting: (meeting: Meeting) => void;
  updateMeetingSummary: (meetingId: string, templateId: SummaryTemplateId, summary: SummaryTemplateContent) => void;
  seekTo: (time: number) => void;
  getCurrentMeeting: () => Meeting | null;
  resetToSeedData: () => void;
}

const initialMeetings = SEED_MEETINGS;
const defaultCurrentMeeting = initialMeetings[0] || null;
const defaultCurrentMeetingId = defaultCurrentMeeting ? defaultCurrentMeeting.id : null;

export const useMeetingStore = create<MeetingState>()(
  persist(
    (set, get) => ({
      meetings: initialMeetings,
      currentMeetingId: defaultCurrentMeetingId,
      currentMeeting: defaultCurrentMeeting,
      currentTime: 0,
      isPlaying: false,
      playbackRate: 1,
      activeSpeakerFilter: null,
      activeTemplateId: "executive",
      autoScrollLocked: true,

      setCurrentMeeting: (id: string | null) => {
        set((state) => {
          const found = id ? state.meetings.find((m) => m.id === id) ?? null : null;
          return {
            currentMeetingId: id,
            currentMeeting: found,
            currentTime: 0,
            isPlaying: false,
            activeSpeakerFilter: null,
          };
        });
      },

      setCurrentMeetingId: (id: string | null) => {
        get().setCurrentMeeting(id);
      },

      setCurrentTime: (time: number) => {
        set({ currentTime: Math.max(0, time) });
      },

      setIsPlaying: (isPlaying: boolean) => {
        set({ isPlaying });
      },

      setPlaybackRate: (playbackRate: number) => {
        set({ playbackRate });
      },

      setActiveSpeakerFilter: (speakerId: string | null) => {
        set({ activeSpeakerFilter: speakerId });
      },

      setActiveTemplateId: (activeTemplateId: SummaryTemplateId) => {
        set({ activeTemplateId });
      },

      setAutoScrollLocked: (autoScrollLocked: boolean) => {
        set({ autoScrollLocked });
      },

      toggleActionItem: (meetingId: string, actionItemId: string) => {
        set((state) => {
          const updatedMeetings = state.meetings.map((meeting) => {
            if (meeting.id !== meetingId) return meeting;
            const updatedActionItems = meeting.actionItems.map((item) => {
              if (item.id !== actionItemId) return item;
              return { ...item, completed: !item.completed };
            });
            return { ...meeting, actionItems: updatedActionItems };
          });

          const currentMeeting =
            updatedMeetings.find((m) => m.id === state.currentMeetingId) ?? null;

          return {
            meetings: updatedMeetings,
            currentMeeting,
          };
        });
      },

      addHighlight: (meetingId: string, highlight: NewHighlightInput) => {
        set((state) => {
          const newHighlight: MeetingHighlight = {
            id: highlight.id || `hl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            meetingId,
            title: highlight.title,
            start: highlight.start,
            end: highlight.end,
            category: highlight.category || "key_moment",
            color: highlight.color,
            createdAt: highlight.createdAt || new Date().toISOString(),
          };

          const updatedMeetings = state.meetings.map((meeting) => {
            if (meeting.id !== meetingId) return meeting;
            return {
              ...meeting,
              highlights: [...meeting.highlights, newHighlight].sort((a, b) => a.start - b.start),
            };
          });

          const currentMeeting =
            updatedMeetings.find((m) => m.id === state.currentMeetingId) ?? null;

          return {
            meetings: updatedMeetings,
            currentMeeting,
          };
        });
      },

      addMeeting: (meeting: Meeting) => {
        set((state) => {
          const exists = state.meetings.some((m) => m.id === meeting.id);
          const updatedMeetings = exists
            ? state.meetings.map((m) => (m.id === meeting.id ? meeting : m))
            : [meeting, ...state.meetings];

          return {
            meetings: updatedMeetings,
            currentMeetingId: meeting.id,
            currentMeeting: meeting,
            currentTime: 0,
            isPlaying: false,
            activeSpeakerFilter: null,
          };
        });
      },

      updateMeetingSummary: (meetingId: string, templateId: SummaryTemplateId, summary: SummaryTemplateContent) => {
        set((state) => {
          const updatedMeetings = state.meetings.map((m) => {
            if (m.id !== meetingId) return m;
            return {
              ...m,
              summaries: {
                ...m.summaries,
                [templateId]: summary,
              },
            };
          });

          const currentMeeting =
            updatedMeetings.find((m) => m.id === state.currentMeetingId) ?? null;

          return {
            meetings: updatedMeetings,
            currentMeeting,
          };
        });
      },

      seekTo: (time: number) => {
        set((state) => {
          const current =
            state.currentMeeting || state.meetings.find((m) => m.id === state.currentMeetingId);
          const maxDuration = current ? current.duration : Infinity;
          const clampedTime = Math.max(0, Math.min(time, maxDuration));
          return { currentTime: clampedTime };
        });
      },

      getCurrentMeeting: () => {
        const state = get();
        return (
          state.currentMeeting ||
          state.meetings.find((m) => m.id === state.currentMeetingId) ||
          null
        );
      },

      resetToSeedData: () => {
        set({
          meetings: SEED_MEETINGS,
          currentMeetingId: SEED_MEETINGS[0]?.id || null,
          currentMeeting: SEED_MEETINGS[0] || null,
          currentTime: 0,
          isPlaying: false,
          playbackRate: 1,
          activeSpeakerFilter: null,
          activeTemplateId: "executive",
          autoScrollLocked: true,
        });
      },
    }),
    {
      name: "fathom-meeting-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        meetings: state.meetings,
        currentMeetingId: state.currentMeetingId,
        activeTemplateId: state.activeTemplateId,
        playbackRate: state.playbackRate,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!state.meetings || state.meetings.length === 0) {
            state.meetings = SEED_MEETINGS;
          }
          if (!state.currentMeetingId && state.meetings.length > 0) {
            state.currentMeetingId = state.meetings[0].id;
          }
          state.currentMeeting =
            state.meetings.find((m) => m.id === state.currentMeetingId) ||
            state.meetings[0] ||
            null;
          state.currentTime = 0;
          state.isPlaying = false;
          state.activeSpeakerFilter = null;
          state.autoScrollLocked = true;
        }
      },
    }
  )
);

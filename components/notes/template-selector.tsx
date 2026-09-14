"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { SummaryTemplateId } from "@/types/meeting";
import {
  Briefcase,
  CheckSquare,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TemplateDefinition {
  id: SummaryTemplateId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: (pendingCount: number) => React.ReactNode;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "executive",
    label: "Executive Summary",
    shortLabel: "Executive",
    icon: Briefcase,
    description: "High-level overview, strategic decisions, and business impact",
  },
  {
    id: "action_items",
    label: "Action Items & Owners",
    shortLabel: "Action Items",
    icon: CheckSquare,
    description: "Accountability matrix with owners, deadlines, and direct playback links",
    badge: (pendingCount: number) =>
      pendingCount > 0 ? (
        <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-md bg-white px-1.5 text-[9px] font-bold text-black">
          {pendingCount}
        </span>
      ) : null,
  },
  {
    id: "sales",
    label: "Sales Discovery",
    shortLabel: "Sales",
    icon: TrendingUp,
    description: "Enterprise requirements, contractual SLA commitments, and value drivers",
  },
  {
    id: "engineering",
    label: "Engineering Sync",
    shortLabel: "Engineering",
    icon: Cpu,
    description: "Architecture decisions, infrastructure specs, and technical RFCs",
  },
];

export interface TemplateSelectorProps {
  value?: SummaryTemplateId;
  onChange?: (templateId: SummaryTemplateId) => void;
  className?: string;
  compact?: boolean;
}

export function TemplateSelector({
  value,
  onChange,
  className,
  compact = false,
}: TemplateSelectorProps) {
  const storeActiveTemplateId = useMeetingStore((s) => s.activeTemplateId);
  const setActiveTemplateId = useMeetingStore((s) => s.setActiveTemplateId);
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);

  const activeId = value ?? storeActiveTemplateId;
  const handleValueChange = (newVal: string) => {
    const templateId = newVal as SummaryTemplateId;
    if (onChange) {
      onChange(templateId);
    } else {
      setActiveTemplateId(templateId);
    }
  };

  const pendingActionItemsCount =
    currentMeeting?.actionItems?.filter((item) => !item.completed).length ?? 0;

  return (
    <div className={cn("w-full", className)}>
      <Tabs
        value={activeId}
        onValueChange={handleValueChange}
        className="w-full"
      >
        <TabsList
          className={cn(
 "grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-surface-raised border border-white/15 rounded-2xl gap-1 ",
            compact ? "h-9 p-0.5" : "min-h-[44px]"
          )}
        >
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;

            return (
              <TabsTrigger
                key={tmpl.id}
                value={tmpl.id}
                className={cn(
 "relative flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium  transition-all cursor-pointer select-none border border-transparent",
 "text-white/60 hover:text-white hover:bg-white/5",
 "data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:shadow-sm",
                  compact && "py-1 text-[11px]"
                )}
                title={tmpl.description}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate hidden sm:inline">{tmpl.label}</span>
                <span className="truncate sm:hidden">{tmpl.shortLabel}</span>

                {tmpl.badge && tmpl.badge(pendingActionItemsCount)}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

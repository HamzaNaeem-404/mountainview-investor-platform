"use client";

import { opportunityCode } from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import type { ActivityEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface ActivityTimelineProps {
  events: ActivityEvent[];
  emptyMessage?: string;
}

export function ActivityTimeline({
  events,
  emptyMessage = "No activity yet.",
}: ActivityTimelineProps) {
  const { state } = useDemoStore();

  if (!events?.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--mv-border)] bg-white p-6 text-[15px] text-[var(--mv-muted)]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className="relative space-y-0 border-l border-[var(--mv-border)] pl-5">
      {events.map((event) => {
        const code = event.investorOpportunityId
          ? opportunityCode(state, event.investorOpportunityId)
          : null;

        return (
          <li key={event.id} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--mv-forest)]" />
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-[var(--mv-muted)]">
                {formatDateTime(event.createdAt)}
              </p>
              {code ? (
                <span className="rounded-md border border-[var(--mv-border)] bg-[var(--mv-ivory)] px-1.5 py-0.5 text-xs font-semibold text-[var(--mv-forest-deep)]">
                  {code}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[15px] font-medium text-[var(--mv-ink)]">
              {event.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--mv-muted)]">
              {event.detail}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import { ActivityTimeline } from "@/components/follow-ups/activity-timeline";
import { TaskList } from "@/components/follow-ups/task-list";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/loading-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  computeNextAction,
  getAllActivity,
  getOpenTasks,
  getOpportunitiesForInvestor,
  getSelectedOpportunity,
  getTaskDueBucket,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import { INVESTOR_ID } from "@/data/fixtures";

export default function FollowUpsPage() {
  const { state, hydrated } = useDemoStore();

  if (!hydrated) {
    return (
      <AppShell title="Follow-ups / Activity">
        <LoadingState />
      </AppShell>
    );
  }

  const openTasks = getOpenTasks(state);
  const overdue = openTasks.filter((t) => getTaskDueBucket(t) === "overdue");
  const upcoming = openTasks.filter((t) => getTaskDueBucket(t) === "upcoming");
  const completed =
    state.followUpTasks?.filter((t) => t.status === "Completed") ?? [];
  const activity = getAllActivity(state);

  const selected = getSelectedOpportunity(state, INVESTOR_ID);
  const fallback = getOpportunitiesForInvestor(state, INVESTOR_ID)?.find(
    (o) => o.stage !== "Not proceeding",
  );
  const clearNext = computeNextAction(state, selected ?? fallback);

  return (
    <AppShell
      title="Follow-ups / Activity"
      breadcrumbs={[
        { label: "Mountain View" },
        { label: "Follow-ups / Activity" },
      ]}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="border-[var(--mv-forest)]/20 bg-[var(--mv-sage)]/40">
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mv-forest-deep)]">
              Clear next action
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--mv-forest-deep)]">
              {clearNext}
            </p>
            <p className="mt-1 text-[15px] text-[var(--mv-muted)]">
              Recalculated from remaining open tasks. Completing a request task
              marks the follow-up done — it does not mean the document was
              received on the opportunity checklist.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Overdue" value={String(overdue.length)} />
          <Stat label="Upcoming" value={String(upcoming.length)} />
          <Stat label="Completed" value={String(completed.length)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outstanding follow-up tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList tasks={openTasks} showOpportunity />
              </CardContent>
            </Card>

            {completed.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={completed} showOpportunity />
                </CardContent>
              </Card>
            ) : null}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline events={activity.slice(0, 12)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-[var(--mv-muted)]">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

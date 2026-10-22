"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ActivityTimeline } from "@/components/follow-ups/activity-timeline";
import { TaskList } from "@/components/follow-ups/task-list";
import { ChecklistPanel } from "@/components/opportunities/checklist-panel";
import { SharingHistory } from "@/components/opportunities/sharing-history";
import { StageBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  computeNextAction,
  getActivityForOpportunity,
  getChecklistForOpportunity,
  getChecklistProgress,
  getInvestor,
  getOpenTasks,
  getProperty,
  getShareEventsForOpportunity,
  getTasksForOpportunity,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

interface OpportunityDetailProps {
  opportunityId: string;
  backHref?: string;
}

export function OpportunityDetail({
  opportunityId,
  backHref,
}: OpportunityDetailProps) {
  const { state } = useDemoStore();
  const opportunity = state.opportunities?.find((o) => o?.id === opportunityId);
  const property = opportunity
    ? getProperty(state, opportunity.propertyId)
    : undefined;
  const investor = opportunity
    ? getInvestor(state, opportunity.investorId)
    : undefined;

  if (!opportunity || !property || !investor) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-[var(--mv-muted)]">
          Opportunity not found.
        </CardContent>
      </Card>
    );
  }

  const checklist = getChecklistForOpportunity(state, opportunityId);
  const progress = getChecklistProgress(checklist);
  const shares = getShareEventsForOpportunity(state, opportunityId);
  const tasks = getTasksForOpportunity(state, opportunityId);
  const openTasks = getOpenTasks(state, opportunityId);
  const activity = getActivityForOpportunity(state, opportunityId);
  const nextAction = computeNextAction(state, opportunity);

  return (
    <div className="space-y-5">
      {backHref ? (
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      ) : null}

      <Card className="overflow-hidden">
        <div className="border-b border-[var(--mv-border)] bg-gradient-to-br from-[var(--mv-forest-deep)] to-[var(--mv-forest)] px-5 py-5 text-white sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-white/70">
                Opportunity detail
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl">
                {property.code} — {property.title}
              </h2>
              <p className="mt-1 text-sm text-white/80">
                Investor: {investor.name} · {property.location} ·{" "}
                {formatCurrency(property.price)}
              </p>
            </div>
            <StageBadge stage={opportunity.stage} />
          </div>
        </div>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Current stage" value={opportunity.stage} />
          <Meta label="Assigned owner" value={opportunity.assignedOwner} />
          <Meta label="Next action" value={nextAction} />
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--mv-muted)]">
              Diligence progress
            </p>
            <p className="mt-1 text-sm font-medium">
              {progress.done} of {progress.total} received or reviewed
            </p>
            <Progress className="mt-2" value={progress.percent} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="checklist">
        <TabsList className="w-full flex-wrap h-auto">
          <TabsTrigger value="checklist">Due Diligence Checklist</TabsTrigger>
          <TabsTrigger value="sharing">Document Sharing History</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups / Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist">
          <ChecklistPanel items={checklist} />
        </TabsContent>

        <TabsContent value="sharing">
          <SharingHistory opportunityId={opportunityId} events={shares} />
        </TabsContent>

        <TabsContent value="followups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList tasks={openTasks} />
              {tasks.some((t) => t.status === "Completed") ? (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-[var(--mv-muted)]">
                    Completed
                  </p>
                  <TaskList
                    tasks={tasks.filter((t) => t.status === "Completed")}
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline events={activity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--mv-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--mv-ink)]">{value}</p>
    </div>
  );
}

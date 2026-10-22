import type {
  ChecklistItem,
  ChecklistStatus,
  DemoState,
  FollowUpTask,
  InvestorOpportunity,
} from "@/lib/types";
import { todayIsoDate } from "@/lib/utils";

export function getInvestor(state: DemoState, investorId: string) {
  return state.investors?.find((i) => i?.id === investorId);
}

export function getMandate(state: DemoState, investorId: string) {
  return state.mandates?.find((m) => m?.investorId === investorId);
}

export function getProperty(state: DemoState, propertyId: string) {
  return state.properties?.find((p) => p?.id === propertyId);
}

export function getOpportunity(state: DemoState, opportunityId: string) {
  return state.opportunities?.find((o) => o?.id === opportunityId);
}

export function getOpportunitiesForInvestor(
  state: DemoState,
  investorId: string,
): InvestorOpportunity[] {
  return state.opportunities?.filter((o) => o?.investorId === investorId) ?? [];
}

export function getSelectedOpportunity(
  state: DemoState,
  investorId: string,
): InvestorOpportunity | undefined {
  return getOpportunitiesForInvestor(state, investorId)?.find(
    (o) => o?.selectedAt != null && o?.stage === "Due diligence",
  );
}

export function getChecklistForOpportunity(
  state: DemoState,
  opportunityId: string,
): ChecklistItem[] {
  return (
    state.checklistItems?.filter(
      (c) => c?.investorOpportunityId === opportunityId,
    ) ?? []
  );
}

export function isReceivedOrReviewed(status: ChecklistStatus): boolean {
  return status === "Received" || status === "Reviewed";
}

export function getChecklistProgress(
  items: ChecklistItem[],
): { done: number; total: number; percent: number } {
  const total = items?.length ?? 0;
  const done =
    items?.filter((i) => isReceivedOrReviewed(i?.status))?.length ?? 0;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
}

export function getDocumentsForOpportunity(
  state: DemoState,
  opportunityId: string,
) {
  return (
    state.documents?.filter((d) => d?.investorOpportunityId === opportunityId) ??
    []
  );
}

export function getShareEventsForOpportunity(
  state: DemoState,
  opportunityId: string,
) {
  return (
    state.shareEvents
      ?.filter((s) => s?.investorOpportunityId === opportunityId)
      ?.slice()
      ?.sort(
        (a, b) =>
          new Date(b?.sharedAt ?? 0).getTime() -
          new Date(a?.sharedAt ?? 0).getTime(),
      ) ?? []
  );
}

export function getDocumentById(state: DemoState, documentId: string) {
  return state.documents?.find((d) => d?.id === documentId);
}

export function getTasksForOpportunity(
  state: DemoState,
  opportunityId: string,
): FollowUpTask[] {
  return (
    state.followUpTasks?.filter(
      (t) => t?.investorOpportunityId === opportunityId,
    ) ?? []
  );
}

export function getOpenTasks(state: DemoState, opportunityId?: string) {
  return (
    state.followUpTasks
      ?.filter((t) => {
        if (t?.status !== "Open") return false;
        if (opportunityId && t?.investorOpportunityId !== opportunityId)
          return false;
        return true;
      })
      ?.slice()
      ?.sort(
        (a, b) =>
          new Date(a?.dueDate ?? 0).getTime() -
          new Date(b?.dueDate ?? 0).getTime(),
      ) ?? []
  );
}

export function getActivityForOpportunity(
  state: DemoState,
  opportunityId: string,
) {
  return (
    state.activityEvents
      ?.filter((a) => a?.investorOpportunityId === opportunityId)
      ?.slice()
      ?.sort(
        (a, b) =>
          new Date(b?.createdAt ?? 0).getTime() -
          new Date(a?.createdAt ?? 0).getTime(),
      ) ?? []
  );
}

export function getAllActivity(state: DemoState) {
  return (
    state.activityEvents
      ?.slice()
      ?.sort(
        (a, b) =>
          new Date(b?.createdAt ?? 0).getTime() -
          new Date(a?.createdAt ?? 0).getTime(),
      ) ?? []
  );
}

export type DueBucket = "overdue" | "upcoming" | "completed";

export function getTaskDueBucket(task: FollowUpTask): DueBucket {
  if (task?.status === "Completed") return "completed";
  const today = todayIsoDate();
  if ((task?.dueDate ?? "") < today) return "overdue";
  return "upcoming";
}

export function computeNextAction(
  state: DemoState,
  opportunity: InvestorOpportunity | undefined,
): string {
  if (!opportunity) return "—";
  if (opportunity.stage === "Not proceeding") return "No active follow-up";

  const openTasks = getOpenTasks(state, opportunity.id);
  if (openTasks?.length) {
    const earliest = openTasks[0];
    return earliest?.title ?? opportunity.nextActionHint;
  }

  return opportunity.nextActionHint || "No open tasks";
}

export function opportunityLabel(
  state: DemoState,
  opportunityId: string,
): string {
  const opp = getOpportunity(state, opportunityId);
  const property = opp ? getProperty(state, opp.propertyId) : undefined;
  if (!property) return opportunityId;
  return `${property.code} — ${property.title}`;
}

export function opportunityCode(
  state: DemoState,
  opportunityId: string,
): string | null {
  const opp = getOpportunity(state, opportunityId);
  const property = opp ? getProperty(state, opp.propertyId) : undefined;
  return property?.code ?? null;
}

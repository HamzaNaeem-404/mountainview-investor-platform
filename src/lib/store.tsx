"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createInitialDemoState } from "@/data/fixtures";
import type {
  ActivityEvent,
  ChecklistStatus,
  DemoState,
  ShareChannel,
  ShareEvent,
} from "@/lib/types";
import { DEMO_STORAGE_KEY, DEMO_STORAGE_VERSION } from "@/lib/types";
import { createId } from "@/lib/utils";

interface LogShareInput {
  opportunityId: string;
  documentId: string;
  version: string;
  channel: ShareChannel;
  loggedBy: string;
}

interface DemoStoreValue {
  state: DemoState;
  hydrated: boolean;
  resetDemo: () => void;
  selectForDueDiligence: (opportunityId: string) => void;
  updateChecklistStatus: (
    checklistItemId: string,
    status: ChecklistStatus,
  ) => void;
  logShare: (input: LogShareInput) => ShareEvent | null;
  completeTask: (taskId: string) => void;
  rescheduleTask: (taskId: string, dueDate: string) => void;
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

const listeners = new Set<() => void>();
const SERVER_STATE: DemoState = createInitialDemoState();
let memoryState: DemoState = SERVER_STATE;
let storageReady = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function loadFromStorage(): DemoState {
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return createInitialDemoState();
    const parsed = JSON.parse(raw) as DemoState;
    if (parsed?.version !== DEMO_STORAGE_VERSION) {
      return createInitialDemoState();
    }
    return parsed;
  } catch {
    return createInitialDemoState();
  }
}

function persist(state: DemoState) {
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private mode errors in demo.
  }
}

function getSnapshot(): DemoState {
  // Match server snapshot until the client mount effect marks storage ready.
  if (!storageReady) return SERVER_STATE;
  return memoryState;
}

function getServerSnapshot(): DemoState {
  return SERVER_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setMemoryState(updater: (prev: DemoState) => DemoState) {
  memoryState = updater(memoryState);
  persist(memoryState);
  emit();
}

function pushActivity(
  state: DemoState,
  event: Omit<ActivityEvent, "id">,
): DemoState {
  const next: ActivityEvent = {
    ...event,
    id: createId("act"),
  };
  return {
    ...state,
    activityEvents: [next, ...(state.activityEvents ?? [])],
  };
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = storageReady;
  const shareResultRef = useRef<ShareEvent | null>(null);

  useEffect(() => {
    memoryState = loadFromStorage();
    storageReady = true;
    emit();
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = createInitialDemoState();
    memoryState = fresh;
    storageReady = true;
    persist(fresh);
    emit();
  }, []);

  const selectForDueDiligence = useCallback((opportunityId: string) => {
    setMemoryState((prev) => {
      const target = prev.opportunities?.find((o) => o?.id === opportunityId);
      if (!target) return prev;

      const now = new Date().toISOString();
      const property = prev.properties?.find((p) => p?.id === target.propertyId);

      let next: DemoState = {
        ...prev,
        opportunities: (prev.opportunities ?? []).map((opp) => {
          if (opp?.investorId !== target.investorId) return opp;
          if (opp?.id === opportunityId) {
            return {
              ...opp,
              stage: "Due diligence" as const,
              selectedAt: now,
              assignedOwner: "Mountain View Adviser",
              nextActionHint:
                "Request management contract and coordinate independent legal review",
            };
          }
          if (opp?.stage === "Due diligence" && opp?.selectedAt != null) {
            return {
              ...opp,
              selectedAt: null,
              stage: "Shortlisted" as const,
            };
          }
          if (opp?.selectedAt != null) {
            return { ...opp, selectedAt: null };
          }
          return opp;
        }),
      };

      next = pushActivity(next, {
        investorOpportunityId: opportunityId,
        investorId: target.investorId,
        kind: "selection",
        title: "Selected for due diligence",
        detail: `${property?.code ?? "Property"} ${property?.title ?? ""} selected for formal due diligence.`,
        createdAt: now,
      });

      return next;
    });
  }, []);

  const updateChecklistStatus = useCallback(
    (checklistItemId: string, status: ChecklistStatus) => {
      setMemoryState((prev) => {
        const item = prev.checklistItems?.find((c) => c?.id === checklistItemId);
        if (!item || item.status === status) return prev;

        const opportunity = prev.opportunities?.find(
          (o) => o?.id === item.investorOpportunityId,
        );
        const now = new Date().toISOString();

        let next: DemoState = {
          ...prev,
          checklistItems: (prev.checklistItems ?? []).map((c) =>
            c?.id === checklistItemId ? { ...c, status } : c,
          ),
        };

        next = pushActivity(next, {
          investorOpportunityId: item.investorOpportunityId,
          investorId: opportunity?.investorId ?? "",
          kind: "checklist_update",
          title: "Checklist status updated",
          detail: `"${item.title}" changed from ${item.status} to ${status}. Receiving a document does not log it as shared with the investor.`,
          createdAt: now,
        });

        return next;
      });
    },
    [],
  );

  const logShare = useCallback((input: LogShareInput): ShareEvent | null => {
    shareResultRef.current = null;

    setMemoryState((prev) => {
      const document = prev.documents?.find((d) => d?.id === input.documentId);
      const opportunity = prev.opportunities?.find(
        (o) => o?.id === input.opportunityId,
      );
      if (!document || !opportunity) return prev;
      if (document.investorOpportunityId !== input.opportunityId) return prev;

      const now = new Date().toISOString();
      const share: ShareEvent = {
        id: createId("share"),
        investorOpportunityId: input.opportunityId,
        documentId: input.documentId,
        sharedAt: now,
        channel: input.channel,
        version: input.version,
        loggedBy: input.loggedBy,
      };
      shareResultRef.current = share;

      let next: DemoState = {
        ...prev,
        shareEvents: [share, ...(prev.shareEvents ?? [])],
      };

      next = pushActivity(next, {
        investorOpportunityId: input.opportunityId,
        investorId: opportunity.investorId,
        kind: "share_logged",
        title: "Document sharing logged",
        detail: `${document.name} (${input.version}) logged as shared via ${input.channel}. Demo only — no message was sent.`,
        createdAt: now,
      });

      return next;
    });

    return shareResultRef.current;
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setMemoryState((prev) => {
      const task = prev.followUpTasks?.find((t) => t?.id === taskId);
      if (!task || task.status === "Completed") return prev;

      const opportunity = prev.opportunities?.find(
        (o) => o?.id === task.investorOpportunityId,
      );
      const now = new Date().toISOString();

      let next: DemoState = {
        ...prev,
        followUpTasks: (prev.followUpTasks ?? []).map((t) =>
          t?.id === taskId
            ? { ...t, status: "Completed" as const, completedAt: now }
            : t,
        ),
      };

      next = pushActivity(next, {
        investorOpportunityId: task.investorOpportunityId,
        investorId: opportunity?.investorId ?? "",
        kind: "task_completed",
        title: "Follow-up completed",
        detail: `Completed: ${task.title}`,
        createdAt: now,
      });

      return next;
    });
  }, []);

  const rescheduleTask = useCallback((taskId: string, dueDate: string) => {
    setMemoryState((prev) => {
      const task = prev.followUpTasks?.find((t) => t?.id === taskId);
      if (!task) return prev;

      const opportunity = prev.opportunities?.find(
        (o) => o?.id === task.investorOpportunityId,
      );
      const previousDue = task.dueDate;
      const now = new Date().toISOString();

      let next: DemoState = {
        ...prev,
        followUpTasks: (prev.followUpTasks ?? []).map((t) =>
          t?.id === taskId ? { ...t, dueDate } : t,
        ),
      };

      next = pushActivity(next, {
        investorOpportunityId: task.investorOpportunityId,
        investorId: opportunity?.investorId ?? "",
        kind: "task_rescheduled",
        title: "Follow-up rescheduled",
        detail: `"${task.title}" due date moved from ${previousDue} to ${dueDate}.`,
        createdAt: now,
      });

      return next;
    });
  }, []);

  const value = useMemo<DemoStoreValue>(
    () => ({
      state,
      hydrated,
      resetDemo,
      selectForDueDiligence,
      updateChecklistStatus,
      logShare,
      completeTask,
      rescheduleTask,
    }),
    [
      state,
      hydrated,
      resetDemo,
      selectForDueDiligence,
      updateChecklistStatus,
      logShare,
      completeTask,
      rescheduleTask,
    ],
  );

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  );
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) {
    throw new Error("useDemoStore must be used within DemoStoreProvider");
  }
  return ctx;
}

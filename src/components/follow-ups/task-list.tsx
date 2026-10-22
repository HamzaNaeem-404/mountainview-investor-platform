"use client";

import { TaskStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { opportunityLabel } from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import type { FollowUpTask } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Check } from "lucide-react";

interface TaskListProps {
  tasks: FollowUpTask[];
  showOpportunity?: boolean;
}

function isRequestTask(title: string): boolean {
  return /request|follow up|assign/i.test(title ?? "");
}

export function TaskList({ tasks, showOpportunity = false }: TaskListProps) {
  const { state, completeTask, rescheduleTask } = useDemoStore();

  if (!tasks?.length) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--mv-border)] bg-white p-6 text-[15px] text-[var(--mv-muted)]">
        No active follow-up tasks.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-xl border border-[var(--mv-border)] bg-white p-4 shadow-[0_1px_2px_rgba(26,40,32,0.04)]"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[15px] font-medium text-[var(--mv-ink)]">
                  {task.title}
                </p>
                <TaskStatusBadge task={task} />
              </div>
              <p className="text-sm text-[var(--mv-muted)]">
                Assigned to {task.assignedTo}
                {showOpportunity
                  ? ` · ${opportunityLabel(state, task.investorOpportunityId)}`
                  : null}
              </p>
              <p className="text-sm text-[var(--mv-muted)]">
                Due {formatDate(task.dueDate)}
                {task.completedAt
                  ? ` · Completed ${formatDate(task.completedAt)}`
                  : null}
              </p>
              {task.status === "Completed" && isRequestTask(task.title) ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-sm text-amber-950">
                  Task complete means the request action was done — it does not
                  mean the document was received. Check the opportunity
                  checklist for evidence status.
                </p>
              ) : null}
            </div>

            {task.status === "Open" ? (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="date"
                  className="h-9 w-auto"
                  value={task.dueDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      rescheduleTask(task.id, e.target.value);
                    }
                  }}
                  aria-label={`Reschedule ${task.title}`}
                />
                <Button size="sm" onClick={() => completeTask(task.id)}>
                  <Check className="h-3.5 w-3.5" />
                  Complete
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

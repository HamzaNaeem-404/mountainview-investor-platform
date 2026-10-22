import { Badge } from "@/components/ui/badge";
import type {
  ChecklistStatus,
  OpportunityStage,
  TaskStatus,
} from "@/lib/types";
import { getTaskDueBucket, type DueBucket } from "@/lib/selectors";
import type { FollowUpTask } from "@/lib/types";

export function StageBadge({ stage }: { stage: OpportunityStage }) {
  const variant =
    stage === "Due diligence"
      ? "diligence"
      : stage === "Not proceeding"
        ? "stopped"
        : stage === "Shortlisted"
          ? "shortlisted"
          : "muted";
  return <Badge variant={variant}>{stage}</Badge>;
}

export function ChecklistStatusBadge({ status }: { status: ChecklistStatus }) {
  const variant =
    status === "Reviewed"
      ? "success"
      : status === "Received"
        ? "diligence"
        : status === "Requested"
          ? "warning"
          : "muted";
  return <Badge variant={variant}>{status}</Badge>;
}

export function TaskStatusBadge({ task }: { task: FollowUpTask }) {
  const bucket: DueBucket = getTaskDueBucket(task);
  if (task?.status === "Completed" || bucket === "completed") {
    return <Badge variant="success">Completed</Badge>;
  }
  if (bucket === "overdue") {
    return <Badge variant="danger">Overdue</Badge>;
  }
  return <Badge variant="warning">Upcoming</Badge>;
}

export function SimpleTaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant={status === "Completed" ? "success" : "outline"}>
      {status}
    </Badge>
  );
}

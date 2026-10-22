"use client";

import { ChecklistStatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getChecklistProgress } from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import type { ChecklistItem, ChecklistStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUSES: ChecklistStatus[] = [
  "Missing",
  "Requested",
  "Received",
  "Reviewed",
];

interface ChecklistPanelProps {
  items: ChecklistItem[];
}

export function ChecklistPanel({ items }: ChecklistPanelProps) {
  const { updateChecklistStatus } = useDemoStore();
  const progress = getChecklistProgress(items);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--mv-border)] bg-[var(--mv-ivory)]/60 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[15px] font-medium text-[var(--mv-forest-deep)]">
            Checklist progress
          </p>
          <p className="text-[15px] text-[var(--mv-muted)]">
            <span className="font-semibold text-[var(--mv-ink)]">
              {progress.done} of {progress.total}
            </span>{" "}
            received or reviewed
          </p>
        </div>
        <Progress value={progress.percent} />
        <p className="mt-2 text-sm text-[var(--mv-muted)]">
          Changing status to Received updates internal evidence only. It does not
          create a sharing event with the investor.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--mv-border)] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document / evidence</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responsible</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <ChecklistStatusBadge status={item.status} />
                </TableCell>
                <TableCell>{item.responsiblePerson}</TableCell>
                <TableCell>
                  {item.dueDate ? formatDate(item.dueDate) : "—"}
                </TableCell>
                <TableCell>
                  <Select
                    value={item.status}
                    onValueChange={(v) =>
                      updateChecklistStatus(item.id, v as ChecklistStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

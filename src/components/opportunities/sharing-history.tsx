"use client";

import { LogShareDialog } from "@/components/opportunities/log-share-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getDocumentById,
  getInvestor,
  getOpportunity,
  getProperty,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import type { ShareEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface SharingHistoryProps {
  opportunityId: string;
  events: ShareEvent[];
}

export function SharingHistory({ opportunityId, events }: SharingHistoryProps) {
  const { state } = useDemoStore();
  const opportunity = getOpportunity(state, opportunityId);
  const property = opportunity
    ? getProperty(state, opportunity.propertyId)
    : undefined;
  const investor = opportunity
    ? getInvestor(state, opportunity.investorId)
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--mv-forest-deep)]">
            Document sharing history
          </h3>
          <p className="mt-1 text-[15px] text-[var(--mv-muted)]">
            Manually logged for{" "}
            <span className="font-medium text-[var(--mv-ink)]">
              {investor?.name ?? "investor"}
            </span>
            {property ? (
              <>
                {" "}
                ·{" "}
                <span className="font-semibold text-[var(--mv-forest)]">
                  {property.code}
                </span>{" "}
                {property.title}
              </>
            ) : null}
            . This does not send WhatsApp or email.
          </p>
        </div>
        <LogShareDialog opportunityId={opportunityId} />
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--mv-border)] bg-white">
        {events?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Logged by</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const doc = getDocumentById(state, event.documentId);
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-semibold text-[var(--mv-forest)]">
                      {property?.code ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {doc?.name ?? "Document"}
                    </TableCell>
                    <TableCell>{event.version}</TableCell>
                    <TableCell>{formatDate(event.sharedAt)}</TableCell>
                    <TableCell>{event.channel}</TableCell>
                    <TableCell>{event.loggedBy}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="p-6 text-[15px] text-[var(--mv-muted)]">
            No sharing events logged for this opportunity yet.
          </p>
        )}
      </div>
    </div>
  );
}

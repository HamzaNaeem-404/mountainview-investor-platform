"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/loading-state";
import { StageBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { INVESTOR_ID } from "@/data/fixtures";
import {
  computeNextAction,
  getInvestor,
  getProperty,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function OpportunitiesPage() {
  const { state, hydrated } = useDemoStore();

  if (!hydrated) {
    return (
      <AppShell title="Opportunities">
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Opportunities"
      breadcrumbs={[{ label: "Mountain View" }, { label: "Opportunities" }]}
    >
      <div className="mx-auto max-w-6xl space-y-5">
        <Card className="border-[var(--mv-forest)]/15 bg-[var(--mv-sage)]/35">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mv-forest)]">
                Opportunity independence
              </p>
              <p className="mt-1 text-[15px] font-medium text-[var(--mv-forest-deep)]">
                Each row is a distinct investor–property record with its own
                checklist, sharing history and follow-ups.
              </p>
              <p className="mt-1 text-sm text-[var(--mv-muted)]">
                Updating P-102 never changes P-101 or P-103. Start the diligence
                walkthrough from the investor profile.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href={`/investors/${INVESTOR_ID}`}>Compare on profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Investor–property opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Investor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Next action</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.opportunities?.map((opp) => {
                  const property = getProperty(state, opp.propertyId);
                  const investor = getInvestor(state, opp.investorId);
                  return (
                    <TableRow key={opp.id}>
                      <TableCell className="font-semibold text-[var(--mv-forest)]">
                        {property?.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{property?.title}</p>
                          <p className="text-sm text-[var(--mv-muted)]">
                            {property?.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{investor?.name}</TableCell>
                      <TableCell>
                        {formatCurrency(property?.price ?? 0)}
                      </TableCell>
                      <TableCell>
                        <StageBadge stage={opp.stage} />
                      </TableCell>
                      <TableCell>{opp.assignedOwner}</TableCell>
                      <TableCell className="max-w-[240px]">
                        <span className="line-clamp-2 text-[var(--mv-muted)]">
                          {computeNextAction(state, opp)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/opportunities/${opp.id}`}>Open</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/loading-state";
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
  getMandate,
  getOpportunitiesForInvestor,
  getProperty,
  getSelectedOpportunity,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function InvestorsPage() {
  const { state, hydrated } = useDemoStore();

  const investors = state.investors ?? [];

  return (
    <AppShell
      title="Investors"
      breadcrumbs={[{ label: "Mountain View" }, { label: "Investors" }]}
    >
      {!hydrated ? <LoadingState /> : null}
      {hydrated ? (
        <div className="mx-auto max-w-6xl space-y-5">
          <Card className="border-[var(--mv-forest)]/15 bg-[var(--mv-sage)]/35">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mv-forest)]">
                  Demo walkthrough
                </p>
                <p className="mt-1 text-[15px] font-medium text-[var(--mv-forest-deep)]">
                  One investor mandate linked to three Georgia property
                  opportunities.
                </p>
                <p className="mt-1 text-sm text-[var(--mv-muted)]">
                  Open Leila Al Mansouri to compare fit, select due diligence,
                  and manage opportunity-scoped evidence.
                </p>
              </div>
              <Button asChild className="shrink-0">
                <Link href={`/investors/${INVESTOR_ID}`}>
                  Open Investor Walkthrough
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Investors in demo" value={String(investors.length)} />
            <StatCard
              label="Linked opportunities"
              value={String(state.opportunities?.length ?? 0)}
            />
            <StatCard label="Focus market" value="Georgia · GCC inbound" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investor overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Investment mandate</TableHead>
                    <TableHead>Capital range</TableHead>
                    <TableHead>Opportunities</TableHead>
                    <TableHead>Selected</TableHead>
                    <TableHead>Next action</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investors.map((investor) => {
                    const mandate = getMandate(state, investor.id);
                    const opportunities = getOpportunitiesForInvestor(
                      state,
                      investor.id,
                    );
                    const selected = getSelectedOpportunity(state, investor.id);
                    const selectedProperty = selected
                      ? getProperty(state, selected.propertyId)
                      : undefined;
                    const nextSource =
                      selected ??
                      opportunities?.find((o) => o.stage !== "Not proceeding");
                    const nextAction = computeNextAction(state, nextSource);

                    return (
                      <TableRow key={investor.id}>
                        <TableCell className="font-semibold">
                          {investor.name}
                        </TableCell>
                        <TableCell>{investor.country}</TableCell>
                        <TableCell className="max-w-[220px]">
                          <span className="line-clamp-2">
                            {mandate?.preferredAssetType}
                          </span>
                        </TableCell>
                        <TableCell>
                          {mandate
                            ? `${formatCurrency(mandate.budgetMin)} – ${formatCurrency(mandate.budgetMax)}`
                            : "—"}
                        </TableCell>
                        <TableCell>{opportunities?.length ?? 0}</TableCell>
                        <TableCell>
                          {selectedProperty
                            ? selectedProperty.code
                            : "None yet"}
                        </TableCell>
                        <TableCell className="max-w-[220px]">
                          <span className="line-clamp-2 text-[var(--mv-muted)]">
                            {nextAction}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" asChild>
                            <Link href={`/investors/${investor.id}`}>
                              View Investor
                            </Link>
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
      ) : null}
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[13px] font-medium text-[var(--mv-muted)]">{label}</p>
        <p className="mt-1 text-xl font-semibold text-[var(--mv-ink)]">{value}</p>
      </CardContent>
    </Card>
  );
}

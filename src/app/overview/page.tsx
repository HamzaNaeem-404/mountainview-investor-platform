"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/loading-state";
import { StageBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INVESTOR_ID } from "@/data/fixtures";
import {
  computeNextAction,
  getMandate,
  getOpenTasks,
  getOpportunitiesForInvestor,
  getProperty,
  getSelectedOpportunity,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function OverviewPage() {
  const { state, hydrated } = useDemoStore();

  if (!hydrated) {
    return (
      <AppShell title="Overview">
        <LoadingState />
      </AppShell>
    );
  }

  const investor = state.investors?.[0];
  const mandate = investor ? getMandate(state, investor.id) : undefined;
  const opportunities = investor
    ? getOpportunitiesForInvestor(state, investor.id)
    : [];
  const selected = investor
    ? getSelectedOpportunity(state, investor.id)
    : undefined;
  const selectedProperty = selected
    ? getProperty(state, selected.propertyId)
    : undefined;
  const openTasks = getOpenTasks(state);
  const nextOverall = selected
    ? computeNextAction(state, selected)
    : (openTasks?.[0]?.title ?? "Compare shortlisted properties");

  return (
    <AppShell
      title="Overview"
      breadcrumbs={[{ label: "Mountain View" }, { label: "Overview" }]}
    >
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-xl border border-[var(--mv-border)] bg-gradient-to-br from-[var(--mv-forest-deep)] via-[var(--mv-forest)] to-[#3f735c] px-5 py-5 text-white shadow-sm sm:px-6 sm:py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
            Mountain View · Investor Operations
          </p>
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-[family-name:var(--font-display)] text-2xl leading-snug sm:text-[1.75rem]">
                One mandate. Three opportunities. One clear next action.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                Compare opportunities, coordinate due diligence, track shared
                evidence and manage investor follow-ups in one place — without
                mixing checklists or sharing logs between properties.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                asChild
                className="bg-white text-[var(--mv-forest-deep)] hover:bg-[var(--mv-ivory)]"
              >
                <Link href={`/investors/${INVESTOR_ID}`}>
                  Open Investor Walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/follow-ups">View follow-ups</Link>
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/15 pt-3 text-sm text-white/80">
            <span>
              <strong className="text-white">{investor ? 1 : 0}</strong> investor
            </span>
            <span>
              <strong className="text-white">
                {opportunities?.length ?? 0}
              </strong>{" "}
              opportunities
            </span>
            <span className="truncate">
              Next: <strong className="text-white">{nextOverall}</strong>
            </span>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <WorkflowStep
            step="1"
            title="Investor mandate"
            detail="Review Leila's goals and budget."
            href={`/investors/${INVESTOR_ID}`}
          />
          <WorkflowStep
            step="2"
            title="Property selection"
            detail="Compare 3 opportunities."
            href={`/investors/${INVESTOR_ID}`}
          />
          <WorkflowStep
            step="3"
            title="Due diligence"
            detail="Track evidence and actions."
            href={
              selected
                ? `/opportunities/${selected.id}`
                : "/opportunities/opp-p102"
            }
          />
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Current mandate snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[15px]">
              <p>
                <span className="text-[var(--mv-muted)]">Investor: </span>
                {investor?.name}
              </p>
              <p>
                <span className="text-[var(--mv-muted)]">Objective: </span>
                {mandate?.investmentObjective}
              </p>
              <p>
                <span className="text-[var(--mv-muted)]">Budget: </span>
                {mandate
                  ? `${formatCurrency(mandate.budgetMin)} – ${formatCurrency(mandate.budgetMax)}`
                  : "—"}
              </p>
              <p>
                <span className="text-[var(--mv-muted)]">Locations: </span>
                {mandate?.preferredLocations?.join(" or ")}
              </p>
              <p>
                <span className="text-[var(--mv-muted)]">Timeline: </span>
                {mandate?.decisionTimeline}
              </p>
              {selectedProperty ? (
                <p>
                  <span className="text-[var(--mv-muted)]">
                    Selected for diligence:{" "}
                  </span>
                  {selectedProperty.code} — {selectedProperty.title}
                </p>
              ) : (
                <p className="text-[var(--mv-muted)]">
                  No property selected for diligence yet — start with P-102 in
                  the walkthrough.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opportunity stages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {opportunities?.map((opp) => {
                const property = getProperty(state, opp.propertyId);
                return (
                  <Link
                    key={opp.id}
                    href={`/opportunities/${opp.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[var(--mv-border)] px-3 py-2.5 transition-colors hover:bg-[var(--mv-ivory)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium">
                        {property?.code} — {property?.title}
                      </p>
                      <p className="text-sm text-[var(--mv-muted)]">
                        {formatCurrency(property?.price ?? 0)}
                      </p>
                    </div>
                    <StageBadge stage={opp.stage} />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function WorkflowStep({
  step,
  title,
  detail,
  href,
}: {
  step: string;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--mv-border)] bg-white p-4 shadow-[0_1px_2px_rgba(26,40,32,0.04)] transition-colors hover:border-[var(--mv-forest)]/30 hover:bg-[var(--mv-ivory)]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mv-forest)]">
        Step {step}
      </p>
      <p className="mt-1.5 text-[15px] font-semibold text-[var(--mv-ink)]">
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--mv-muted)]">
        {detail}
      </p>
    </Link>
  );
}

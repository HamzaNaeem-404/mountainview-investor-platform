"use client";

import { use } from "react";
import Link from "next/link";
import { OpportunityComparison } from "@/components/investors/opportunity-comparison";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getInvestor,
  getMandate,
  getOpportunitiesForInvestor,
  getProperty,
  getSelectedOpportunity,
} from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export default function InvestorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, hydrated } = useDemoStore();

  if (!hydrated) {
    return (
      <AppShell title="Investor profile">
        <LoadingState />
      </AppShell>
    );
  }

  const investor = getInvestor(state, id);
  if (!investor) {
    return (
      <AppShell title="Investor not found">
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-[var(--mv-muted)]">
              No investor matches this demo record.
            </p>
            <Button asChild variant="outline">
              <Link href="/investors">Back to investors</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const mandate = getMandate(state, investor.id);
  const opportunities = getOpportunitiesForInvestor(state, investor.id);
  const selected = getSelectedOpportunity(state, investor.id);
  const selectedProperty = selected
    ? getProperty(state, selected.propertyId)
    : undefined;

  return (
    <AppShell
      title={investor.name}
      breadcrumbs={[{ label: "Investors" }, { label: investor.name }]}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--mv-forest)]">
                Investor profile
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--mv-forest-deep)]">
                {investor.name}
              </h2>
              <p className="mt-2 text-sm text-[var(--mv-muted)]">
                {investor.country}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[var(--mv-sage)] px-2.5 py-1 text-xs font-medium text-[var(--mv-forest-deep)]">
                <MessageCircle className="h-3.5 w-3.5" />
                Preferred contact: {investor.contactPreference}
              </p>
              <p className="mt-2 text-xs text-[var(--mv-muted)]">
                No real phone number or email is stored in this demo.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--mv-border)] bg-[var(--mv-ivory)] px-4 py-3 text-sm">
              <p className="text-xs uppercase tracking-wide text-[var(--mv-muted)]">
                Diligence selection
              </p>
              <p className="mt-1 font-medium">
                {selectedProperty
                  ? `${selectedProperty.code} — ${selectedProperty.title}`
                  : "None selected yet"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-[var(--mv-border)] bg-[var(--mv-ivory)]/70">
            <CardTitle className="font-[family-name:var(--font-display)] text-xl">
              Investment mandate
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <MandateField
              label="Objective"
              value={mandate?.investmentObjective ?? "—"}
              wide
            />
            <MandateField
              label="Capital range"
              value={
                mandate
                  ? `${formatCurrency(mandate.budgetMin)} – ${formatCurrency(mandate.budgetMax)}`
                  : "—"
              }
            />
            <MandateField
              label="Preferred asset"
              value={mandate?.preferredAssetType ?? "—"}
            />
            <MandateField
              label="Preferred locations"
              value={mandate?.preferredLocations?.join(" or ") ?? "—"}
            />
            <MandateField
              label="Decision timeframe"
              value={mandate?.decisionTimeline ?? "—"}
            />
            <MandateField
              label="Process goal"
              value="Compare three properties and select one for formal due diligence"
            />
          </CardContent>
        </Card>

        <div>
          <div className="mb-3">
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--mv-forest-deep)]">
              Linked property opportunities
            </h3>
            <p className="text-sm text-[var(--mv-muted)]">
              Each opportunity keeps its own checklist, sharing history, and
              follow-ups.
            </p>
          </div>
          <OpportunityComparison opportunities={opportunities} />
        </div>
      </div>
    </AppShell>
  );
}

function MandateField({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2 lg:col-span-3" : undefined}>
      <p className="text-xs uppercase tracking-wide text-[var(--mv-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--mv-ink)]">{value}</p>
    </div>
  );
}

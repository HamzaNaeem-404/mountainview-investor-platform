"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/loading-state";
import { OpportunityDetail } from "@/components/opportunities/opportunity-detail";
import { getInvestor, getProperty } from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";

export default function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, hydrated } = useDemoStore();

  const opportunity = state.opportunities?.find((o) => o?.id === id);
  const property = opportunity
    ? getProperty(state, opportunity.propertyId)
    : undefined;
  const investor = opportunity
    ? getInvestor(state, opportunity.investorId)
    : undefined;

  const title = property
    ? `${property.code} — ${property.title}`
    : "Opportunity";

  if (!hydrated) {
    return (
      <AppShell title={title}>
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={title}
      breadcrumbs={[
        { label: "Opportunities" },
        { label: property?.code ?? id },
        ...(investor ? [{ label: investor.name }] : []),
      ]}
    >
      <OpportunityDetail
        opportunityId={id}
        backHref={
          investor ? `/investors/${investor.id}` : "/opportunities"
        }
      />
    </AppShell>
  );
}

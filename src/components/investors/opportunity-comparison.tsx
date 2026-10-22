"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { StageBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeNextAction, getProperty } from "@/lib/selectors";
import { useDemoStore } from "@/lib/store";
import type { InvestorOpportunity } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface OpportunityComparisonProps {
  opportunities: InvestorOpportunity[];
}

type FitTone = "fit" | "conditional" | "not-fit";

function getFitPresentation(
  code: string | undefined,
  stage: string,
): { tone: FitTone; label: string } {
  if (stage === "Not proceeding" || code === "P-103") {
    return { tone: "not-fit", label: "Not a fit" };
  }
  if (code === "P-102") {
    return { tone: "conditional", label: "Conditional fit — requires review" };
  }
  return { tone: "fit", label: "Good mandate fit" };
}

const FIT_STYLES: Record<FitTone, string> = {
  fit: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
  conditional: "border-amber-200 bg-amber-50/80 text-amber-950",
  "not-fit": "border-stone-200 bg-stone-50 text-stone-700",
};

export function OpportunityComparison({
  opportunities,
}: OpportunityComparisonProps) {
  const { state, selectForDueDiligence } = useDemoStore();
  const router = useRouter();

  const handleSelect = (opportunityId: string, code: string) => {
    selectForDueDiligence(opportunityId);
    toast.success(`${code} selected for due diligence`);
    window.setTimeout(() => {
      router.push(`/opportunities/${opportunityId}`);
    }, 0);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {opportunities?.map((opp) => {
        const property = getProperty(state, opp.propertyId);
        if (!property) return null;
        const fit = getFitPresentation(property.code, opp.stage);
        const isSelected =
          opp.selectedAt != null && opp.stage === "Due diligence";
        const canSelect =
          property.code === "P-102" && opp.stage === "Shortlisted";

        return (
          <Card
            key={opp.id}
            className={
              isSelected
                ? "ring-2 ring-[var(--mv-forest)] ring-offset-2 ring-offset-[var(--mv-canvas)]"
                : undefined
            }
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--mv-forest)]">
                    {property.code}
                  </p>
                  <CardTitle className="mt-1 font-[family-name:var(--font-display)] text-lg">
                    {property.title}
                  </CardTitle>
                </div>
                <StageBadge stage={opp.stage} />
              </div>
              {isSelected ? (
                <p className="text-sm font-medium text-[var(--mv-forest)]">
                  Selected for due diligence
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <dt className="text-sm text-[var(--mv-muted)]">Price</dt>
                  <dd className="font-medium">
                    {formatCurrency(property.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-[var(--mv-muted)]">Location</dt>
                  <dd className="font-medium">{property.location}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-[var(--mv-muted)]">Asset type</dt>
                  <dd className="font-medium">{property.propertyType}</dd>
                </div>
              </dl>

              <div
                className={`rounded-lg border p-3 text-[15px] ${FIT_STYLES[fit.tone]}`}
              >
                <div className="mb-1 flex items-center gap-1.5 font-medium">
                  {fit.tone === "fit" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : fit.tone === "conditional" ? (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                  {fit.label}
                </div>
                <p className="leading-relaxed">{opp.mandateFitNotes}</p>
              </div>

              <p className="text-sm text-[var(--mv-muted)]">
                Next: {computeNextAction(state, opp)}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/opportunities/${opp.id}`}>View Details</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/opportunities/${opp.id}`}>
                    Review Checklist
                  </Link>
                </Button>
                {canSelect ? (
                  <Button
                    size="sm"
                    onClick={() => handleSelect(opp.id, property.code)}
                  >
                    Select for Due Diligence
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

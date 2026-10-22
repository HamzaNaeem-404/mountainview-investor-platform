"use client";

import { useState } from "react";
import { Menu, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store";

interface AppShellProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AppShell({
  title,
  breadcrumbs,
  children,
  actions,
}: AppShellProps) {
  const [open, setOpen] = useState(false);
  const { resetDemo, hydrated } = useDemoStore();

  const handleReset = () => {
    resetDemo();
    toast.success("Demo data restored to the original fictional state");
  };

  return (
    <div className="flex min-h-screen bg-[var(--mv-canvas)]">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2 text-center text-xs font-medium tracking-wide text-amber-950 sm:text-sm">
          Illustrative Demo — Fictional Data
        </div>

        <header className="sticky top-0 z-30 border-b border-[var(--mv-border)] bg-[var(--mv-canvas)]/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                {breadcrumbs && breadcrumbs.length > 0 ? (
                  <p className="truncate text-xs text-[var(--mv-muted)]">
                    {breadcrumbs.map((crumb, i) => (
                      <span key={`${crumb.label}-${i}`}>
                        {i > 0 ? " / " : ""}
                        {crumb.label}
                      </span>
                    ))}
                  </p>
                ) : null}
                <h1 className="truncate font-[family-name:var(--font-display)] text-xl text-[var(--mv-forest-deep)] sm:text-2xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {actions}
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!hydrated}
                title="Restore original fictional demo data"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Demo Data</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}

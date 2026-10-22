export function LoadingState({ label = "Loading demo…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--mv-muted)]">
      {label}
    </div>
  );
}

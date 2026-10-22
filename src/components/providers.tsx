"use client";

import { Toaster } from "sonner";
import { DemoStoreProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoStoreProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-[family-name:var(--font-sans)]",
        }}
      />
    </DemoStoreProvider>
  );
}

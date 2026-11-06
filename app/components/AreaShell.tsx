import { SiteFooter } from "@/app/components/SiteFooter";
import type { ReactNode } from "react";

export function AreaShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-porcelain pb-[calc(4.4rem+env(safe-area-inset-bottom))] text-ink md:pb-0">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      <div className="shrink-0">
        <SiteFooter compact />
      </div>
    </div>
  );
}

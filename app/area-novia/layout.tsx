import { SiteFooter } from "@/app/components/SiteFooter";
import type { ReactNode } from "react";

export default function ClientAreaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-porcelain text-ink">
      {children}
      <SiteFooter />
    </div>
  );
}

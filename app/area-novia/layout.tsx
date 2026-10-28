import { AreaShell } from "@/app/components/AreaShell";
import type { ReactNode } from "react";

export default function ClientAreaLayout({ children }: { children: ReactNode }) {
  return <AreaShell>{children}</AreaShell>;
}

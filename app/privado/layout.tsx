import { AreaShell } from "@/app/components/AreaShell";
import type { ReactNode } from "react";

export default function PrivateAreaLayout({ children }: { children: ReactNode }) {
  return <AreaShell>{children}</AreaShell>;
}

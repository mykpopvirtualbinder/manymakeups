import { SiteFooter } from "../SiteFooter";
import { ShopHeader } from "./ShopHeader";
import type { ReactNode } from "react";

export function ShopFrame({
  kicker,
  title,
  lead,
  children,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-porcelain text-ink">
      <ShopHeader />
      <main className="shop-shell mx-auto max-w-[1120px] px-6 pb-24 pt-8 md:px-10">
        {kicker ? <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gilt">{kicker}</p> : null}
        <h1 className={`font-serif text-4xl leading-tight tracking-tight md:text-5xl ${kicker ? "mt-4" : ""}`}>{title}</h1>
        {lead ? <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">{lead}</p> : null}
        <div className="mt-10">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

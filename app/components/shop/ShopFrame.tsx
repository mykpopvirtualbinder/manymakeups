import { SiteFooter } from "../SiteFooter";
import { ShopHeader } from "./ShopHeader";
import type { ReactNode } from "react";

export function ShopFrame({
  kicker,
  title,
  lead,
  crumb,
  children,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  crumb?: { href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-porcelain text-ink">
      <ShopHeader />
      <main className="shop-shell mx-auto max-w-[1120px] px-6 pb-24 pt-8 md:px-10">
        {crumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-6 text-[0.68rem] uppercase tracking-[0.16em] text-ash">
            {crumb.map((item, index) => (
              <span key={item.href}>
                {index > 0 ? <span className="px-2">/</span> : null}
                <a className="hover:text-ink" href={item.href}>
                  {item.label}
                </a>
              </span>
            ))}
          </nav>
        ) : null}
        {kicker ? <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gilt">{kicker}</p> : null}
        <h1 className={`font-serif text-4xl leading-tight tracking-tight md:text-5xl ${kicker ? "mt-4" : ""}`}>{title}</h1>
        {lead ? <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash">{lead}</p> : null}
        <div className="mt-10">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

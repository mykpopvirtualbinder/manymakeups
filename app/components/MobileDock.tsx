"use client";

import { stripLocale } from "@/lib/i18n/path";
import { useState } from "react";

type LinkItem = { href: string; label: string };

function Icon({ name }: { name: "shop" | "clients" | "lookbook" | "atelier" | "menu" }) {
  const common = { viewBox: "0 0 24 24", className: "size-5", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true as const };
  if (name === "shop") {
    return (
      <svg {...common}>
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6.5 10.2V20h11V10.2" />
        <path d="M10 20v-5h4v5" />
      </svg>
    );
  }
  if (name === "clients") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19.5c1.2-3 3.4-4.5 6.5-4.5s5.3 1.5 6.5 4.5" />
      </svg>
    );
  }
  if (name === "lookbook") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="14" />
        <path d="m8 15 2.5-3 2 2.2L15 11l3 4" />
      </svg>
    );
  }
  if (name === "atelier") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v2.5M12 18v2.5M3.5 12H6M18 12h2.5M6 6l1.8 1.8M16.2 16.2 18 18M18 6l-1.8 1.8M7.8 16.2 6 18" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function MobileDock({
  path,
  pinned,
  more,
  menuLabel,
  moreLabel,
  closeLabel,
}: {
  path: string;
  pinned: { href: string; label: string; icon: "shop" | "clients" | "lookbook" | "atelier" }[];
  more: LinkItem[];
  menuLabel: string;
  moreLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const active = (href: string) => {
    const clean = stripLocale(href.split("#")[0] || "/");
    if (clean === "/") return false;
    if (clean === "/tienda") return path.startsWith("/tienda");
    return path === clean || path.startsWith(`${clean}/`);
  };

  return (
    <>
      {open ? (
        <div className="md:hidden">
          <button type="button" className="fixed inset-0 z-40 bg-ink/30" aria-label={closeLabel} onClick={() => setOpen(false)} />
          <nav className="fixed inset-x-0 bottom-[calc(4.4rem+env(safe-area-inset-bottom))] z-50 border border-ink/10 bg-porcelain px-5 py-4">
            <ul className="flex flex-col">
              {more.map((item) => (
                <li key={item.href} className="border-b border-ink/10 last:border-b-0">
                  <a className="block py-3 text-sm uppercase tracking-[0.14em] text-ink" href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-ink/10 bg-porcelain/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label={menuLabel}
      >
        {pinned.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[0.58rem] uppercase leading-tight tracking-[0.06em] ${active(item.href) ? "text-ink" : "text-ash"}`}
          >
            <Icon name={item.icon} />
            <span className="max-w-full truncate">{item.label}</span>
          </a>
        ))}
        <button
          type="button"
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[0.58rem] uppercase leading-tight tracking-[0.06em] ${open ? "text-ink" : "text-ash"}`}
          aria-expanded={open}
          aria-label={menuLabel}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name="menu" />
          <span>{moreLabel}</span>
        </button>
      </nav>
    </>
  );
}

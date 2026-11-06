import Image from "next/image";
import type { ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";
import { site } from "@/lib/site";
import { getLocale, getMessages, localePath } from "@/lib/i18n";

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      {children}
    </svg>
  );
}

const marks = {
  shop: (
    <Mark>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 10.2V20h11V10.2" />
      <path d="M10 20v-5h4v5" />
    </Mark>
  ),
  clients: (
    <Mark>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.5c1.2-3 3.4-4.5 6.5-4.5s5.3 1.5 6.5 4.5" />
    </Mark>
  ),
  notice: (
    <Mark>
      <path d="M7 3.5h7l4 4V20.5H7z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12h6M9 15.5h6" />
    </Mark>
  ),
  privacy: (
    <Mark>
      <path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 6.8-7 8.3-4.2-1.5-7-4.1-7-8.3V6.5z" />
    </Mark>
  ),
  cookies: (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <circle cx="9" cy="10" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="8.5" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="10" cy="14.5" r="0.7" fill="currentColor" stroke="none" />
    </Mark>
  ),
  terms: (
    <Mark>
      <path d="M7 4h8a2 2 0 0 1 2 2v13H9a2 2 0 0 0-2 2V4z" />
      <path d="M7 19a2 2 0 0 0 2 2h10V7" />
    </Mark>
  ),
  purchase: (
    <Mark>
      <rect x="3.5" y="6" width="17" height="12" />
      <path d="M3.5 10h17" />
    </Mark>
  ),
  shipping: (
    <Mark>
      <path d="M3 7.5h11v8H3z" />
      <path d="M14 11h4l3 3v1.5h-7" />
      <circle cx="7" cy="17.5" r="1.3" />
      <circle cx="17" cy="17.5" r="1.3" />
    </Mark>
  ),
  returns: (
    <Mark>
      <path d="M4 9h9a5 5 0 1 1 0 10H8" />
      <path d="M7 6 4 9l3 3" />
    </Mark>
  ),
};

export async function SiteFooter({ compact = false }: { compact?: boolean }) {
  const locale = await getLocale();
  const t = getMessages(locale);
  const shortcuts = [
    { href: "/aviso-legal", label: t.footer.notice, icon: marks.notice },
    { href: "/privacidad", label: t.footer.privacy, icon: marks.privacy },
    { href: "/cookies", label: t.footer.cookies, icon: marks.cookies },
    { href: "/condiciones-de-venta", label: t.footer.terms, icon: marks.terms },
    { href: "/condiciones-de-compra", label: t.footer.purchase, icon: marks.purchase },
    { href: "/envios", label: t.footer.shipping, icon: marks.shipping },
    { href: "/devoluciones", label: t.footer.returns, icon: marks.returns },
    { href: "/tienda", label: t.footer.shop, icon: marks.shop },
    { href: "/area-novia", label: t.nav.brideArea, icon: marks.clients },
  ];
  const mobileShortcuts = [shortcuts[7], shortcuts[8], ...shortcuts.slice(0, 7)];

  return (
    <footer className="border-t border-ink/10">
      <div className={`mx-auto flex max-w-[1120px] flex-col text-[0.7rem] uppercase tracking-[0.18em] text-ash sm:flex-row sm:items-center sm:justify-between ${compact ? "gap-2 px-4 py-3 md:px-10" : "gap-4 px-6 py-8 md:px-10"}`}>
        <div className="flex items-center gap-3">
          <BrandLogo size="footer" className={compact ? "size-10" : undefined} />
          <div>
            <p>{site.legalName}</p>
            <p className="mt-1">
              {site.streetAddress} · {site.postalCode} {site.city}, {site.region}
            </p>
            <p className="mt-1">Est. {site.founded}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <a className="hover:text-ink" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="hover:text-ink" href={`tel:${site.phone}`}>
            {site.phoneDisplay}
          </a>
        </div>
      </div>
      <div className="border-t border-ink/10 bg-linen/50">
        <div className={`mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-8 md:px-10 ${compact ? "gap-y-2 px-4 py-3" : "gap-y-4 px-6 py-5"}`}>
          <nav className="grid w-full grid-cols-3 gap-1 sm:hidden" aria-label={t.footer.legal}>
            {mobileShortcuts.map((item) => (
              <a
                key={item.href}
                className="flex flex-col items-center gap-1.5 px-1 py-2 text-center text-[0.62rem] uppercase leading-tight tracking-[0.06em] text-ink"
                href={localePath(locale, item.href)}
              >
                <span className="flex size-10 items-center justify-center border border-ink/15">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <nav className="hidden flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink sm:flex" aria-label={t.footer.legal}>
            {shortcuts.map((item) => (
              <a key={item.href} className="underline-offset-4 hover:underline" href={localePath(locale, item.href)}>
                {item.label}
              </a>
            ))}
          </nav>
          <Image
            src="/brand/footer/logo-omyo.png"
            alt="Omyo Creator Lab"
            width={226}
            height={100}
            sizes="160px"
            className={compact ? "mx-auto h-9 w-auto sm:mx-0" : "mx-auto h-14 w-auto sm:mx-0"}
          />
        </div>
      </div>
    </footer>
  );
}

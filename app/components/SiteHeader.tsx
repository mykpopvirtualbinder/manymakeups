import { BrandLogo } from "./BrandLogo";
import { LanguageSwitch } from "./LanguageSwitch";
import { site } from "@/lib/site";
import { getLocale, getMessages, localePath } from "@/lib/i18n";
import { getRequestPathname } from "@/lib/i18n/server";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const path = await getRequestPathname();
  const links = [
    { href: localePath(locale, "/#looks"), label: t.nav.looks },
    { href: localePath(locale, "/#lookbook"), label: t.nav.lookbook },
    { href: localePath(locale, "/#servicios"), label: t.nav.atelier },
    { href: localePath(locale, "/#metodo"), label: t.nav.metodo },
    { href: localePath(locale, "/#ana"), label: t.nav.about },
    { href: localePath(locale, "/tienda"), label: t.nav.shop },
    { href: localePath(locale, "/area-novia"), label: t.nav.brideArea },
    { href: "/privado", label: t.nav.private },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-porcelain/95">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 md:px-10 md:py-4 md:pt-4">
        <a
          href={localePath(locale, "/")}
          id="site-header-logo"
          className="header-logo shrink-0"
          aria-label={site.legalName}
        >
          <BrandLogo
            size="header"
            className="size-[6.25rem] sm:size-[7.75rem] md:size-[7.75rem] lg:size-[8.5rem]"
          />
        </a>
        <div className="flex min-w-0 items-center gap-3 sm:gap-6 md:gap-10">
          <nav
            className="hidden items-center gap-5 lg:gap-8 md:flex"
            aria-label={t.nav.principal}
          >
            {links.map((link) => (
              <a
                key={link.href}
                className="nav-link text-ash hover:text-ink"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <LanguageSwitch current={locale} path={path} enabled />
          <a
            className="inline-flex size-10 items-center justify-center text-ink md:hidden"
            href="/privado"
            aria-label={t.nav.private}
          >
            <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="1.5" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </a>
          <a
            className="inline-flex size-10 items-center justify-center text-ink"
            href={localePath(locale, "/#contacto")}
            aria-label={t.nav.contact}
          >
            <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 7 9-7" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

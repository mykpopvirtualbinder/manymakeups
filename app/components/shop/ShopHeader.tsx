import { LanguageSwitch } from "../LanguageSwitch";
import { BrandLogo } from "../BrandLogo";
import { CartLink } from "./CartLink";
import { site } from "@/lib/site";
import { getLocale, getMessages, localePath } from "@/lib/i18n";
import { getRequestPathname } from "@/lib/i18n/server";
import { getShopCustomer } from "@/lib/shop/session";
import { isShopAdminEmail } from "@/lib/shop/access";
import { requireAdmin } from "@/lib/portal/session";

export async function ShopHeader() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const path = await getRequestPathname();
  const customer = await getShopCustomer();
  const onShopHome = path === "/tienda";
  const backHref = localePath(locale, onShopHome ? "/" : "/tienda");
  const backLabel = onShopHome ? t.nav.backToSite : t.nav.backToShop;
  const shopAdmin = Boolean(await requireAdmin()) || Boolean(customer && isShopAdminEmail(customer.email));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-porcelain/95">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 md:px-10 md:py-4 md:pt-4">
        <a href={localePath(locale, "/")} className="header-logo shrink-0" aria-label={site.legalName}>
          <BrandLogo
            size="header"
            className="size-[6.25rem] sm:size-[7.75rem] md:size-[7.75rem] lg:size-[8.5rem]"
          />
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            className="inline-flex shrink-0 items-center whitespace-nowrap border border-ink px-2 py-2 text-[0.56rem] uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-porcelain sm:px-3 sm:text-[0.62rem] sm:tracking-[0.14em]"
            href={backHref}
          >
            {backLabel}
          </a>
          <LanguageSwitch current={locale} path={path} enabled />
          {shopAdmin ? (
            <a className="hidden text-[0.62rem] uppercase tracking-[0.14em] text-gilt hover:text-ink sm:inline" href="/privado/tienda">
              Admin
            </a>
          ) : null}
          <a
            className="inline-flex size-10 items-center justify-center text-ink"
            href={localePath(locale, "/tienda/cuenta")}
            aria-label={t.nav.account}
          >
            <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19.5c1.2-3 3.4-4.5 6.5-4.5s5.3 1.5 6.5 4.5" />
            </svg>
          </a>
          <CartLink label={t.nav.cart} />
        </div>
      </div>
    </header>
  );
}

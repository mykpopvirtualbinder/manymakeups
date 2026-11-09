import Image from "next/image";
import { BrandLogo } from "./BrandLogo";
import { FooterLegal } from "./FooterLegal";
import { site } from "@/lib/site";
import { getLocale, getMessages, localePath } from "@/lib/i18n";

export async function SiteFooter({ compact = false }: { compact?: boolean }) {
  const locale = await getLocale();
  const t = getMessages(locale);
  const links = [
    { href: localePath(locale, "/aviso-legal"), label: t.footer.notice },
    { href: localePath(locale, "/privacidad"), label: t.footer.privacy },
    { href: localePath(locale, "/cookies"), label: t.footer.cookies },
    { href: localePath(locale, "/condiciones-de-venta"), label: t.footer.terms },
    { href: localePath(locale, "/condiciones-de-compra"), label: t.footer.purchase },
    { href: localePath(locale, "/envios"), label: t.footer.shipping },
    { href: localePath(locale, "/devoluciones"), label: t.footer.returns },
    { href: localePath(locale, "/tienda"), label: t.footer.shop },
    { href: localePath(locale, "/area-novia"), label: t.nav.brideArea },
  ];

  return (
    <footer className="border-t border-ink/10">
      <div className={`mx-auto hidden max-w-[1120px] text-[0.7rem] uppercase tracking-[0.18em] text-ash md:flex md:flex-row md:items-center md:justify-between ${compact ? "gap-2 px-4 py-3 md:px-10" : "gap-4 px-6 py-8 md:px-10"}`}>
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
      <div className="bg-linen/50 md:border-t md:border-ink/10">
        <div className={`relative mx-auto flex max-w-[1120px] flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:px-10 ${compact ? "px-4 py-2" : "px-4 py-3 md:gap-y-4 md:px-6 md:py-5"}`}>
          <nav className="hidden flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink md:flex" aria-label={t.footer.legal}>
            {links.map((item) => (
              <a key={item.href} className="underline-offset-4 hover:underline" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-3 md:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <BrandLogo size="footer" className="size-9" />
              <div className="min-w-0 text-[0.68rem] normal-case leading-snug tracking-normal text-ash">
                <p className="truncate text-ink">{site.legalName}</p>
                <p className="truncate">
                  <a className="hover:text-ink" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </p>
              </div>
            </div>
            <FooterLegal label={t.footer.legal} links={links} />
          </div>
          <Image
            src="/brand/footer/logo-omyo.png"
            alt="Omyo Creator Lab"
            width={226}
            height={100}
            sizes="160px"
            className={`hidden w-auto md:block ${compact ? "h-9" : "h-14"}`}
          />
        </div>
      </div>
      {compact ? null : <div className="h-[calc(4.4rem+env(safe-area-inset-bottom))] md:hidden" />}
    </footer>
  );
}

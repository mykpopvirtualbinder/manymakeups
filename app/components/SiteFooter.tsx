import Image from "next/image";
import { BrandLogo } from "./BrandLogo";
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
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink" aria-label={t.footer.legal}>
            {links.map((item) => (
              <a key={item.href} className="underline-offset-4 hover:underline" href={item.href}>
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
            className={compact ? "h-9 w-auto" : "h-14 w-auto"}
          />
        </div>
      </div>
      {compact ? null : <div className="h-[calc(4.4rem+env(safe-area-inset-bottom))] md:hidden" />}
    </footer>
  );
}

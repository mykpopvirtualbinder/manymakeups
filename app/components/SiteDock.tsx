import { MobileDock } from "./MobileDock";
import { getLocale, getMessages, localePath } from "@/lib/i18n";
import { getRequestPathname } from "@/lib/i18n/server";

export async function SiteDock() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const path = await getRequestPathname();

  return (
    <MobileDock
      path={path}
      menuLabel={t.nav.principal}
      moreLabel={locale === "en" ? "Menu" : locale === "fr" ? "Menu" : "Menú"}
      closeLabel={t.common.close}
      pinned={[
        { href: localePath(locale, "/tienda"), label: t.nav.shop, icon: "shop" },
        { href: localePath(locale, "/area-novia"), label: t.nav.brideArea, icon: "clients" },
        { href: localePath(locale, "/#lookbook"), label: t.nav.lookbook, icon: "lookbook" },
        { href: localePath(locale, "/#servicios"), label: t.nav.atelier, icon: "atelier" },
      ]}
      more={[
        { href: localePath(locale, "/#looks"), label: t.nav.looks },
        { href: localePath(locale, "/#metodo"), label: t.nav.metodo },
        { href: localePath(locale, "/#ana"), label: t.nav.about },
        { href: localePath(locale, "/#contacto"), label: t.nav.contact },
      ]}
    />
  );
}

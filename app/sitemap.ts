import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/path";
import { products } from "@/lib/shop/catalog";
import { services, site } from "@/lib/site";

function priorityFor(path: string) {
  if (path === "/") return 1;
  if (path === "/parejas" || path === "/eventos") return 0.9;
  if (path === "/formacion" || path === "/piel" || path === "/profesionales") return 0.8;
  if (path === "/tienda") return 0.6;
  if (path.startsWith("/tienda/")) return 0.5;
  return 0.3;
}

const yearly = new Set([
  "/aviso-legal",
  "/privacidad",
  "/cookies",
  "/condiciones-de-venta",
  "/condiciones-de-compra",
  "/envios",
  "/devoluciones",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [
    "/",
    ...services.map((service) => service.href),
    "/tienda",
    ...products.map((product) => `/tienda/${product.slug}`),
    ...yearly,
  ];

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, `${site.url}${localePath(locale, path)}`]),
    );
    return locales.map((locale) => ({
      url: `${site.url}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: (yearly.has(path) ? "yearly" : "monthly") as "yearly" | "monthly",
      priority: priorityFor(path),
      alternates: { languages },
    }));
  });
}

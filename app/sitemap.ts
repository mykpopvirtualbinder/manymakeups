import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/path";
import { products } from "@/lib/shop/catalog";
import { services, site } from "@/lib/site";

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
      priority: path === "/" ? 1 : path.startsWith("/tienda") ? 0.7 : 0.4,
      alternates: { languages },
    }));
  });
}

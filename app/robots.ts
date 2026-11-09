import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/area-novia",
        "/privado",
        "/api/portal",
        "/api/admin",
        "/api/email",
        "/tienda/carrito",
        "/tienda/pedido",
        "/tienda/cuenta",
        "/en/tienda/carrito",
        "/en/tienda/pedido",
        "/en/tienda/cuenta",
        "/fr/tienda/carrito",
        "/fr/tienda/pedido",
        "/fr/tienda/cuenta",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

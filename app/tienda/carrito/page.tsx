import { CartView } from "@/app/components/shop/CartView";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { getShopCustomer } from "@/lib/shop/session";
import type { Metadata } from "next";

const copy: Record<Locale, { kicker: string; title: string }> = {
  es: { kicker: "Tienda", title: "Tu cesta." },
  en: { kicker: "Shop", title: "Your basket." },
  fr: { kicker: "Boutique", title: "Votre panier." },
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Basket" : locale === "fr" ? "Panier" : "Cesta",
    robots: { index: false, follow: false },
  };
}

export default async function CartPage() {
  const customer = await getShopCustomer();
  const labels = copy[await getLocale()];
  return (
    <ShopFrame kicker={labels.kicker} title={labels.title}>
      <CartView province={customer?.province || ""} />
    </ShopFrame>
  );
}

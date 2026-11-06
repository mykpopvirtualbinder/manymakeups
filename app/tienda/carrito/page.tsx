import { CartView } from "@/app/components/shop/CartView";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { getShopCustomer } from "@/lib/shop/session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cesta",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const customer = await getShopCustomer();
  return (
    <ShopFrame kicker="Tienda" title="Tu cesta.">
      <CartView province={customer?.province || ""} />
    </ShopFrame>
  );
}

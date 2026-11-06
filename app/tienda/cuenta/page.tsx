import { AccountForms, AccountHome } from "@/app/components/shop/AccountForms";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { getShopCustomer } from "@/lib/shop/session";
import { isShopAdminEmail } from "@/lib/shop/access";
import { toPublicCustomer } from "@/lib/shop/types";
import { safeNext } from "@/lib/shop/validate";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cuenta",
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const customer = await getShopCustomer();
  const next = safeNext((await searchParams).next, "/tienda");
  return (
    <ShopFrame
      kicker="Tienda"
      title={customer ? "Tu cuenta." : "Entra para comprar."}
      lead={customer ? "Estos datos se usan en el envío y, cuando toca, en la factura." : "Hace falta una cuenta con teléfono, nombre y dirección completa. El DNI se pide si el envío es a Canarias, Ceuta o Melilla, o si quieres factura."}
    >
      {customer ? <AccountHome customer={toPublicCustomer(customer)} admin={isShopAdminEmail(customer.email)} /> : <AccountForms next={next} />}
    </ShopFrame>
  );
}

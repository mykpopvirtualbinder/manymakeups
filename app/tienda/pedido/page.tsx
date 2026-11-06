import { CheckoutForm } from "@/app/components/shop/CheckoutForm";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { paymentMode } from "@/lib/shop/payments";
import { getShopCustomer } from "@/lib/shop/session";
import { toPublicCustomer } from "@/lib/shop/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pago",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const customer = await getShopCustomer();
  if (!customer) redirect("/tienda/cuenta?next=/tienda/pedido");
  const mode = paymentMode();

  return (
    <ShopFrame
      kicker="Tienda"
      title="Pago."
      lead="Revisa la dirección. El importe se reserva y solo se cobra cuando confirmo que el modelo y el color están disponibles."
    >
      {mode === "unavailable" ? (
        <p>El pago no está disponible hasta conectar la pasarela.</p>
      ) : (
        <CheckoutForm customer={toPublicCustomer(customer)} local={mode === "local"} />
      )}
    </ShopFrame>
  );
}

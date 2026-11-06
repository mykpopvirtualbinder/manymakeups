import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { statusLabel } from "@/lib/shop/orders";
import { formatMoney } from "@/lib/shop/quote";
import { getShopCustomer } from "@/lib/shop/session";
import { listOrdersByCustomer } from "@/lib/shop/store";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis pedidos",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const customer = await getShopCustomer();
  if (!customer) redirect("/tienda/cuenta?next=/tienda/cuenta/pedidos");
  const orders = await listOrdersByCustomer(customer.id);

  return (
    <ShopFrame kicker="Tienda" title="Tus pedidos.">
      {orders.length === 0 ? <p className="text-ash">Todavía no hay pedidos.</p> : null}
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {orders.map((order) => (
          <li key={order.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <a className="font-serif text-2xl hover:text-gilt" href={`/tienda/pedido/${order.id}`}>
                {order.number}
              </a>
              <p className="mt-1 text-sm text-ash">{statusLabel(order.status)}</p>
            </div>
            <p className="font-serif text-2xl">{formatMoney(order.totalCents)}</p>
          </li>
        ))}
      </ul>
    </ShopFrame>
  );
}

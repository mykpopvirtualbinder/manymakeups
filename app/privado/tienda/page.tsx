import { PortalFrame } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { ShopAdminNav } from "@/app/components/shop/ShopAdminNav";
import { requireShopStaff } from "@/lib/shop/access";
import { statusLabel } from "@/lib/shop/orders";
import { formatMoney } from "@/lib/shop/quote";
import { listCustomers, listOrders } from "@/lib/shop/store";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedidos de la tienda",
  robots: { index: false, follow: false },
};

export default async function StudioShopPage() {
  const admin = await requireShopStaff();
  if (!admin) redirect("/privado");
  const [orders, customers] = await Promise.all([listOrders(), listCustomers()]);
  const waiting = orders.filter((order) => order.status === "authorized").length;
  const charged = orders.filter((order) => order.status === "confirmed" || order.status === "shipped");
  const chargedCents = charged.reduce((sum, order) => sum + order.totalCents, 0);

  return (
    <PortalFrame
      pinned
      studio
      wide
      kicker="Tienda"
      title="Pedidos de extensiones."
      lead="No hay consulta automática de stock. Cuando entre un pedido reservado, míralo en La Casa del Pelo y solo entonces cobra. La retención de la tarjeta dura unos 7 días."
      aside={<StudioAside />}
    >
      <div data-portal-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16">
        <ShopAdminNav current="pedidos" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Clientes" value={String(customers.length)} />
          <Stat label="Por confirmar" value={String(waiting)} />
          <Stat label="Cobrado" value={formatMoney(chargedCents)} />
        </div>
        <p className="mt-6 text-sm text-ash">
          {waiting ? `${waiting} pendiente${waiting === 1 ? "" : "s"} de confirmar.` : "No hay reservas esperando."} {orders.length} pedido{orders.length === 1 ? "" : "s"} en total.
        </p>
        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {orders.map((order) => (
            <li key={order.id}>
              <a className="flex flex-col gap-1 py-4 hover:text-gilt sm:flex-row sm:items-center sm:justify-between" href={`/privado/tienda/${order.id}`}>
                <span>
                  <span className="font-serif text-2xl text-ink">{order.number}</span>
                  <span className="mt-1 block text-sm text-ash">
                    {order.firstName} {order.lastName} · {statusLabel(order.status)}
                    {order.exempt ? " · sin IVA" : ""}
                  </span>
                </span>
                <span className="font-serif text-2xl text-ink">{formatMoney(order.totalCents)}</span>
              </a>
            </li>
          ))}
        </ul>
        {orders.length === 0 ? <p className="mt-6 text-sm text-ash">Todavía no hay pedidos.</p> : null}
      </div>
    </PortalFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 px-4 py-3">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ash">{label}</p>
      <p className="mt-1 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}

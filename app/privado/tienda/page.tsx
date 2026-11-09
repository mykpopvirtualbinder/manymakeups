import { PortalFrame, PortalNotice } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { OrderDesk, type OrderRow } from "@/app/components/shop/OrderDesk";
import { ShopAdminNav } from "@/app/components/shop/ShopAdminNav";
import { requireShopStaff } from "@/lib/shop/access";
import { confirmedCharge, statusLabel } from "@/lib/shop/orders";
import { formatMoney } from "@/lib/shop/quote";
import { listCustomers, listOrders } from "@/lib/shop/store";
import type { Order } from "@/lib/shop/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedidos de la tienda",
  robots: { index: false, follow: false },
};

export default async function StudioShopPage({ searchParams }: { searchParams: Promise<{ archivo?: string; error?: string }> }) {
  const admin = await requireShopStaff();
  if (!admin) redirect("/privado");
  const query = await searchParams;
  const archive = query.archivo === "1";
  const [orders, customers] = await Promise.all([listOrders(), listCustomers()]);
  const active = orders.filter((order) => !order.archivedAt);
  const archived = orders.filter((order) => order.archivedAt);
  const visible = archive ? archived : active;
  const waiting = active.filter((order) => order.status === "authorized").length;
  const charged = active.filter((order) => order.status === "confirmed" || order.status === "shipped");
  const chargedCents = charged.reduce((sum, order) => sum + order.totalCents, 0);

  return (
    <PortalFrame
      pinned
      studio
      wide
      kicker="Tienda"
      title="Tienda."
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
          {archive ? (
            <>
              {archived.length} archivado{archived.length === 1 ? "" : "s"}. <a className="underline" href="/privado/tienda">Volver a los pedidos en curso.</a>
            </>
          ) : (
            <>
              {waiting ? `${waiting} pendiente${waiting === 1 ? "" : "s"} de confirmar.` : "No hay reservas esperando."} {active.length} pedido{active.length === 1 ? "" : "s"} en curso.
              {archived.length ? (
                <>
                  {" "}
                  <a className="underline" href="/privado/tienda?archivo=1">
                    {archived.length} archivado{archived.length === 1 ? "" : "s"}.
                  </a>
                </>
              ) : null}
            </>
          )}
        </p>
        {query.error ? <PortalNotice>{query.error}</PortalNotice> : null}
        <OrderDesk orders={visible.map(orderRow)} archive={archive} />
      </div>
    </PortalFrame>
  );
}

function orderRow(order: Order): OrderRow {
  const charge = confirmedCharge(order);
  const adjusted = order.status === "authorized" && !charge.pending && charge.captureCents !== order.totalCents;
  const reserved = charge.reservedCents > 0 && (order.status === "confirmed" || order.status === "shipped");
  return {
    id: order.id,
    number: order.number,
    name: `${order.firstName} ${order.lastName}`,
    email: order.email,
    phone: order.phone,
    city: order.address.city,
    status: order.status,
    statusText: statusLabel(order.status),
    exempt: order.exempt,
    reserved,
    reservedLabel: reserved ? `reserva ${formatMoney(charge.reservedCents)}` : "",
    amount: formatMoney(adjusted ? charge.captureCents : order.totalCents),
    previous: adjusted ? formatMoney(order.totalCents) : "",
    closed: order.status === "cancelled" || order.status === "refunded",
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 px-4 py-3">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ash">{label}</p>
      <p className="mt-1 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}

import { PortalFrame, PortalNotice } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { ShopAdminNav } from "@/app/components/shop/ShopAdminNav";
import { requireShopStaff } from "@/lib/shop/access";
import { confirmedCharge, statusLabel } from "@/lib/shop/orders";
import { formatMoney } from "@/lib/shop/quote";
import { listCustomers, listOrders } from "@/lib/shop/store";
import type { Order } from "@/lib/shop/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

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
        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {visible.map((order) => {
            const charge = confirmedCharge(order);
            const adjusted = order.status === "authorized" && !charge.pending && charge.captureCents !== order.totalCents;
            const closed = order.status === "cancelled" || order.status === "refunded";
            return (
              <li key={order.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
                <a className="min-w-0 flex-1 hover:text-gilt" href={`/privado/tienda/${order.id}`}>
                  <span className="block truncate text-sm text-ash">
                    <span className="font-serif text-2xl text-ink">{order.number}</span>
                    <span className="ml-3">
                      {order.firstName} {order.lastName} · {statusLabel(order.status)}
                      {order.exempt ? " · sin IVA" : ""}
                      {charge.reservedCents > 0 && (order.status === "confirmed" || order.status === "shipped")
                        ? ` · reserva ${formatMoney(charge.reservedCents)}`
                        : ""}
                    </span>
                  </span>
                </a>
                <div className="flex items-center justify-between gap-4 md:justify-end">
                  <span className="shrink-0 text-right font-serif text-2xl text-ink">
                    {adjusted ? <span className="mb-1 block text-sm text-ash line-through">{formatMoney(order.totalCents)}</span> : null}
                    {formatMoney(adjusted ? charge.captureCents : order.totalCents)}
                  </span>
                  <OrderActions order={order} archive={archive} canVoid={!closed} />
                </div>
              </li>
            );
          })}
        </ul>
        {visible.length === 0 ? <p className="mt-6 text-sm text-ash">{archive ? "No hay pedidos archivados." : "Todavía no hay pedidos."}</p> : null}
      </div>
    </PortalFrame>
  );
}

function OrderActions({ order, archive, canVoid }: { order: Order; archive: boolean; canVoid: boolean }) {
  const back = archive ? "archivo" : "";
  return (
    <div className="flex shrink-0 items-start gap-2">
      <Mark href={`/privado/tienda/${order.id}`} label="Entrar">
        <EnterIcon />
      </Mark>
      <MarkForm orderId={order.id} action="void" label="Anular" back={back} disabled={!canVoid}>
        <VoidIcon />
      </MarkForm>
      <MarkForm orderId={order.id} action="delete" label="Borrar" back={back}>
        <TrashIcon />
      </MarkForm>
      <MarkForm orderId={order.id} action={archive ? "unarchive" : "archive"} label={archive ? "Recuperar" : "Archivar"} back={back}>
        <ArchiveIcon />
      </MarkForm>
    </div>
  );
}

function Mark({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a className="group flex min-w-11 flex-col items-center gap-1 text-ink" href={href} aria-label={label} title={label}>
      <span className="grid size-9 place-items-center border border-ink/15 transition group-hover:border-ink group-hover:bg-ink group-hover:text-porcelain">{children}</span>
      <span className="text-[0.58rem] uppercase tracking-[0.12em] text-ash group-hover:text-ink">{label}</span>
    </a>
  );
}

function MarkForm({
  orderId,
  action,
  label,
  back,
  disabled,
  children,
}: {
  orderId: string;
  action: string;
  label: string;
  back: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action="/api/admin/shop" method="post">
      <input type="hidden" name="from" value="list" />
      <input type="hidden" name="return" value={back} />
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="action" value={action} />
      <button className="group flex min-w-11 flex-col items-center gap-1 text-ink disabled:pointer-events-none disabled:opacity-30" type="submit" aria-label={label} title={label} disabled={disabled}>
        <span className="grid size-9 place-items-center border border-ink/15 transition group-hover:border-ink group-hover:bg-ink group-hover:text-porcelain">
          {children}
        </span>
        <span className="text-[0.58rem] uppercase tracking-[0.12em] text-ash group-hover:text-ink">{label}</span>
      </button>
    </form>
  );
}

function EnterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M14 5h5v14h-5" />
      <path d="M4 12h11" />
      <path d="m11 8 4 4-4 4" />
    </svg>
  );
}

function VoidIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="m8 8 8 8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7l1 13h8l1-13" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 6h18v4H3z" />
      <path d="M5 10v8h14v-8" />
      <path d="M10 14h4" />
    </svg>
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

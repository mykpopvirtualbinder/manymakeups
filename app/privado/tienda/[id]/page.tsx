import { PortalFrame, PortalNotice } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { confirmedCharge, statusLabel } from "@/lib/shop/orders";
import { EXEMPT_INVOICE_NOTE, formatMoney } from "@/lib/shop/quote";
import { getOrder } from "@/lib/shop/store";
import { ShopAdminNav } from "@/app/components/shop/ShopAdminNav";
import { requireShopStaff } from "@/lib/shop/access";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedido de la tienda",
  robots: { index: false, follow: false },
};

export default async function StudioOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string; cobro?: string }>;
}) {
  const admin = await requireShopStaff();
  if (!admin) redirect("/privado");
  const { id } = await params;
  const query = await searchParams;
  const cobro = query.cobro && /^https?:\/\//.test(query.cobro) ? query.cobro : "";
  const order = await getOrder(id);
  if (!order) notFound();
  const carrier = order.carrier || "Correos";
  const charge = confirmedCharge(order);
  const note = chargeNote(charge);
  const open = order.status === "authorized" || order.status === "pending_payment";

  return (
    <PortalFrame
      pinned
      studio
      wide
      kicker={order.number}
      title={statusLabel(order.status)}
      aside={<StudioAside />}
    >
      <div data-portal-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16">
        <a className="mb-2 inline-flex size-11 items-center justify-center text-ink" href="/privado/tienda" aria-label="Volver a pedidos">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M15 5 8 12l7 7" />
          </svg>
        </a>
        <ShopAdminNav current="pedidos" />
        {query.error ? <PortalNotice>{query.error}</PortalNotice> : null}
        {query.ok ? <PortalNotice>Pedido actualizado.</PortalNotice> : null}
        {cobro ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink">
            Enlace para la clienta:{" "}
            <a className="break-all underline" href={cobro}>
              {cobro}
            </a>
          </p>
        ) : null}
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <section>
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ash">Envío</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {order.firstName} {order.lastName}
              <br />
              {order.phone}
              <br />
              {order.email}
              <br />
              {order.address.street}
              {order.address.extra ? (
                <>
                  <br />
                  {order.address.extra}
                </>
              ) : null}
              <br />
              {order.address.postalCode} {order.address.city}
              <br />
              {order.address.province}
            </p>
          </section>
          <section>
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ash">Facturación</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {order.exempt ? "Factura obligatoria por aduana." : order.wantsInvoice ? "Ha pedido factura." : "No ha pedido factura."}
              {order.dni ? ` DNI ${order.dni}.` : " Sin DNI."}
            </p>
          </section>
        </div>
        {order.exempt ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink">{EXEMPT_INVOICE_NOTE}</p> : null}
        <ul className="mt-6 max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
          {order.lines.map((line, index) => {
            const stock = line.stock === "yes" || line.stock === "no" || line.stock === "reserved" ? line.stock : "pending";
            return (
              <li key={`${line.productId}-${line.color}-${index}`} className="flex flex-col gap-3 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={stock === "no" ? "text-ash line-through" : undefined}>
                      {line.qty} × {line.name}. Color {line.color}.
                    </p>
                  </div>
                  <p className={stock === "no" ? "text-ash line-through" : undefined}>{formatMoney(line.lineChargeCents)}</p>
                </div>
                {open ? (
                  <form action="/api/admin/shop" method="post" className="flex flex-wrap gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="action" value="stock" />
                    <input type="hidden" name="index" value={String(index)} />
                    <button
                      className={stock === "yes" ? "btn-atelier-solid btn-atelier" : "btn-atelier"}
                      name="stock"
                      value="yes"
                      type="submit"
                    >
                      {stock === "yes" ? "Confirmado" : "Confirmar"}
                    </button>
                    <button
                      className={stock === "no" ? "btn-atelier-solid btn-atelier" : "btn-atelier"}
                      name="stock"
                      value="no"
                      type="submit"
                    >
                      {stock === "no" ? "Rechazado" : "Rechazar"}
                    </button>
                    <button
                      className={stock === "reserved" ? "btn-atelier-solid btn-atelier" : "btn-atelier"}
                      name="stock"
                      value="reserved"
                      type="submit"
                    >
                      {stock === "reserved" ? "Reservado" : "Reservar"}
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-sm text-ash">
                      {stock === "no"
                        ? "Rechazado. No se cobra."
                        : stock === "reserved"
                          ? "Reservado. Se cobra cuando haya stock."
                          : stock === "yes"
                            ? "Confirmado. Se cobra."
                            : ""}
                    </p>
                    {stock === "reserved" && (order.status === "confirmed" || order.status === "shipped") ? (
                      <form action="/api/admin/shop" method="post">
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="action" value="charge-reserved" />
                        <input type="hidden" name="index" value={String(index)} />
                        <button className="btn-atelier" type="submit">
                          Cobrar reserva
                        </button>
                      </form>
                    ) : null}
                    {stock === "reserved" && line.reservePayUrl ? (
                      <a className="break-all text-sm underline" href={line.reservePayUrl}>
                        Enlace para la clienta
                      </a>
                    ) : null}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 max-w-xl">
          {open ? (
            <>
              <p className="text-sm text-ash">
                Autorizado {formatMoney(order.totalCents)}
                {order.shippingChargeCents ? ` · envío ${formatMoney(order.shippingChargeCents)}` : " · envío gratis"}
              </p>
              <p className="mt-1 font-serif text-3xl">
                A cobrar {charge.pending ? "—" : formatMoney(charge.captureCents)}
              </p>
              {note ? <p className="mt-2 text-sm leading-relaxed text-ash">{note}</p> : null}
            </>
          ) : (
            <>
              <p className="font-serif text-3xl">
                {order.status === "cancelled" ? "Anulado" : "Cobrado"} {formatMoney(order.totalCents)}
                {order.totalCents > 0 ? (order.shippingChargeCents ? ` · envío ${formatMoney(order.shippingChargeCents)}` : " · envío gratis") : ""}
              </p>
              {charge.reservedCents > 0 && (order.status === "confirmed" || order.status === "shipped") ? (
                <p className="mt-2 text-sm leading-relaxed text-ash">
                  Reservado {formatMoney(charge.reservedCents)}. Se cobra cuando haya stock, con un pago nuevo.
                </p>
              ) : null}
            </>
          )}
        </div>
        <div className="mt-8 flex max-w-xl flex-col gap-6">
          {order.status === "confirmed" ? (
            <form action="/api/admin/shop" method="post" className="flex flex-col gap-4">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="action" value="ship" />
              <label className="field-label">
                Mensajería
                <select className="field" name="carrier" defaultValue={carrier}>
                  <option>Correos</option>
                  <option>Otra</option>
                </select>
              </label>
              <label className="field-label">
                Código de seguimiento
                <input className="field" name="tracking" required />
              </label>
              <button className="btn-atelier-solid btn-atelier self-start" type="submit">
                Marcar enviado
              </button>
            </form>
          ) : null}
          {order.status === "confirmed" || order.status === "shipped" ? (
            <form action="/api/admin/shop" method="post">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="action" value="refund" />
              <button className="text-[0.68rem] uppercase tracking-[0.16em] text-ash hover:text-ink" type="submit">
                Anular y devolver el dinero
              </button>
            </form>
          ) : null}
          <div className="flex flex-wrap gap-5 text-sm">
            {order.invoiceNumber ? (
              <a className="underline" href={`/api/shop/invoice?id=${order.id}`}>
                Factura {order.invoiceNumber}
              </a>
            ) : null}
            {order.creditNumber ? (
              <a className="underline" href={`/api/shop/invoice?id=${order.id}&tipo=rectificativa`}>
                Rectificativa {order.creditNumber}
              </a>
            ) : null}
            {order.tracking ? (
              <span>
                {order.carrier} {order.tracking}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {open ? (
        <div className="shrink-0 border-t border-ink/10 bg-porcelain py-4">
          <div className="flex max-w-xl flex-col gap-3">
            {order.status !== "pending_payment" && charge.pending ? (
              <p className="text-sm leading-relaxed text-ash">Cuando cada artículo esté confirmado, reservado o rechazado, el botón cobra solo lo confirmado.</p>
            ) : null}
            <form action="/api/admin/shop" method="post">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="action" value="confirm" />
              <button className="btn-atelier-solid btn-atelier w-full" type="submit">
                {charge.pending
                  ? "Finalizar pedido y cobrar"
                  : charge.captureCents > 0
                    ? `Cobrar ${formatMoney(charge.captureCents)}`
                    : "Dejar reservado sin cobrar ahora"}
              </button>
            </form>
            <form action="/api/admin/shop" method="post">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="action" value="release" />
              <button className="btn-atelier w-full" type="submit">
                Anular el pedido
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </PortalFrame>
  );
}

function chargeNote(charge: { pending: boolean; droppedCents: number; reservedCents: number }) {
  if (charge.pending) {
    return "Marca cada artículo. Confirmar entra en este cobro. Reservar se deja para cuando haya stock. Rechazar sale del total.";
  }
  if (charge.droppedCents > 0) return `Rechazado ${formatMoney(charge.droppedCents)}, no se cobra.`;
  if (charge.reservedCents === 0) return "Todo confirmado. Se cobra el importe autorizado.";
  return "";
}

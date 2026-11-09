import { ClearCart } from "@/app/components/shop/ClearCart";
import { ShopFrame } from "@/app/components/shop/ShopFrame";
import { confirmedCharge, statusLabel, syncOrder } from "@/lib/shop/orders";
import { EXEMPT_CHECKOUT_NOTE, EXEMPT_INVOICE_NOTE, formatMoney } from "@/lib/shop/quote";
import { getShopCustomer } from "@/lib/shop/session";
import { getOrder } from "@/lib/shop/store";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedido",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getShopCustomer();
  if (!customer) redirect(`/tienda/cuenta?next=/tienda/pedido/${id}`);
  let order = await getOrder(id);
  if (!order || order.customerId !== customer.id) notFound();
  if (order.status === "pending_payment" && order.paymentMode === "stripe") {
    try {
      order = (await syncOrder(order.id)) || order;
    } catch {
      /* La consulta al banco puede reintentarse al recargar. */
    }
  }

  const kept = order.status === "authorized" || order.status === "confirmed" || order.status === "shipped";
  const charge = confirmedCharge(order);
  const open = order.status === "authorized" || order.status === "pending_payment";
  const payable = open && !charge.pending ? charge.captureCents : order.totalCents;

  return (
    <ShopFrame kicker="Pedido" title={order.number} lead={statusLabel(order.status)}>
      <ClearCart when={kept} />
      <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-ash">
        {order.paymentMode === "local" && order.status === "authorized" ? (
          <p>Reserva de prueba en local. No se ha cargado ninguna tarjeta.</p>
        ) : null}
        {order.status === "authorized" ? (
          <p>El importe queda apartado hasta que confirme el stock. Si no hay, anulo la reserva y no se cobra.</p>
        ) : null}
        {order.status === "confirmed" ? <p>El pago ya está cobrado. Preparo el envío y te aviso con el seguimiento.</p> : null}
        {order.status === "shipped" ? (
          <p>
            Enviado{order.carrier ? ` con ${order.carrier}` : ""}. Seguimiento: {order.tracking}.
          </p>
        ) : null}
        {order.status === "cancelled" ? <p>Pedido anulado. No se ha cobrado.</p> : null}
        {order.status === "refunded" ? <p>El importe vuelve a la misma tarjeta.</p> : null}
        {order.exempt ? <p className="border border-gilt/50 bg-linen/70 px-4 py-3 text-ink">{EXEMPT_CHECKOUT_NOTE}</p> : null}
        {order.exempt && order.invoiceNumber ? <p>{EXEMPT_INVOICE_NOTE}</p> : null}
      </div>
      <ul className="mt-8 max-w-2xl divide-y divide-ink/10 border-y border-ink/10">
        {order.lines.map((line) => (
          <li key={`${line.productId}-${line.color}`} className="flex justify-between gap-6 py-4">
            <span>
              <span className={line.stock === "no" ? "text-ash line-through" : undefined}>
                {line.qty} × {line.name}
              </span>
              <span className="mt-1 block text-sm text-ash">
                Color {line.color}
                {line.stock === "no" ? " · sin stock, no se cobra" : ""}
              </span>
            </span>
            <span className={line.stock === "no" ? "text-ash line-through" : undefined}>{formatMoney(line.lineChargeCents)}</span>
          </li>
        ))}
      </ul>
      {open && charge.droppedCents > 0 && !charge.pending ? (
        <p className="mt-6 text-sm text-ash">Reservado {formatMoney(order.totalCents)}. Se cobra {formatMoney(payable)}.</p>
      ) : null}
      <p className="mt-2 font-serif text-3xl">{formatMoney(payable)}</p>
      <p className="mt-4 text-sm text-ash">
        {order.address.street}, {order.address.extra}. {order.address.postalCode} {order.address.city}, {order.address.province}.
      </p>
      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        {order.invoiceNumber ? (
          <a className="underline" href={`/api/shop/invoice?id=${order.id}`}>
            Descargar factura {order.invoiceNumber}
          </a>
        ) : null}
        {order.creditNumber ? (
          <a className="underline" href={`/api/shop/invoice?id=${order.id}&tipo=rectificativa`}>
            Descargar rectificativa {order.creditNumber}
          </a>
        ) : null}
      </div>
    </ShopFrame>
  );
}

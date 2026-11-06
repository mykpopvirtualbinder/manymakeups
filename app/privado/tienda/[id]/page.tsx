import { PortalFrame, PortalNotice } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { getProduct, supplierSearchUrl } from "@/lib/shop/catalog";
import { statusLabel } from "@/lib/shop/orders";
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
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const admin = await requireShopStaff();
  if (!admin) redirect("/privado");
  const { id } = await params;
  const query = await searchParams;
  const order = await getOrder(id);
  if (!order) notFound();
  const carrier = order.carrier || "Correos";

  return (
    <PortalFrame
      pinned
      studio
      wide
      kicker={order.number}
      title={statusLabel(order.status)}
      lead={`${order.firstName} ${order.lastName} · ${order.email} · ${order.phone}`}
      aside={<StudioAside />}
    >
      <div data-portal-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16">
        <ShopAdminNav current="pedidos" />
        {query.error ? <PortalNotice>{query.error}</PortalNotice> : null}
        {query.ok ? <PortalNotice>Pedido actualizado.</PortalNotice> : null}
        <p className="text-sm leading-relaxed text-ash">
          {order.address.street}, {order.address.extra}. {order.address.postalCode} {order.address.city}, {order.address.province}.
          {order.dni ? ` DNI ${order.dni}.` : ""}
        </p>
        {order.exempt ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink">{EXEMPT_INVOICE_NOTE}</p> : null}
        {order.paymentMode === "local" ? (
          <p className="mt-4 text-sm text-ash">Reserva local, sin tarjeta. Confirmar no cobra de verdad.</p>
        ) : null}
        <ul className="mt-6 max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
          {order.lines.map((line) => {
            const product = getProduct(line.productId);
            return (
              <li key={`${line.productId}-${line.color}`} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p>
                    {line.qty} × {line.name}. Color {line.color}.
                  </p>
                  {product ? (
                    <a className="text-sm text-gilt underline" href={supplierSearchUrl(product, line.color)} target="_blank" rel="noreferrer">
                      Buscar en La Casa del Pelo
                    </a>
                  ) : null}
                </div>
                <p>{formatMoney(line.lineChargeCents)}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 font-serif text-3xl">
          {formatMoney(order.totalCents)}
          {order.shippingChargeCents ? ` · envío ${formatMoney(order.shippingChargeCents)}` : " · envío gratis"}
        </p>
        <div className="mt-8 flex max-w-xl flex-col gap-6">
          {order.status === "authorized" ? (
            <>
              <form action="/api/admin/shop" method="post">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="action" value="confirm" />
                <button className="btn-atelier-solid btn-atelier" type="submit">
                  Hay stock: cobrar
                </button>
              </form>
              <form action="/api/admin/shop" method="post">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="action" value="release" />
                <button className="btn-atelier" type="submit">
                  No hay stock: liberar la reserva
                </button>
              </form>
            </>
          ) : null}
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
    </PortalFrame>
  );
}

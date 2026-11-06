import { PortalFrame } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { ShopAdminNav } from "@/app/components/shop/ShopAdminNav";
import { isShopAdminEmail, requireShopStaff } from "@/lib/shop/access";
import { statusLabel } from "@/lib/shop/orders";
import { formatMoney } from "@/lib/shop/quote";
import { getCustomer, listOrdersByCustomer } from "@/lib/shop/store";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cliente de la tienda",
  robots: { index: false, follow: false },
};

export default async function StudioCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireShopStaff();
  if (!admin) redirect("/privado");
  const customer = await getCustomer((await params).id);
  if (!customer) notFound();
  const orders = await listOrdersByCustomer(customer.id);
  const vip = isShopAdminEmail(customer.email);

  return (
    <PortalFrame
      pinned
      studio
      wide
      kicker="Cliente"
      title={`${customer.firstName} ${customer.lastName}`}
      lead={`${customer.email} · ${customer.phone}`}
      aside={<StudioAside />}
    >
      <div data-portal-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16">
        <ShopAdminNav current="clientes" />
        {vip ? <p className="mb-4 text-[0.68rem] uppercase tracking-[0.18em] text-gilt">VIP · Admin</p> : null}
        <p className="text-sm leading-relaxed text-ash">
          {customer.street}
          {customer.extra ? `, ${customer.extra}` : ""}. {customer.postalCode} {customer.city}, {customer.province}.
          {customer.dni ? ` DNI ${customer.dni}.` : ""}
        </p>
        <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {orders.map((order) => (
            <li key={order.id}>
              <a className="flex flex-col gap-1 py-4 hover:text-gilt sm:flex-row sm:items-center sm:justify-between" href={`/privado/tienda/${order.id}`}>
                <span>
                  <span className="font-serif text-2xl text-ink">{order.number}</span>
                  <span className="mt-1 block text-sm text-ash">{statusLabel(order.status)}</span>
                </span>
                <span className="font-serif text-2xl text-ink">{formatMoney(order.totalCents)}</span>
              </a>
            </li>
          ))}
        </ul>
        {orders.length === 0 ? <p className="mt-6 text-sm text-ash">Esta cuenta todavía no tiene pedidos.</p> : null}
      </div>
    </PortalFrame>
  );
}

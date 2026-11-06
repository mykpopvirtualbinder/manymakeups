import { PortalFrame } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { ShopAdminNav } from "@/app/components/shop/ShopAdminNav";
import { isShopAdminEmail, requireShopStaff } from "@/lib/shop/access";
import { formatMoney } from "@/lib/shop/quote";
import { listCustomers, listOrders } from "@/lib/shop/store";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clientes de la tienda",
  robots: { index: false, follow: false },
};

export default async function StudioCustomersPage() {
  const admin = await requireShopStaff();
  if (!admin) redirect("/privado");
  const [customers, orders] = await Promise.all([listCustomers(), listOrders()]);

  return (
    <PortalFrame
      pinned
      studio
      wide
      kicker="Tienda"
      title="Clientes."
      lead="Cuentas de la tienda de extensiones. info@manymakeups.com es la cuenta de administración."
      aside={<StudioAside />}
    >
      <div data-portal-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16">
        <ShopAdminNav current="clientes" />
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {customers.map((customer) => {
            const own = orders.filter((order) => order.customerId === customer.id);
            const spent = own
              .filter((order) => order.status === "confirmed" || order.status === "shipped")
              .reduce((sum, order) => sum + order.totalCents, 0);
            const vip = isShopAdminEmail(customer.email);
            return (
              <li key={customer.id}>
                <a className="flex flex-col gap-1 py-4 hover:text-gilt sm:flex-row sm:items-center sm:justify-between" href={`/privado/tienda/clientes/${customer.id}`}>
                  <span>
                    <span className="font-serif text-2xl text-ink">
                      {customer.firstName} {customer.lastName}
                      {vip ? <span className="ml-3 align-middle text-[0.68rem] uppercase tracking-[0.18em] text-gilt">VIP · Admin</span> : null}
                    </span>
                    <span className="mt-1 block text-sm text-ash">
                      {customer.email} · {customer.phone} · {customer.city || "sin ciudad"}
                    </span>
                  </span>
                  <span className="text-sm text-ash">
                    {own.length} pedido{own.length === 1 ? "" : "s"} · {formatMoney(spent)}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        {customers.length === 0 ? <p className="mt-6 text-sm text-ash">Todavía no hay clientes.</p> : null}
      </div>
    </PortalFrame>
  );
}

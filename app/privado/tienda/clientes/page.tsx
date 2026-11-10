import { PortalFrame, PortalNotice } from "@/app/components/portal/PortalFrame";
import { StudioAside } from "@/app/components/portal/StudioAside";
import { CustomerDesk, type CustomerRow } from "@/app/components/shop/CustomerDesk";
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

export default async function StudioCustomersPage({ searchParams }: { searchParams: Promise<{ error?: string; ok?: string }> }) {
  const admin = await requireShopStaff();
  if (!admin) redirect("/privado");
  const query = await searchParams;
  const [customers, orders] = await Promise.all([listCustomers(), listOrders()]);

  return (
    <PortalFrame
      pinned
      studio
      wide
      kicker="Tienda"
      title="Clientes."
      aside={<StudioAside />}
    >
      <div data-portal-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16">
        <ShopAdminNav current="clientes" />
        {query.error ? <PortalNotice>{query.error}</PortalNotice> : null}
        {query.ok === "clientas" ? <PortalNotice>Clienta borrada. Si tenía pedidos, siguen en la tienda.</PortalNotice> : null}
        <CustomerDesk
          customers={customers.map((customer) => {
            const own = orders.filter((order) => order.customerId === customer.id);
            const spent = own
              .filter((order) => order.status === "confirmed" || order.status === "shipped")
              .reduce((sum, order) => sum + order.totalCents, 0);
            const row: CustomerRow = {
              id: customer.id,
              name: `${customer.firstName} ${customer.lastName}`,
              email: customer.email,
              phone: customer.phone,
              city: customer.city,
              province: customer.province,
              vip: isShopAdminEmail(customer.email),
              orders: own.length,
              spent: formatMoney(spent),
              orderIds: own.map((order) => order.id),
            };
            return row;
          })}
        />
      </div>
    </PortalFrame>
  );
}

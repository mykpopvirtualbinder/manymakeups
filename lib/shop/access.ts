import { requireAdmin } from "@/lib/portal/session";
import { site } from "@/lib/site";
import { getShopCustomer } from "./session";

export function isShopAdminEmail(email: string) {
  return email.trim().toLowerCase() === site.email.toLowerCase();
}

export async function requireShopStaff() {
  const admin = await requireAdmin();
  if (admin) return { email: admin.email, name: admin.name };
  const customer = await getShopCustomer();
  if (!customer || !isShopAdminEmail(customer.email)) return null;
  return { email: customer.email, name: `${customer.firstName} ${customer.lastName}`.trim() || site.founder };
}

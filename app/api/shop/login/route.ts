import { checkPassword, isEmail, normalizeEmail } from "@/lib/portal/crypto";
import { setShopCookie } from "@/lib/shop/session";
import { getCustomerByEmail } from "@/lib/shop/store";
import { safeNext } from "@/lib/shop/validate";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string; next?: string } | null;
  const email = normalizeEmail(String(body?.email || ""));
  const password = String(body?.password || "");
  const customer = isEmail(email) ? await getCustomerByEmail(email) : null;
  if (!customer || !(await checkPassword(password, customer.passwordHash))) {
    return Response.json({ error: "Correo o contraseña incorrectos." }, { status: 400 });
  }
  await setShopCookie({
    sub: customer.id,
    email: customer.email,
    name: `${customer.firstName} ${customer.lastName}`,
  });
  return Response.json({ ok: true, next: safeNext(body?.next, "/tienda") });
}

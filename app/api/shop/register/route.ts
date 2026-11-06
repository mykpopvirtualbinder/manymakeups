import { hashPassword, isEmail, normalizeEmail, passwordIssue } from "@/lib/portal/crypto";
import { isExemptProvince } from "@/lib/shop/places";
import { freshId, getCustomerByEmail, insertCustomer } from "@/lib/shop/store";
import { setShopCookie } from "@/lib/shop/session";
import type { Customer } from "@/lib/shop/types";
import { addressIssue, clip, dniIssue, normalizeDni, personIssue, phoneIssue, safeNext } from "@/lib/shop/validate";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Datos incompletos." }, { status: 400 });

  const email = normalizeEmail(String(body.email || ""));
  if (!isEmail(email)) return Response.json({ error: "Introduce un email válido." }, { status: 400 });
  const passwordError = passwordIssue(String(body.password || ""));
  if (passwordError) return Response.json({ error: passwordError }, { status: 400 });

  const firstName = clip(String(body.firstName || ""), 80);
  const lastName = clip(String(body.lastName || ""), 80);
  const personError = personIssue(firstName, lastName);
  if (personError) return Response.json({ error: personError }, { status: 400 });

  const phone = clip(String(body.phone || ""), 20);
  const invalidPhone = phoneIssue(phone);
  if (invalidPhone) return Response.json({ error: invalidPhone }, { status: 400 });

  const address = {
    street: clip(String(body.street || ""), 120),
    extra: clip(String(body.extra || ""), 80),
    postalCode: String(body.postalCode || "").trim(),
    city: clip(String(body.city || ""), 80),
    province: String(body.province || ""),
  };
  const invalidAddress = addressIssue(address);
  if (invalidAddress) return Response.json({ error: invalidAddress }, { status: 400 });

  const dniRequired = isExemptProvince(address.province);
  const invalidDni = dniIssue(String(body.dni || ""), dniRequired);
  if (invalidDni) return Response.json({ error: invalidDni }, { status: 400 });
  if (await getCustomerByEmail(email)) {
    return Response.json({ error: "Ya hay una cuenta con ese correo. Entra con tu contraseña." }, { status: 400 });
  }

  const customer: Customer = {
    id: freshId(),
    email,
    passwordHash: await hashPassword(String(body.password || "")),
    phone,
    firstName,
    lastName,
    dni: String(body.dni || "").trim() ? normalizeDni(String(body.dni)) : "",
    ...address,
    createdAt: new Date().toISOString(),
  };
  await insertCustomer(customer);
  await setShopCookie({ sub: customer.id, email, name: `${firstName} ${lastName}` });
  return Response.json({ ok: true, next: safeNext(body.next, "/tienda") });
}

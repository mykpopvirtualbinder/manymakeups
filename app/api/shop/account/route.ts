import { getShopCustomer, setShopCookie } from "@/lib/shop/session";
import { saveCustomer } from "@/lib/shop/store";
import { isExemptProvince } from "@/lib/shop/places";
import { addressIssue, clip, dniIssue, normalizeDni, personIssue, phoneIssue } from "@/lib/shop/validate";

export async function POST(request: Request) {
  const customer = await getShopCustomer();
  if (!customer) return Response.json({ error: "Entra en tu cuenta." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Datos incompletos." }, { status: 400 });

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
  const invalidDni = dniIssue(String(body.dni || ""), isExemptProvince(address.province));
  if (invalidDni) return Response.json({ error: invalidDni }, { status: 400 });

  customer.firstName = firstName;
  customer.lastName = lastName;
  customer.phone = phone;
  customer.dni = String(body.dni || "").trim() ? normalizeDni(String(body.dni)) : "";
  Object.assign(customer, address);
  await saveCustomer(customer);
  await setShopCookie({ sub: customer.id, email: customer.email, name: `${firstName} ${lastName}` });
  return Response.json({ ok: true });
}

import { ShopError, placeOrder, type CheckoutInput } from "@/lib/shop/orders";
import { getShopCustomer } from "@/lib/shop/session";

export async function POST(request: Request) {
  const customer = await getShopCustomer();
  if (!customer) return Response.json({ error: "Entra en tu cuenta para comprar." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as (CheckoutInput & { accepted?: boolean }) | null;
  if (!body) return Response.json({ error: "Datos incompletos." }, { status: 400 });
  if (!body.accepted) return Response.json({ error: "Acepta las condiciones de venta para continuar." }, { status: 400 });
  try {
    const result = await placeOrder(customer, body, new URL(request.url).origin);
    return Response.json({
      mode: result.order.paymentMode,
      orderId: result.order.id,
      clientSecret: result.clientSecret,
      totalCents: result.order.totalCents,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    });
  } catch (err) {
    const message = err instanceof ShopError ? err.message : "No he podido crear el pedido.";
    return Response.json({ error: message }, { status: 400 });
  }
}

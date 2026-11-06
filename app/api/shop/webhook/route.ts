import { applyStripeEvent } from "@/lib/shop/orders";
import { stripeClient } from "@/lib/shop/payments";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) return new Response("Stripe no configurado", { status: 503 });
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  let event: { type: string; data: { object: { id?: string; status?: string } } };
  try {
    event = stripeClient().webhooks.constructEvent(body, signature, secret) as typeof event;
  } catch {
    return new Response("Firma no válida", { status: 400 });
  }
  if (event.type.startsWith("payment_intent.") && event.data.object.id && event.data.object.status) {
    await applyStripeEvent(event.data.object.id, event.data.object.status);
  }
  return Response.json({ received: true });
}

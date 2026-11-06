import Stripe from "stripe";

let client: Stripe | null = null;

export function stripeReady() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function paymentMode(): "stripe" | "local" | "unavailable" {
  if (stripeReady()) return "stripe";
  if (process.env.NODE_ENV !== "production") return "local";
  return "unavailable";
}

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta STRIPE_SECRET_KEY");
  if (!client) client = new Stripe(key);
  return client;
}

export async function createHold(input: { amount: number; email: string; orderId: string; number: string }) {
  return stripeClient().paymentIntents.create({
    amount: input.amount,
    currency: "eur",
    capture_method: "manual",
    receipt_email: input.email,
    description: `Pedido ${input.number} Many Makeups`,
    metadata: { orderId: input.orderId, orderNumber: input.number },
    automatic_payment_methods: { enabled: true },
    payment_method_configuration: "pmc_1UYnBSETChKQL24i00sBEea9",
  });
}

export async function captureHold(paymentIntentId: string) {
  const stripe = stripeClient();
  try {
    return await stripe.paymentIntents.capture(paymentIntentId);
  } catch {
    const current = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (current.status === "succeeded") return current;
    throw new Error("CAPTURE_FAILED");
  }
}

export async function releaseHold(paymentIntentId: string) {
  const stripe = stripeClient();
  try {
    return await stripe.paymentIntents.cancel(paymentIntentId);
  } catch {
    const current = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (current.status === "canceled") return current;
    throw new Error("RELEASE_FAILED");
  }
}

export async function refundHold(paymentIntentId: string) {
  return stripeClient().refunds.create({ payment_intent: paymentIntentId });
}

export async function readHold(paymentIntentId: string) {
  return stripeClient().paymentIntents.retrieve(paymentIntentId);
}

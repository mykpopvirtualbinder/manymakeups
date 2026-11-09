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

export async function captureHold(paymentIntentId: string, amountToCapture?: number) {
  const stripe = stripeClient();
  try {
    return await stripe.paymentIntents.capture(
      paymentIntentId,
      amountToCapture && amountToCapture > 0 ? { amount_to_capture: amountToCapture } : undefined,
    );
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

export async function createReserveCheckout(input: {
  amount: number;
  shippingCents: number;
  email: string;
  orderId: string;
  lineIndex: number;
  name: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: input.amount,
        product_data: { name: input.name },
      },
    },
  ];
  if (input.shippingCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: input.shippingCents,
        product_data: { name: "Envío" },
      },
    });
  }
  const session = await stripeClient().checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: lineItems,
    metadata: { orderId: input.orderId, lineIndex: String(input.lineIndex), kind: "reserve" },
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  });
  if (!session.url) throw new Error("CHECKOUT_URL");
  return session.url;
}

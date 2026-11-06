"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useState } from "react";
import { EXEMPT_CHECKOUT_NOTE, formatMoney } from "@/lib/shop/quote";

const cache = new Map<string, Promise<Stripe | null>>();

function stripePromise(key: string) {
  const found = cache.get(key);
  if (found) return found;
  const created = loadStripe(key);
  cache.set(key, created);
  return created;
}

export function PayBox({
  clientSecret,
  publishableKey,
  orderId,
  totalCents,
  exempt,
}: {
  clientSecret: string;
  publishableKey: string;
  orderId: string;
  totalCents: number;
  exempt: boolean;
}) {
  return (
    <Elements stripe={stripePromise(publishableKey)} options={{ clientSecret, appearance: { variables: { colorPrimary: "#1a1613", colorBackground: "#f4f1ea", colorText: "#1a1613", borderRadius: "0px" } } }}>
      <PaymentForm orderId={orderId} totalCents={totalCents} exempt={exempt} />
    </Elements>
  );
}

function PaymentForm({ orderId, totalCents, exempt }: { orderId: string; totalCents: number; exempt: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="max-w-xl"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setBusy(true);
        setError("");
        const returnUrl = `${window.location.origin}/tienda/pedido/${orderId}`;
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: returnUrl },
          redirect: "if_required",
        });
        if (result.error) {
          setBusy(false);
          setError(result.error.message || "No se ha podido reservar el pago.");
          return;
        }
        window.location.href = returnUrl;
      }}
    >
      <p className="font-serif text-3xl">{formatMoney(totalCents)}</p>
      <p className="mt-3 text-sm leading-relaxed text-ash">
        Se reserva este importe en la tarjeta. No se cobra hasta que confirme el stock. Si no hay, anulo la reserva y no se te cobra. La retención suele durar unos 7 días.
      </p>
      {exempt ? <p className="mt-4 border border-gilt/50 bg-linen/70 px-4 py-3 text-sm leading-relaxed text-ink">{EXEMPT_CHECKOUT_NOTE}</p> : null}
      <div className="mt-6">
        <PaymentElement />
      </div>
      {error ? <p className="mt-4 text-sm text-ink">{error}</p> : null}
      <button className="btn-atelier-solid btn-atelier mt-6" type="submit" disabled={!stripe || busy}>
        {busy ? "Reservando…" : "Reservar el importe"}
      </button>
    </form>
  );
}

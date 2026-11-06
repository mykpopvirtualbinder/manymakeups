"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getProduct } from "@/lib/shop/catalog";
import { isExemptProvince } from "@/lib/shop/places";
import { EXEMPT_CHECKOUT_NOTE, quoteOrder } from "@/lib/shop/quote";
import type { PublicCustomer } from "@/lib/shop/types";
import { AddressFields, type AddressValue } from "./AddressFields";
import { PayBox } from "./PayBox";
import { QuoteList } from "./QuoteList";
import { readCart } from "./cart-store";

export function CheckoutForm({ customer, local }: { customer: PublicCustomer; local: boolean }) {
  const [address, setAddress] = useState<AddressValue>({
    street: customer.street,
    extra: customer.extra,
    postalCode: customer.postalCode,
    city: customer.city,
    province: customer.province,
  });
  const [dni, setDni] = useState(customer.dni);
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [goods, setGoods] = useState<number | null>(null);
  const [payment, setPayment] = useState<{ clientSecret: string; publishableKey: string; orderId: string; totalCents: number } | null>(null);
  const exempt = isExemptProvince(address.province);
  const invoice = exempt || wantsInvoice;
  const quote = useMemo(() => quoteOrder(goods ?? 0, exempt), [goods, exempt]);

  useEffect(() => {
    const lines = readCart();
    setGoods(lines.reduce((sum, line) => sum + (getProduct(line.productId)?.priceCents ?? 0) * line.qty, 0));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) {
      setError("Acepta las condiciones de venta para continuar.");
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/shop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...address, dni, wantsInvoice: invoice, accepted: true, lines: readCart() }),
    });
    const data = (await response.json().catch(() => null)) as {
      error?: string;
      mode?: string;
      orderId?: string;
      clientSecret?: string | null;
      publishableKey?: string;
      totalCents?: number;
    } | null;
    setBusy(false);
    if (!response.ok || !data?.orderId) {
      setError(data?.error || "No he podido preparar el pedido.");
      return;
    }
    if (data.mode === "local") {
      window.location.href = `/tienda/pedido/${data.orderId}`;
      return;
    }
    if (!data.clientSecret || !data.publishableKey) {
      setError("No he podido abrir la ventana de pago.");
      return;
    }
    setPayment({
      clientSecret: data.clientSecret,
      publishableKey: data.publishableKey,
      orderId: data.orderId,
      totalCents: data.totalCents ?? quote.totalCents,
    });
  }

  if (goods === null) return <p className="text-ash">Cargando la cesta…</p>;

  if (goods === 0) {
    return (
      <div>
        <p className="text-ash">La cesta está vacía.</p>
        <a className="btn-atelier mt-6" href="/tienda">
          Ver extensiones
        </a>
      </div>
    );
  }

  if (payment) {
    return <PayBox {...payment} exempt={exempt} />;
  }

  return (
    <form className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]" onSubmit={submit}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ash">
          {customer.firstName} {customer.lastName} · {customer.email} · {customer.phone}
        </p>
        <AddressFields value={address} onChange={(patch) => setAddress((current) => ({ ...current, ...patch }))} />
        {exempt ? (
          <p className="border border-gilt/50 bg-linen/70 px-4 py-3 text-sm leading-relaxed text-ink">{EXEMPT_CHECKOUT_NOTE}</p>
        ) : (
          <label className="flex items-start gap-3 text-sm normal-case tracking-normal text-ink">
            <input type="checkbox" className="mt-1" checked={wantsInvoice} onChange={(event) => setWantsInvoice(event.target.checked)} />
            Quiero factura del pedido
          </label>
        )}
        {exempt ? <p className="text-sm text-ash">En Canarias, Ceuta y Melilla el DNI y la factura son obligatorios para la aduana.</p> : null}
        <label className="field-label">
          DNI o NIE {invoice ? "" : "(opcional)"}
          <input className="field" value={dni} required={invoice} onChange={(event) => setDni(event.target.value)} />
        </label>
        <label className="flex items-start gap-3 text-sm normal-case tracking-normal text-ink">
          <input type="checkbox" className="mt-1" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
          <span>
            He leído las <a className="underline" href="/condiciones-de-venta">condiciones de venta</a>, los <a className="underline" href="/envios">envíos</a> y las <a className="underline" href="/devoluciones">devoluciones</a>.
          </span>
        </label>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        <button className="btn-atelier-solid btn-atelier self-start" type="submit" disabled={busy}>
          {busy ? "Preparando…" : local ? "Reservar pedido" : "Continuar al pago"}
        </button>
        {local ? (
          <p className="text-sm leading-relaxed text-ash">
            Estamos en local: el pedido se anota como reservado y no se carga ninguna tarjeta. Cuando la pasarela esté conectada, este paso retendrá el importe sin cobrarlo hasta confirmar el stock.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-ash">
            En la ventana de pago se reserva el importe. No se cobra hasta que confirme que hay stock.
          </p>
        )}
      </div>
      <aside className="h-fit border border-ink/10 p-5">
        <QuoteList quote={quote} />
      </aside>
    </form>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/path";
import { getProduct, productName } from "@/lib/shop/catalog";
import { getColor } from "@/lib/shop/colors";
import { isExemptProvince } from "@/lib/shop/places";
import { quoteOrder } from "@/lib/shop/quote";
import { QuoteList } from "./QuoteList";
import { readCart, writeCart, type CartLine } from "./cart-store";

const copy: Record<
  Locale,
  { loading: string; empty: string; browse: string; color: string; qty: string; remove: string; knownProvince: string; unknownProvince: string; shipping: string; continue: string; keep: string }
> = {
  es: {
    loading: "Cargando la cesta…",
    empty: "La cesta está vacía.",
    browse: "Ver extensiones",
    color: "Color",
    qty: "Cantidad",
    remove: "Quitar",
    knownProvince: "El total ya tiene en cuenta tu provincia. Puedes cambiar la dirección antes de reservar el pago.",
    unknownProvince: "Este total es para península y Baleares. Si el envío es a Canarias, Ceuta o Melilla, en el pago se quita el IVA.",
    shipping: "Envío gratis en pedidos superiores a 100 €. Por debajo, 2,90 €. El importe se reserva y solo se cobra cuando confirmo que hay stock.",
    continue: "Continuar",
    keep: "Seguir comprando",
  },
  en: {
    loading: "Loading your basket…",
    empty: "Your basket is empty.",
    browse: "See the extensions",
    color: "Colour",
    qty: "Quantity",
    remove: "Remove",
    knownProvince: "The total already uses your province. You can change the address before the payment is reserved.",
    unknownProvince: "This total is for mainland Spain and the Balearic Islands. VAT is removed at checkout for the Canary Islands, Ceuta and Melilla.",
    shipping: "Free delivery on orders over €100. Below that, €2.90. The amount is reserved and charged only when stock is confirmed.",
    continue: "Continue",
    keep: "Continue shopping",
  },
  fr: {
    loading: "Chargement du panier…",
    empty: "Le panier est vide.",
    browse: "Voir les extensions",
    color: "Couleur",
    qty: "Quantité",
    remove: "Retirer",
    knownProvince: "Le total tient déjà compte de votre province. Vous pouvez changer l’adresse avant de réserver le paiement.",
    unknownProvince: "Ce total vaut pour la péninsule et les Baléares. Pour les Canaries, Ceuta ou Melilla, la TVA est retirée au paiement.",
    shipping: "Livraison offerte dès 100 €. En dessous, 2,90 €. Le montant est réservé et n’est débité que lorsque le stock est confirmé.",
    continue: "Continuer",
    keep: "Continuer les achats",
  },
};

export function CartView({ province }: { province: string }) {
  const { locale } = useI18n();
  const labels = copy[locale];
  const shopHref = localePath(locale, "/tienda");
  const checkoutHref = localePath(locale, "/tienda/pedido");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(readCart());
    setReady(true);
  }, []);

  const detailed = lines.flatMap((line) => {
    const product = getProduct(line.productId);
    const color = getColor(line.color);
    if (!product || !color) return [];
    return [{ ...line, product, color }];
  });
  const goods = detailed.reduce((sum, line) => sum + line.product.priceCents * line.qty, 0);
  const quote = useMemo(() => quoteOrder(goods, isExemptProvince(province)), [goods, province]);

  function update(next: CartLine[]) {
    setLines(next);
    writeCart(next);
  }

  if (!ready) return <p className="text-ash">{labels.loading}</p>;
  if (!detailed.length) {
    return (
      <div>
        <p className="text-ash">{labels.empty}</p>
        <a className="btn-atelier mt-6" href={shopHref}>
          {labels.browse}
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {detailed.map((line) => (
          <li key={`${line.productId}-${line.color}`} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-2xl">{productName(line.product, locale)}</p>
              <p className="mt-1 text-sm text-ash">
                {labels.color} {line.color.code} · {line.color.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="field-label">
                {labels.qty}
                <input
                  className="field w-20"
                  type="number"
                  min={1}
                  max={5}
                  value={line.qty}
                  onChange={(event) => {
                    const qty = Math.min(5, Math.max(1, Number(event.target.value) || 1));
                    update(lines.map((item) => (item.productId === line.productId && item.color === line.color.code ? { ...item, qty } : item)));
                  }}
                />
              </label>
              <button
                type="button"
                className="text-[0.68rem] uppercase tracking-[0.16em] text-ash hover:text-ink"
                onClick={() => update(lines.filter((item) => !(item.productId === line.productId && item.color === line.color.code)))}
              >
                {labels.remove}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-ink/10 p-5">
        <QuoteList quote={quote} />
        <p className="mt-4 text-sm leading-relaxed text-ash">
          {province ? labels.knownProvince : labels.unknownProvince}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ash">{labels.shipping}</p>
        <a className="btn-atelier-solid btn-atelier mt-6 w-full" href={checkoutHref}>
          {labels.continue}
        </a>
        <a className="mt-3 block text-center text-[0.68rem] uppercase tracking-[0.16em] text-ash hover:text-ink" href={shopHref}>
          {labels.keep}
        </a>
      </aside>
    </div>
  );
}

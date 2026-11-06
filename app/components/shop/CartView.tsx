"use client";

import { useEffect, useMemo, useState } from "react";
import { getProduct, productName } from "@/lib/shop/catalog";
import { getColor } from "@/lib/shop/colors";
import { isExemptProvince } from "@/lib/shop/places";
import { quoteOrder } from "@/lib/shop/quote";
import { QuoteList } from "./QuoteList";
import { readCart, writeCart, type CartLine } from "./cart-store";

export function CartView({ province }: { province: string }) {
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

  if (!ready) return <p className="text-ash">Cargando la cesta…</p>;
  if (!detailed.length) {
    return (
      <div>
        <p className="text-ash">La cesta está vacía.</p>
        <a className="btn-atelier mt-6" href="/tienda">
          Ver extensiones
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
              <p className="font-serif text-2xl">{productName(line.product)}</p>
              <p className="mt-1 text-sm text-ash">
                Color {line.color.code} · {line.color.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="field-label">
                Cantidad
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
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-ink/10 p-5">
        <QuoteList quote={quote} />
        <p className="mt-4 text-sm leading-relaxed text-ash">
          {province
            ? "El total ya tiene en cuenta tu provincia. Puedes cambiar la dirección antes de reservar el pago."
            : "Este total es para península y Baleares. Si el envío es a Canarias, Ceuta o Melilla, en el pago se quita el IVA."}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ash">
          Envío gratis en pedidos superiores a 100 €. Por debajo, 2,90 €. El importe se reserva y solo se cobra cuando confirmo que hay stock.
        </p>
        <a className="btn-atelier-solid btn-atelier mt-6 w-full" href="/tienda/pedido">
          Continuar
        </a>
      </aside>
    </div>
  );
}

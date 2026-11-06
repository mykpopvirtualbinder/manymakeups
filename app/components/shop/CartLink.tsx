"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/path";
import { getProduct, productSummary, productTitle } from "@/lib/shop/catalog";
import { colorSample, getColor } from "@/lib/shop/colors";
import { formatMoney, quoteOrder } from "@/lib/shop/quote";
import { readCart, type CartLine } from "./cart-store";

const copy: Record<Locale, { empty: string; continue: string; total: string; shipping: string; free: string }> = {
  es: { empty: "La cesta está vacía.", continue: "Continuar", total: "Total", shipping: "Envío", free: "Envío gratis" },
  en: { empty: "Your basket is empty.", continue: "Continue", total: "Total", shipping: "Delivery", free: "Free delivery" },
  fr: { empty: "Le panier est vide.", continue: "Continuer", total: "Total", shipping: "Livraison", free: "Livraison offerte" },
};

export function CartLink({ label }: { label: string }) {
  const { locale } = useI18n();
  const labels = copy[locale];
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setLines(readCart());
    sync();
    window.addEventListener("mm-cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mm-cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const detailed = lines.flatMap((line) => {
    const product = getProduct(line.productId);
    const color = getColor(line.color);
    if (!product || !color) return [];
    return [{ ...line, product, color }];
  });
  const count = detailed.reduce((sum, line) => sum + line.qty, 0);
  const goods = detailed.reduce((sum, line) => sum + line.product.priceCents * line.qty, 0);
  const quote = quoteOrder(goods, false);
  const cartHref = localePath(locale, "/tienda/carrito");
  const checkoutHref = localePath(locale, "/tienda/pedido");

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a
        className="relative inline-flex size-10 items-center justify-center text-ink"
        href={cartHref}
        aria-label={count > 0 ? `${label}, ${count}` : label}
      >
        <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M6.5 8h11l-1 12h-9l-1-12z" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </svg>
        {count > 0 ? (
          <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.6rem] leading-4 text-porcelain">
            {count}
          </span>
        ) : null}
      </a>
      {open ? (
        <div className="absolute right-0 top-full z-50 pt-2">
          <div className="w-[min(20rem,calc(100vw-2rem))] border border-ink/10 bg-porcelain p-4 shadow-[0_16px_40px_rgba(26,22,19,0.08)]">
            {detailed.length === 0 ? (
              <p className="text-sm text-ash">{labels.empty}</p>
            ) : (
              <>
                <ul className="max-h-72 space-y-3 overflow-auto">
                  {detailed.map((line) => (
                    <li key={`${line.productId}-${line.color.code}`} className="flex gap-3">
                      <img src={colorSample(line.color.code)} alt="" className="h-16 w-16 shrink-0 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-lg leading-tight text-ink">{productTitle(line.product, locale)}</p>
                        <p className="truncate text-xs text-ash">{productSummary(line.product, locale)}</p>
                        <p className="mt-1 truncate text-xs text-ash">
                          {line.color.code} · {line.color.name} · {line.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm text-ink">{formatMoney(line.product.priceCents * line.qty)}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
                  <span>
                    <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-ash">{labels.total}</span>
                    <span className="mt-1 block text-xs text-ash">
                      {quote.freeShipping ? labels.free : `${labels.shipping} ${formatMoney(quote.shippingChargeCents)}`}
                    </span>
                  </span>
                  <span className="font-serif text-2xl text-ink">{formatMoney(quote.totalCents)}</span>
                </div>
                <a className="btn-atelier-solid btn-atelier mt-4 w-full" href={checkoutHref}>
                  {labels.continue}
                </a>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

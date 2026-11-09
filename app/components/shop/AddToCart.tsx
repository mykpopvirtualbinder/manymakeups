"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/config";
import { colorSample, hairColors } from "@/lib/shop/colors";
import { addToCart } from "./cart-store";

const copy: Record<Locale, { color: string; choose: string; qty: string; add: string; error: string }> = {
  es: {
    color: "Color",
    choose: "Elige un color",
    qty: "Cantidad",
    add: "Añadir a la cesta",
    error: "Elige un color de la carta.",
  },
  en: {
    color: "Colour",
    choose: "Choose a colour",
    qty: "Quantity",
    add: "Add to basket",
    error: "Choose a colour from the chart.",
  },
  fr: {
    color: "Couleur",
    choose: "Choisir une couleur",
    qty: "Quantité",
    add: "Ajouter au panier",
    error: "Choisissez une couleur du nuancier.",
  },
};

export function AddToCart({
  productId,
  color,
  onColor,
}: {
  productId: string;
  color: string;
  onColor: (code: string) => void;
}) {
  const { locale } = useI18n();
  const labels = copy[locale];
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const selected = hairColors.find((item) => item.code === color) ?? null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!color) {
          setError(labels.error);
          setOpen(true);
          return;
        }
        addToCart({ productId, color, qty });
        window.dispatchEvent(new Event("mm-cart-open"));
      }}
    >
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ash">{labels.color}</p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="color-chart"
        onClick={() => setOpen((value) => !value)}
        className="mt-3 flex w-full items-center gap-3 border border-ink/15 px-3 py-3 text-left hover:border-gilt"
      >
        {selected ? (
          <>
            <ColorSample code={selected.code} className="h-9 w-9 shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm text-ink">{selected.code}</span>
              <span className="block text-[0.7rem] leading-snug text-ash">{selected.name}</span>
            </span>
          </>
        ) : (
          <span className="text-sm text-ink">{labels.choose}</span>
        )}
        <Chevron className={`ml-auto shrink-0 transition-transform ${open ? "rotate-90" : "-rotate-90"}`} />
      </button>
      {open ? (
        <div id="color-chart" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {hairColors.map((item) => {
            const active = color === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  onColor(item.code);
                  setError("");
                  setOpen(false);
                }}
                className={`flex h-full flex-col border p-2 text-left ${active ? "border-ink" : "border-ink/10 hover:border-gilt"}`}
                aria-pressed={active}
              >
                <ColorSample code={item.code} className="h-14 w-full" />
                <span className="mt-2 block text-xs text-ink">{item.code}</span>
                <span className="mt-0.5 block h-[2.8rem] overflow-hidden text-[0.68rem] leading-snug text-ash">{item.name}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      <label className="field-label mt-6 max-w-[8rem]">
        {labels.qty}
        <input
          className="field"
          type="number"
          min={1}
          max={5}
          value={qty}
          onChange={(event) => setQty(Math.min(5, Math.max(1, Number(event.target.value) || 1)))}
        />
      </label>
      {error ? <p className="mt-4 text-sm text-ink">{error}</p> : null}
      <button className="btn-atelier-solid btn-atelier mt-6" type="submit">
        {labels.add}
      </button>
    </form>
  );
}

function ColorSample({ code, className }: { code: string; className?: string }) {
  return (
    <span className={`block overflow-hidden bg-linen ${className ?? ""}`}>
      <img src={colorSample(code)} alt="" className="h-full w-full object-cover" />
    </span>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-3.5 w-3.5 ${className}`}>
      <path d="M10 3 L5 8 L10 13" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

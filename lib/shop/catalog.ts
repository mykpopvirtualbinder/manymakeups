import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/shop/quote";

export type ProductKind = "uniforme" | "californianas";

export type Product = {
  id: string;
  slug: string;
  kind: ProductKind;
  luxury: boolean;
  wavy: boolean;
  lengthCm: number;
  grams: number;
  layers: number;
  layerSizes: string;
  /** PVP con IVA del 21 % incluido, en céntimos. */
  priceCents: number;
};

type Draft = {
  kind: ProductKind;
  luxury?: boolean;
  wavy?: boolean;
  lengthCm: number;
  grams: number;
  layers: number;
  layerSizes: string;
  priceCents: number;
};

function product(draft: Draft): Product {
  const luxury = Boolean(draft.luxury);
  const wavy = Boolean(draft.wavy);
  const slug = [draft.kind, luxury ? "luxury" : "", wavy ? "onduladas" : "", draft.lengthCm, draft.grams, draft.layers]
    .filter(Boolean)
    .join("-");
  return {
    id: slug,
    slug,
    kind: draft.kind,
    luxury,
    wavy,
    lengthCm: draft.lengthCm,
    grams: draft.grams,
    layers: draft.layers,
    layerSizes: draft.layerSizes,
    priceCents: draft.priceCents,
  };
}

export const products: Product[] = [
  product({ kind: "uniforme", lengthCm: 40, grams: 120, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 10599 }),
  product({ kind: "uniforme", lengthCm: 40, grams: 175, layers: 9, layerSizes: "1 x 22, 2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 13199 }),
  product({ kind: "uniforme", luxury: true, lengthCm: 40, grams: 180, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 3", priceCents: 16699 }),
  product({ kind: "californianas", luxury: true, lengthCm: 40, grams: 180, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 3", priceCents: 14485 }),
  product({ kind: "uniforme", lengthCm: 50, grams: 60, layers: 1, layerSizes: "1 x 22", priceCents: 7735 }),
  product({ kind: "uniforme", lengthCm: 50, grams: 70, layers: 7, layerSizes: "1 x 20, 2 x 15, 2 x 10, 2 x 5", priceCents: 8485 }),
  product({ kind: "uniforme", wavy: true, lengthCm: 50, grams: 70, layers: 7, layerSizes: "1 x 20, 2 x 15, 2 x 10, 2 x 5", priceCents: 8485 }),
  product({ kind: "uniforme", lengthCm: 50, grams: 100, layers: 8, layerSizes: "1 x 20, 2 x 15, 2 x 10, 3 x 5", priceCents: 10735 }),
  product({ kind: "uniforme", lengthCm: 50, grams: 140, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 12235 }),
  product({ kind: "uniforme", lengthCm: 50, grams: 160, layers: 10, layerSizes: "1 x 20, 1 x 17,5, 2 x 15, 2 x 10, 4 x 3", priceCents: 12985 }),
  product({ kind: "uniforme", luxury: true, lengthCm: 50, grams: 160, layers: 1, layerSizes: "1 x 26", priceCents: 18985 }),
  product({ kind: "uniforme", lengthCm: 50, grams: 200, layers: 9, layerSizes: "1 x 22, 2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 15985 }),
  product({ kind: "uniforme", luxury: true, lengthCm: 50, grams: 220, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 3", priceCents: 23485 }),
  product({ kind: "californianas", luxury: true, lengthCm: 50, grams: 220, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 5", priceCents: 23485 }),
  product({ kind: "uniforme", lengthCm: 60, grams: 120, layers: 8, layerSizes: "1 x 20, 2 x 15, 2 x 10, 3 x 5", priceCents: 13735 }),
  product({ kind: "uniforme", lengthCm: 60, grams: 160, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 18235 }),
  product({ kind: "uniforme", lengthCm: 60, grams: 220, layers: 9, layerSizes: "1 x 22, 2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 24985 }),
  product({ kind: "uniforme", luxury: true, lengthCm: 60, grams: 250, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 3", priceCents: 33985 }),
  product({ kind: "uniforme", lengthCm: 65, grams: 60, layers: 1, layerSizes: "1 x 22", priceCents: 9985 }),
  product({ kind: "uniforme", lengthCm: 65, grams: 120, layers: 8, layerSizes: "1 x 20, 2 x 15, 2 x 10, 3 x 5", priceCents: 14485 }),
  product({ kind: "uniforme", lengthCm: 65, grams: 160, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 18985 }),
  product({ kind: "uniforme", lengthCm: 65, grams: 220, layers: 9, layerSizes: "1 x 22, 2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 24985 }),
  product({ kind: "uniforme", lengthCm: 75, grams: 120, layers: 8, layerSizes: "1 x 20, 2 x 15, 2 x 10, 3 x 5", priceCents: 17485 }),
  product({ kind: "uniforme", lengthCm: 75, grams: 180, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 4", priceCents: 24985 }),
  product({ kind: "uniforme", luxury: true, lengthCm: 75, grams: 300, layers: 8, layerSizes: "2 x 20, 2 x 15, 2 x 10, 2 x 3", priceCents: 53485 }),
];

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug) ?? null;
}

const kindLabel: Record<Locale, { uniforme: string; californianas: string; wavy: string }> = {
  es: { uniforme: "Color uniforme", californianas: "Californianas", wavy: "onduladas" },
  en: { uniforme: "Uniform colour", californianas: "Californian", wavy: "wavy" },
  fr: { uniforme: "Couleur uniforme", californianas: "Californiennes", wavy: "ondulées" },
};

const layerWord: Record<Locale, [string, string]> = {
  es: ["capa", "capas"],
  en: ["layer", "layers"],
  fr: ["couche", "couches"],
};

export function productTitle(item: Product, locale: Locale = "es") {
  const names = kindLabel[locale];
  const kind = item.kind === "californianas" ? names.californianas : names.uniforme;
  const luxury = item.luxury ? " Luxury" : "";
  const wavy = item.wavy ? ` ${names.wavy}` : "";
  return `${kind}${luxury}${wavy}`;
}

export function productSummary(item: Product, locale: Locale = "es") {
  const word = layerWord[locale][item.layers === 1 ? 0 : 1];
  return `${item.lengthCm} cm · ${item.grams} g · ${item.layers} ${word}`;
}

export function productName(item: Product, locale: Locale = "es") {
  return `${productTitle(item, locale)}, ${productSummary(item, locale)}`;
}

export function productSeoTitle(item: Product, locale: Locale = "es") {
  const clip = locale === "en" ? "Clip-in extensions" : locale === "fr" ? "Extensions à clips" : "Extensiones de clip";
  return `${clip}, ${productTitle(item, locale)}, ${item.lengthCm} cm, ${item.grams} g`;
}

export function productSeoDescription(item: Product, locale: Locale = "es") {
  const hair =
    locale === "en"
      ? "100% natural REMY hair. Delivered throughout Spain."
      : locale === "fr"
        ? "Cheveux 100 % naturels, système REMY. Livraison dans toute l’Espagne."
        : "Cabello 100 % natural, sistema REMY. Envío a toda España.";
  return `${productSeoTitle(item, locale)}. ${hair} ${formatMoney(item.priceCents)}.`;
}

export function supplierSearchUrl(item: Product, color: string) {
  const query = `extensiones ${item.lengthCm} cm ${item.grams} gr ${color}`;
  return `https://www.lacasadelpelo.es/?s=${encodeURIComponent(query)}`;
}

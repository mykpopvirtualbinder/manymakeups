import type { Locale } from "@/lib/i18n/config";

const labels = {
  es: {
    piece: ["pieza", "piezas"],
    of: "de",
    with: "con",
    each: "por pieza",
    known: {
      "20": ["pieza extra ancha", "piezas extra anchas"],
      "15": ["pieza mediana", "piezas medianas"],
      "10": ["pieza lateral", "piezas laterales"],
      "3": ["mechón fino", "mechones finos"],
    } as Record<string, [string, string]>,
  },
  en: {
    piece: ["piece", "pieces"],
    of: "of",
    with: "with",
    each: "each",
    known: {
      "20": ["extra-wide piece", "extra-wide pieces"],
      "15": ["medium piece", "medium pieces"],
      "10": ["side piece", "side pieces"],
      "3": ["fine weft", "fine wefts"],
    } as Record<string, [string, string]>,
  },
  fr: {
    piece: ["pièce", "pièces"],
    of: "de",
    with: "avec",
    each: "par pièce",
    known: {
      "20": ["pièce extra large", "pièces extra larges"],
      "15": ["pièce moyenne", "pièces moyennes"],
      "10": ["pièce latérale", "pièces latérales"],
      "3": ["mèche fine", "mèches fines"],
    } as Record<string, [string, string]>,
  },
};

function widthOf(width: string, locale: Locale) {
  return locale === "en" ? width.replace(",", ".") : width;
}

export function kitLines(layerSizes: string, locale: Locale = "es") {
  const copy = labels[locale];
  return [...layerSizes.matchAll(/(\d+)\s*x\s*(\d+(?:,\d+)?)/g)].map((match) => {
    const count = Number(match[1]);
    const width = widthOf(match[2], locale);
    const known = copy.known[match[2]];
    const noun = known ? known[count === 1 ? 0 : 1] : copy.piece[count === 1 ? 0 : 1];
    const clips = known ? { "20": 4, "15": 3, "10": 2, "3": 1 }[match[2]] : 0;
    const clipWord = clips === 1 ? "clip" : "clips";
    const note = clips
      ? count === 1
        ? ` (${copy.with} ${clips} ${clipWord})`
        : locale === "en"
          ? ` (${copy.with} ${clips} ${clipWord} ${copy.each})`
          : ` (${copy.with} ${clips} ${clipWord} ${copy.each})`
      : "";
    return `${count} ${noun} ${copy.of} ${width} cm${note}.`;
  });
}

"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { localePath } from "@/lib/i18n/path";
import { productSummary, productTitle, type Product } from "@/lib/shop/catalog";
import { shopIntro } from "@/lib/shop/intro";
import { formatMoney } from "@/lib/shop/quote";

const lengths = [40, 50, 60, 65, 75] as const;

export function CatalogBrowser({ products }: { products: Product[] }) {
  const { locale } = useI18n();
  const copy = shopIntro[locale];
  const kinds = [
    { id: "todos", label: copy.filters.all },
    { id: "uniforme", label: copy.filters.uniforme },
    { id: "californianas", label: copy.filters.californianas },
    { id: "luxury", label: copy.filters.luxury },
    { id: "onduladas", label: copy.filters.wavy },
  ] as const;
  const [length, setLength] = useState<number | "todos">("todos");
  const [kind, setKind] = useState<(typeof kinds)[number]["id"]>("todos");
  const visible = useMemo(
    () =>
      products.filter((product) => {
        if (length !== "todos" && product.lengthCm !== length) return false;
        if (kind === "uniforme") return product.kind === "uniforme" && !product.wavy;
        if (kind === "californianas") return product.kind === "californianas";
        if (kind === "luxury") return product.luxury;
        if (kind === "onduladas") return product.wavy;
        return true;
      }),
    [products, length, kind],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Filter onClick={() => setLength("todos")} active={length === "todos"}>
          {copy.filters.allLengths}
        </Filter>
        {lengths.map((item) => (
          <Filter key={item} onClick={() => setLength(item)} active={length === item}>
            {item} cm
          </Filter>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {kinds.map((item) => (
          <Filter key={item.id} onClick={() => setKind(item.id)} active={kind === item.id}>
            {item.label}
          </Filter>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <a
            key={product.id}
            href={localePath(locale, `/tienda/${product.slug}`)}
            className="flex min-h-48 flex-col justify-between border border-ink/10 bg-linen/40 transition hover:border-gilt"
          >
            <Image
              src="/shop/miniatura.jpg"
              alt={copy.chartAlt}
              width={1152}
              height={864}
              className="aspect-[4/3] w-full object-cover"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            />
            <div className="flex flex-1 flex-col justify-between p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gilt">{productSummary(product, locale)}</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">{productTitle(product, locale)}</h2>
              <p className="mt-3 text-sm text-ash">{copy.layersLabel}: {product.layerSizes} cm</p>
              <p className="mt-6 font-serif text-2xl">{formatMoney(product.priceCents)}</p>
            </div>
          </a>
        ))}
      </div>
      {visible.length === 0 ? <p className="mt-8 text-ash">{copy.filters.empty}</p> : null}
    </div>
  );
}

function Filter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] ${active ? "border-ink bg-ink text-porcelain" : "border-ink/15 text-ash hover:border-ink hover:text-ink"}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

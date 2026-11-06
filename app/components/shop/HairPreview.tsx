"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/config";
import { getColor } from "@/lib/shop/colors";

const copy: Record<
  Locale,
  { prev: string; next: string; product: string; chart: string; length: string; weight: string; layer: string; layers: string }
> = {
  es: {
    prev: "Foto anterior",
    next: "Foto siguiente",
    product: "El set",
    chart: "Carta de colores",
    length: "Medida",
    weight: "Gramaje",
    layer: "Capa",
    layers: "Capas",
  },
  en: {
    prev: "Previous photo",
    next: "Next photo",
    product: "The set",
    chart: "Colour chart",
    length: "Length",
    weight: "Weight",
    layer: "Layer",
    layers: "Layers",
  },
  fr: {
    prev: "Photo précédente",
    next: "Photo suivante",
    product: "Le set",
    chart: "Nuancier",
    length: "Longueur",
    weight: "Poids",
    layer: "Couche",
    layers: "Couches",
  },
};

export function HairPreview({
  color,
  lengthCm,
  grams,
  layers,
  chartAlt,
}: {
  color: string;
  lengthCm: number;
  grams: number;
  layers: number;
  chartAlt: string;
}) {
  const { locale } = useI18n();
  const labels = copy[locale];
  const tone = color ? getColor(color) : null;
  const setAlt =
    locale === "en"
      ? `Clip-in set, ${lengthCm} cm, ${grams} g, ${layers} ${layers === 1 ? "layer" : "layers"}`
      : locale === "fr"
        ? `Set d'extensions, ${lengthCm} cm, ${grams} g, ${layers} ${layers === 1 ? "couche" : "couches"}`
        : `Set de extensiones, ${lengthCm} cm, ${grams} g, ${layers} ${layers === 1 ? "capa" : "capas"}`;
  const slides = [
    { key: "set", src: "/shop/set.jpg", alt: setAlt, label: labels.product, fit: "cover" as const },
    ...(tone
      ? [
          {
            key: "color",
            src: `/shop/colores/${tone.code.replace(/\//g, "-")}.jpg`,
            alt: `${tone.code}. ${tone.name}`,
            label: `${tone.code} · ${tone.name}`,
            fit: "cover" as const,
          },
        ]
      : []),
    { key: "chart", src: "/shop/carta.jpg", alt: chartAlt, label: labels.chart, fit: "contain" as const },
  ];
  const [index, setIndex] = useState(0);
  const [shownColor, setShownColor] = useState(color);
  if (color !== shownColor) {
    setShownColor(color);
    setIndex(color ? 1 : 0);
  }
  const startX = useRef<number | null>(null);
  const current = Math.min(index, slides.length - 1);

  return (
    <div className="mb-8">
      <div
        className="overflow-hidden"
        onTouchStart={(event) => {
          startX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (startX.current == null || slides.length < 2) return;
          const delta = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
          if (delta > 40) setIndex((value) => Math.max(0, value - 1));
          if (delta < -40) setIndex((value) => Math.min(slides.length - 1, value + 1));
          startX.current = null;
        }}
      >
        <div className="flex w-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.key} className="relative aspect-[4/3] w-full shrink-0 bg-porcelain">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                unoptimized
                className={slide.fit === "contain" ? "object-contain" : "object-cover"}
                sizes="(min-width: 1024px) 520px, 100vw"
              />
              {slide.key === "set" ? (
                <div className="absolute inset-y-0 right-0 flex w-[40%] items-center pr-3 sm:pr-4">
                  <div className="w-full border border-gilt/30 bg-porcelain/85 px-2.5 py-3 shadow-[0_10px_28px_rgba(26,22,19,0.06)] sm:px-3.5 sm:py-4">
                    <Fact icon={<TapeIcon />} value={String(lengthCm)} unit="cm" label={labels.length} />
                    <Fact icon={<ScaleIcon />} value={String(grams)} unit="g" label={labels.weight} />
                    <Fact icon={<LayersIcon />} value={String(layers)} label={layers === 1 ? labels.layer : labels.layers} />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 ? (
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gilt">{slides[current].label}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={labels.prev}
              disabled={current === 0}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              className="grid h-9 w-9 place-items-center border border-ink/15 text-ink disabled:opacity-30"
            >
              <Chevron />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              disabled={current === slides.length - 1}
              onClick={() => setIndex((value) => Math.min(slides.length - 1, value + 1))}
              className="grid h-9 w-9 place-items-center border border-ink/15 text-ink disabled:opacity-30"
            >
              <Chevron className="rotate-180" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Fact({
  icon,
  value,
  unit,
  label,
}: {
  icon: ReactNode;
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-ink/10 py-2.5 last:border-b-0 last:pb-0 first:pt-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gilt/40 text-gilt-deep">
        {icon}
      </span>
      <span>
        <span className="block font-serif text-2xl leading-none text-ink sm:text-3xl">
          {value}
          {unit ? <span className="ml-1 font-sans text-sm tracking-normal text-ash">{unit}</span> : null}
        </span>
        <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.16em] text-gilt">{label}</span>
      </span>
    </div>
  );
}

function TapeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
      <rect x="3.5" y="8" width="8" height="8" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7.5" cy="12" r="1.3" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M11.5 10.5h8.2M11.5 13.5h8.2" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M14 10.5v1.4M16.4 10.5v1.4M18.8 10.5v1.4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
      <path d="M12 4.5v11.5M8 19.5h8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 8.5h12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 8.5c0 2.2 1.4 3.4 3 3.4s3-1.2 3-3.4M12 8.5c0 2.2 1.4 3.4 3 3.4s3-1.2 3-3.4" fill="none" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
      <rect x="4" y="5.5" width="16" height="3.2" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <rect x="6" y="10.4" width="12" height="3.2" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <rect x="8" y="15.3" width="8" height="3.2" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-3.5 w-3.5 ${className}`}>
      <path d="M10 3 L5 8 L10 13" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

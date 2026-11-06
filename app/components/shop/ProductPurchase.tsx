"use client";

import { useState, type ReactNode } from "react";
import { AddToCart } from "./AddToCart";
import { HairPreview } from "./HairPreview";

export function ProductPurchase({
  productId,
  lengthCm,
  grams,
  layers,
  chartAlt,
  price,
  story,
}: {
  productId: string;
  lengthCm: number;
  grams: number;
  layers: number;
  chartAlt: string;
  price: ReactNode;
  story: ReactNode;
}) {
  const [color, setColor] = useState("");

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-14">
      <div className="lg:col-start-1 lg:row-start-1">
        <HairPreview color={color} lengthCm={lengthCm} grams={grams} layers={layers} chartAlt={chartAlt} />
        {price}
      </div>
      <div className="lg:sticky lg:top-40 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start">
        <AddToCart productId={productId} color={color} onColor={setColor} />
      </div>
      <div className="lg:col-start-1 lg:row-start-2">{story}</div>
    </div>
  );
}

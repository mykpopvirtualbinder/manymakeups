"use client";

import { useEffect } from "react";
import { writeCart } from "./cart-store";

export function ClearCart({ when }: { when: boolean }) {
  useEffect(() => {
    if (when) writeCart([]);
  }, [when]);
  return null;
}

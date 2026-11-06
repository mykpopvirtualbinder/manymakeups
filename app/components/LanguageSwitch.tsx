"use client";

import { useEffect, useId, useRef, useState } from "react";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/path";
import { useI18n } from "@/lib/i18n/context";

type LanguageSwitchProps = {
  current?: Locale;
  path?: string;
  enabled?: boolean;
};

export function LanguageSwitch({
  current = "es",
  path = "/",
  enabled = true,
}: LanguageSwitchProps) {
  const { messages } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-full border border-ink/20 text-ink hover:border-ink"
        aria-label={messages.nav.language}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.4 2.7 3.6 5.7 3.6 9s-1.2 6.3-3.6 9c-2.4-2.7-3.6-5.7-3.6-9s1.2-6.3 3.6-9z" />
        </svg>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={messages.nav.language}
          className="absolute right-0 top-[calc(100%+0.4rem)] z-50 min-w-36 border border-ink/10 bg-porcelain py-1"
        >
          {locales.map((locale) => {
            const active = locale === current;
            const className = `block w-full px-4 py-2 text-left text-sm ${active ? "text-ink" : "text-ash hover:text-ink"}`;
            if (!enabled && !active) {
              return (
                <span key={locale} className={`${className} opacity-40`} role="menuitem">
                  {localeNames[locale]}
                </span>
              );
            }
            return (
              <a
                key={locale}
                href={localePath(locale, path)}
                className={className}
                role="menuitemradio"
                aria-checked={active}
                hrefLang={locale}
                onClick={() => setOpen(false)}
              >
                {localeNames[locale]}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

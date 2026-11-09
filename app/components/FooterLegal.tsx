"use client";

import { useState } from "react";

export function FooterLegal({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center text-ink"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M7 3.5h7l5 5V20.5H7z" />
          <path d="M14 3.5V9h5" />
          <path d="M9.5 13h5" />
          <path d="M9.5 16.5h5" />
        </svg>
      </button>
      {open ? (
        <nav className="absolute inset-x-0 bottom-full z-20 border-t border-ink/10 bg-porcelain px-4 py-3" aria-label={label}>
          <ul className="flex flex-col">
            {links.map((item) => (
              <li key={item.href} className="border-b border-ink/10 last:border-b-0">
                <a className="block py-2.5 text-sm text-ink" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

import { InboxLink } from "@/app/components/portal/InboxLink";
import { MailAlert } from "@/app/components/portal/MailAlert";
import { listNotices, portalStoreClosed } from "@/lib/portal/store";
import Link from "next/link";
import type { ReactNode } from "react";

export async function StudioAside({ extra }: { extra?: ReactNode }) {
  const item = "flex min-h-11 w-full items-center border-b border-ink/10 text-sm uppercase tracking-[0.14em] text-ash hover:text-ink md:min-h-0 md:w-auto md:border-0 md:text-[0.68rem] md:tracking-[0.18em]";
  return (
    <div className="flex w-full flex-col md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-4 md:gap-y-2">
      <Link className={item} href="/privado/tienda">
        Tienda
      </Link>
      <Link className={item} href="/privado/novias">
        Clientas
      </Link>
      <Link className={`${item} gap-1.5`} href="/privado/correo">
        Correo
        <MailAlert />
      </Link>
      {extra}
      <Link className={item} href="/privado/calendario">
        Agenda
      </Link>
      <Link className={item} href="/privado/difusion">
        Difusión
      </Link>
      <form className="w-full md:w-auto" action="/api/portal/logout?next=/privado" method="post">
        <button
          className="inline-flex min-h-11 w-full items-center text-ink hover:text-gilt md:size-11 md:justify-center"
          type="submit"
          aria-label="Salir"
          title="Salir"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4h6A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 10 18.5V17" />
            <path d="M13 12H4" />
            <path d="m6.5 9.5-2.5 2.5 2.5 2.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export async function StudioInbox() {
  let unread = 0;
  try {
    unread = (await listNotices()).filter((notice) => !notice.read).length;
  } catch (err) {
    if (!portalStoreClosed(err)) throw err;
  }
  return <InboxLink unread={unread} />;
}

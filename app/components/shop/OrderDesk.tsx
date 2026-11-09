"use client";

import type { OrderStatus } from "@/lib/shop/types";
import { useMemo, useState, type ReactNode } from "react";

export type OrderRow = {
  id: string;
  number: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: OrderStatus;
  statusText: string;
  exempt: boolean;
  reserved: boolean;
  reservedLabel: string;
  amount: string;
  previous: string;
  closed: boolean;
};

type Filter = "all" | "waiting" | "charged" | "shipped" | "void" | "reserved";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "waiting", label: "Por confirmar" },
  { id: "charged", label: "Cobrados" },
  { id: "shipped", label: "Enviados" },
  { id: "void", label: "Anulados" },
  { id: "reserved", label: "Con reserva" },
];

export function OrderDesk({ orders, archive }: { orders: OrderRow[]; archive: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [picking, setPicking] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const visible = useMemo(() => {
    const needle = normalize(query);
    return orders.filter((order) => {
      if (!matchesFilter(order, filter)) return false;
      if (!needle) return true;
      return normalize(`${order.number} ${order.name} ${order.email} ${order.phone} ${order.city} ${order.statusText}`).includes(needle);
    });
  }, [orders, query, filter]);

  const selectedHere = selected.filter((id) => visible.some((order) => order.id === id));
  const allPicked = visible.length > 0 && selectedHere.length === visible.length;

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAll() {
    setSelected((current) => {
      const rest = current.filter((id) => !visible.some((order) => order.id === id));
      return allPicked ? rest : [...rest, ...visible.map((order) => order.id)];
    });
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          className="field lg:max-w-sm"
          type="search"
          value={query}
          placeholder="Buscar número, clienta, correo o ciudad"
          aria-label="Buscar pedidos"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={chip(filter === item.id)}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={chip(picking)}
          aria-pressed={picking}
          onClick={() => {
            setPicking((value) => !value);
            setSelected([]);
          }}
        >
          {picking ? "Hecho" : "Seleccionar"}
        </button>
        {picking ? (
          <form
            className="flex flex-wrap items-center gap-2"
            action="/api/admin/shop"
            method="post"
            onSubmit={(event) => {
              const submitter = (event.nativeEvent as SubmitEvent).submitter;
              const label = submitter instanceof HTMLButtonElement ? submitter.value : "";
              const verb = label === "void" ? "anular" : label === "delete" ? "borrar" : archive ? "recuperar" : "archivar";
              if (!selectedHere.length || !window.confirm(`¿${verb} ${selectedHere.length} pedido${selectedHere.length === 1 ? "" : "s"}?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="from" value="list" />
            <input type="hidden" name="return" value={archive ? "archivo" : ""} />
            <input type="hidden" name="bulk" value="1" />
            {selectedHere.map((id) => (
              <input key={id} type="hidden" name="orderId" value={id} />
            ))}
            <button type="button" className="text-[0.62rem] uppercase tracking-[0.14em] text-ash hover:text-ink" onClick={toggleAll}>
              {allPicked ? "Quitar" : "Todos"}
            </button>
            <span className="text-sm text-ash">{selectedHere.length} seleccionado{selectedHere.length === 1 ? "" : "s"}</span>
            <BulkButton action="void" label="Anular" disabled={!selectedHere.length} />
            <BulkButton action="delete" label="Borrar" disabled={!selectedHere.length} />
            <BulkButton action={archive ? "unarchive" : "archive"} label={archive ? "Recuperar" : "Archivar"} disabled={!selectedHere.length} />
          </form>
        ) : null}
      </div>
      <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
        {visible.map((order) => (
          <li key={order.id} className="flex items-start gap-3 py-4 md:items-center">
            {picking ? (
              <input
                className="mt-2 size-4 accent-ink md:mt-0"
                type="checkbox"
                checked={selected.includes(order.id)}
                aria-label={`Seleccionar ${order.number}`}
                onChange={() => toggle(order.id)}
              />
            ) : null}
            <a className="min-w-0 flex-1 hover:text-gilt" href={`/privado/tienda/${order.id}`}>
              <span className="block truncate text-sm text-ash">
                <span className="font-serif text-2xl text-ink">{order.number}</span>
                <span className="ml-3">
                  {order.name} · {order.statusText}
                  {order.exempt ? " · sin IVA" : ""}
                  {order.reservedLabel ? ` · ${order.reservedLabel}` : ""}
                </span>
              </span>
            </a>
            <div className="flex items-center justify-between gap-4 md:justify-end">
              <span className="shrink-0 text-right font-serif text-2xl text-ink">
                {order.previous ? <span className="mb-1 block text-sm text-ash line-through">{order.previous}</span> : null}
                {order.amount}
              </span>
              <OrderActions orderId={order.id} archive={archive} canVoid={!order.closed} />
            </div>
          </li>
        ))}
      </ul>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-ash">{orders.length === 0 ? (archive ? "No hay pedidos archivados." : "Todavía no hay pedidos.") : "Ningún pedido coincide."}</p>
      ) : null}
    </div>
  );
}

function matchesFilter(order: OrderRow, filter: Filter) {
  if (filter === "waiting") return order.status === "authorized" || order.status === "pending_payment";
  if (filter === "charged") return order.status === "confirmed";
  if (filter === "shipped") return order.status === "shipped";
  if (filter === "void") return order.status === "cancelled" || order.status === "refunded";
  if (filter === "reserved") return order.reserved;
  return true;
}

function normalize(value: string) {
  return value.toLocaleLowerCase("es").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function chip(active: boolean) {
  return active
    ? "border border-ink px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-ink"
    : "border border-transparent px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-ash hover:text-ink";
}

function BulkButton({ action, label, disabled }: { action: string; label: string; disabled: boolean }) {
  return (
    <button className="border border-ink/15 px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-porcelain disabled:opacity-30" type="submit" name="action" value={action} disabled={disabled}>
      {label}
    </button>
  );
}

function OrderActions({ orderId, archive, canVoid }: { orderId: string; archive: boolean; canVoid: boolean }) {
  const back = archive ? "archivo" : "";
  return (
    <div className="flex shrink-0 items-start gap-2">
      <Mark href={`/privado/tienda/${orderId}`} label="Entrar">
        <EnterIcon />
      </Mark>
      <MarkForm orderId={orderId} action="void" label="Anular" back={back} disabled={!canVoid}>
        <VoidIcon />
      </MarkForm>
      <MarkForm orderId={orderId} action="delete" label="Borrar" back={back}>
        <TrashIcon />
      </MarkForm>
      <MarkForm orderId={orderId} action={archive ? "unarchive" : "archive"} label={archive ? "Recuperar" : "Archivar"} back={back}>
        <ArchiveIcon />
      </MarkForm>
    </div>
  );
}

function Mark({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a className="group flex min-w-11 flex-col items-center gap-1 text-ink" href={href} aria-label={label} title={label}>
      <span className="grid size-9 place-items-center border border-ink/15 transition group-hover:border-ink group-hover:bg-ink group-hover:text-porcelain">{children}</span>
      <span className="text-[0.58rem] uppercase tracking-[0.12em] text-ash group-hover:text-ink">{label}</span>
    </a>
  );
}

function MarkForm({
  orderId,
  action,
  label,
  back,
  disabled,
  children,
}: {
  orderId: string;
  action: string;
  label: string;
  back: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <form action="/api/admin/shop" method="post">
      <input type="hidden" name="from" value="list" />
      <input type="hidden" name="return" value={back} />
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="action" value={action} />
      <button className="group flex min-w-11 flex-col items-center gap-1 text-ink disabled:pointer-events-none disabled:opacity-30" type="submit" aria-label={label} title={label} disabled={disabled}>
        <span className="grid size-9 place-items-center border border-ink/15 transition group-hover:border-ink group-hover:bg-ink group-hover:text-porcelain">{children}</span>
        <span className="text-[0.58rem] uppercase tracking-[0.12em] text-ash group-hover:text-ink">{label}</span>
      </button>
    </form>
  );
}

function EnterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M14 5h5v14h-5" />
      <path d="M4 12h11" />
      <path d="m11 8 4 4-4 4" />
    </svg>
  );
}

function VoidIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="m8 8 8 8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7l1 13h8l1-13" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 6h18v4H3z" />
      <path d="M5 10v8h14v-8" />
      <path d="M10 14h4" />
    </svg>
  );
}

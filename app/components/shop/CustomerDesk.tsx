"use client";

import { useMemo, useState } from "react";

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  vip: boolean;
  orders: number;
  spent: string;
  orderIds: string[];
};

type Filter = "all" | "orders" | "none" | "vip";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "orders", label: "Con pedidos" },
  { id: "none", label: "Sin pedidos" },
  { id: "vip", label: "VIP" },
];

export function CustomerDesk({ customers }: { customers: CustomerRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [picking, setPicking] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const visible = useMemo(() => {
    const needle = normalize(query);
    return customers.filter((customer) => {
      if (filter === "orders" && customer.orders === 0) return false;
      if (filter === "none" && customer.orders > 0) return false;
      if (filter === "vip" && !customer.vip) return false;
      if (!needle) return true;
      return normalize(`${customer.name} ${customer.email} ${customer.phone} ${customer.city} ${customer.province}`).includes(needle);
    });
  }, [customers, query, filter]);
  const picked = customers.filter((customer) => selected.includes(customer.id) && visible.some((item) => item.id === customer.id));
  const orderIds = [...new Set(picked.flatMap((customer) => customer.orderIds))];
  const allPicked = visible.length > 0 && visible.every((customer) => selected.includes(customer.id));

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          className="field lg:max-w-sm"
          type="search"
          value={query}
          placeholder="Buscar nombre, correo, teléfono o ciudad"
          aria-label="Buscar clientas"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                filter === item.id
                  ? "border border-ink px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-ink"
                  : "border border-transparent px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-ash hover:text-ink"
              }
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
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
              const verb = label === "void" ? "anular" : label === "delete" ? "borrar" : "archivar";
              if (!orderIds.length) {
                window.alert("Esas clientas no tienen pedidos.");
                event.preventDefault();
                return;
              }
              if (!window.confirm(`¿${verb} ${orderIds.length} pedido${orderIds.length === 1 ? "" : "s"} de ${picked.length} clienta${picked.length === 1 ? "" : "s"}?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="from" value="list" />
            <input type="hidden" name="return" value="clientes" />
            <input type="hidden" name="bulk" value="1" />
            {orderIds.map((id) => (
              <input key={id} type="hidden" name="orderId" value={id} />
            ))}
            <button
              type="button"
              className="text-[0.62rem] uppercase tracking-[0.14em] text-ash hover:text-ink"
              onClick={() => setSelected(allPicked ? [] : visible.map((customer) => customer.id))}
            >
              {allPicked ? "Quitar" : "Todas"}
            </button>
            <span className="text-sm text-ash">
              {picked.length} seleccionada{picked.length === 1 ? "" : "s"}
            </span>
            <BulkButton action="void" label="Anular" disabled={!picked.length} />
            <BulkButton action="delete" label="Borrar" disabled={!picked.length} />
            <BulkButton action="archive" label="Archivar" disabled={!picked.length} />
          </form>
        ) : null}
      </div>
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {visible.map((customer) => (
          <li key={customer.id} className="flex items-start gap-3">
            {picking ? (
              <input
                className="mt-6 size-4 accent-ink"
                type="checkbox"
                checked={selected.includes(customer.id)}
                aria-label={`Seleccionar ${customer.name}`}
                onChange={() => toggle(customer.id)}
              />
            ) : null}
            <a className="flex min-w-0 flex-1 flex-col gap-1 py-4 hover:text-gilt sm:flex-row sm:items-center sm:justify-between" href={`/privado/tienda/clientes/${customer.id}`}>
              <span>
                <span className="font-serif text-2xl text-ink">
                  {customer.name}
                  {customer.vip ? <span className="ml-3 align-middle text-[0.68rem] uppercase tracking-[0.18em] text-gilt">VIP · Admin</span> : null}
                </span>
                <span className="mt-1 block text-sm text-ash">
                  {customer.email} · {customer.phone} · {customer.city || "sin ciudad"}
                </span>
              </span>
              <span className="text-sm text-ash">
                {customer.orders} pedido{customer.orders === 1 ? "" : "s"} · {customer.spent}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-ash">{customers.length === 0 ? "Todavía no hay clientes." : "Ninguna clienta coincide."}</p>
      ) : null}
    </div>
  );
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

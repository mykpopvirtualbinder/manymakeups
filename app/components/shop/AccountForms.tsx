"use client";

import { useState, type FormEvent } from "react";
import { isExemptProvince } from "@/lib/shop/places";
import type { PublicCustomer } from "@/lib/shop/types";
import { AddressFields, emptyAddress, type AddressValue } from "./AddressFields";

export function AccountForms({ next }: { next: string }) {
  const [mode, setMode] = useState<"entrar" | "alta">("alta");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState<AddressValue>(emptyAddress);
  const [dni, setDni] = useState("");
  const exempt = isExemptProvince(address.province);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      firstName: String(form.get("firstName") || ""),
      lastName: String(form.get("lastName") || ""),
      phone: String(form.get("phone") || ""),
      dni,
      next,
      ...address,
    };
    const response = await fetch(mode === "alta" ? "/api/shop/register" : "/api/shop/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as { error?: string; next?: string } | null;
    setBusy(false);
    if (!response.ok) {
      setError(data?.error || "No he podido guardar la cuenta.");
      return;
    }
    window.location.href = data?.next || next;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex gap-6 text-[0.68rem] uppercase tracking-[0.18em]">
        <button type="button" className={mode === "alta" ? "text-ink" : "text-ash"} onClick={() => setMode("alta")}>
          Crear cuenta
        </button>
        <button type="button" className={mode === "entrar" ? "text-ink" : "text-ash"} onClick={() => setMode("entrar")}>
          Ya tengo cuenta
        </button>
      </div>
      <form className="mt-8 flex flex-col gap-4" onSubmit={submit}>
        {mode === "alta" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label">
                Nombre
                <input className="field" name="firstName" required autoComplete="given-name" />
              </label>
              <label className="field-label">
                Apellidos
                <input className="field" name="lastName" required autoComplete="family-name" />
              </label>
            </div>
            <label className="field-label">
              Teléfono
              <input className="field" name="phone" required autoComplete="tel" inputMode="tel" />
            </label>
          </>
        ) : null}
        <label className="field-label">
          Email
          <input className="field" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="field-label">
          Contraseña
          <input className="field" name="password" type="password" required autoComplete={mode === "alta" ? "new-password" : "current-password"} minLength={mode === "alta" ? 10 : undefined} />
        </label>
        {mode === "alta" ? (
          <>
            <p className="text-sm text-ash">Al menos 10 caracteres, con una letra y un número.</p>
            <AddressFields value={address} onChange={(patch) => setAddress((current) => ({ ...current, ...patch }))} />
            <label className="field-label">
              DNI o NIE {exempt ? "" : "(solo obligatorio en Canarias, Ceuta y Melilla)"}
              <input className="field" value={dni} required={exempt} autoComplete="off" onChange={(event) => setDni(event.target.value)} />
            </label>
          </>
        ) : null}
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        <button className="btn-atelier-solid btn-atelier mt-2 self-start" type="submit" disabled={busy}>
          {busy ? "Guardando…" : mode === "alta" ? "Crear cuenta" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export function AccountHome({ customer, admin = false }: { customer: PublicCustomer; admin?: boolean }) {
  const [address, setAddress] = useState<AddressValue>({
    street: customer.street,
    extra: customer.extra,
    postalCode: customer.postalCode,
    city: customer.city,
    province: customer.province,
  });
  const [dni, setDni] = useState(customer.dni);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const exempt = isExemptProvince(address.province);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setSaved(false);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/shop/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: String(form.get("firstName") || ""),
        lastName: String(form.get("lastName") || ""),
        phone: String(form.get("phone") || ""),
        dni,
        ...address,
      }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setBusy(false);
    if (!response.ok) {
      setError(data?.error || "No he podido guardar los datos.");
      return;
    }
    setSaved(true);
  }

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-ash">{customer.email}</p>
      <div className="mt-4 flex flex-wrap gap-6 text-[0.68rem] uppercase tracking-[0.18em]">
        <a className="text-ink hover:text-gilt" href="/tienda/cuenta/pedidos">
          Mis pedidos
        </a>
        {admin ? (
          <a className="text-gilt hover:text-ink" href="/privado/tienda">
            Administración
          </a>
        ) : null}
        <form action="/api/shop/logout" method="post">
          <button className="uppercase tracking-[0.18em] text-ash hover:text-ink" type="submit">
            Salir
          </button>
        </form>
      </div>
      <form className="mt-8 flex flex-col gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Nombre
            <input className="field" name="firstName" required defaultValue={customer.firstName} autoComplete="given-name" />
          </label>
          <label className="field-label">
            Apellidos
            <input className="field" name="lastName" required defaultValue={customer.lastName} autoComplete="family-name" />
          </label>
        </div>
        <label className="field-label">
          Teléfono
          <input className="field" name="phone" required defaultValue={customer.phone} autoComplete="tel" />
        </label>
        <AddressFields value={address} onChange={(patch) => setAddress((current) => ({ ...current, ...patch }))} />
        <label className="field-label">
          DNI o NIE {exempt ? "" : "(obligatorio si pides factura o envías a Canarias, Ceuta o Melilla)"}
          <input className="field" value={dni} required={exempt} onChange={(event) => setDni(event.target.value)} />
        </label>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        {saved ? <p className="text-sm text-ash">Datos guardados.</p> : null}
        <button className="btn-atelier mt-2 self-start" type="submit" disabled={busy}>
          {busy ? "Guardando…" : "Guardar datos"}
        </button>
      </form>
    </div>
  );
}

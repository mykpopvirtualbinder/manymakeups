"use client";

export default function PrivateAreaError() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center bg-porcelain px-6 py-16 text-ink">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gilt">Estudio</p>
      <h1 className="mt-3 font-serif text-4xl">El área privada no puede abrirse</h1>
      <p className="mt-4 text-sm leading-relaxed text-ash">
        El almacén de Vercel está cerrado hasta el 22 de noviembre, y ahí están las clientas. Recargar no lo abre. En Vercel, Storage, Upgrade to Pro lo abre hoy.
      </p>
      <a className="btn-atelier mt-8 self-start" href="/privado">
        Volver a la clave
      </a>
    </main>
  );
}

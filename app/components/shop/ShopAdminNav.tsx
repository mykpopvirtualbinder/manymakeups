const links = [
  { href: "/privado/tienda", label: "Pedidos" },
  { href: "/privado/tienda/clientes", label: "Clientes" },
];

export function ShopAdminNav({ current }: { current: "pedidos" | "clientes" }) {
  return (
    <nav className="mb-8 flex gap-6 border-b border-ink/10 text-[0.68rem] uppercase tracking-[0.18em]">
      {links.map((link) => {
        const active = (current === "pedidos" && link.href === "/privado/tienda") || (current === "clientes" && link.href.endsWith("/clientes"));
        return (
          <a key={link.href} className={active ? "-mb-px border-b border-ink pb-3 text-ink" : "pb-3 text-ash hover:text-ink"} href={link.href}>
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}

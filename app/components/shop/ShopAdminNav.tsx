const links = [
  { href: "/privado/tienda", label: "Pedidos" },
  { href: "/privado/tienda/clientes", label: "Clientes" },
];

export function ShopAdminNav({ current }: { current: "pedidos" | "clientes" }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.68rem] uppercase tracking-[0.18em]">
      {links.map((link) => {
        const active = (current === "pedidos" && link.href === "/privado/tienda") || (current === "clientes" && link.href.endsWith("/clientes"));
        return (
          <a key={link.href} className={active ? "text-ink" : "text-ash hover:text-ink"} href={link.href}>
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}

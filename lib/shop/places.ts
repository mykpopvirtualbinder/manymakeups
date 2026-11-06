export type Province = {
  name: string;
  prefixes: string[];
};

/** Prefijo de código postal de cada provincia, incluidas Ceuta y Melilla. */
export const provinces: Province[] = [
  { name: "A Coruña", prefixes: ["15"] },
  { name: "Álava", prefixes: ["01"] },
  { name: "Albacete", prefixes: ["02"] },
  { name: "Alicante", prefixes: ["03"] },
  { name: "Almería", prefixes: ["04"] },
  { name: "Asturias", prefixes: ["33"] },
  { name: "Ávila", prefixes: ["05"] },
  { name: "Badajoz", prefixes: ["06"] },
  { name: "Barcelona", prefixes: ["08"] },
  { name: "Bizkaia", prefixes: ["48"] },
  { name: "Burgos", prefixes: ["09"] },
  { name: "Cáceres", prefixes: ["10"] },
  { name: "Cádiz", prefixes: ["11"] },
  { name: "Cantabria", prefixes: ["39"] },
  { name: "Castellón", prefixes: ["12"] },
  { name: "Ceuta", prefixes: ["51"] },
  { name: "Ciudad Real", prefixes: ["13"] },
  { name: "Córdoba", prefixes: ["14"] },
  { name: "Cuenca", prefixes: ["16"] },
  { name: "Gipuzkoa", prefixes: ["20"] },
  { name: "Girona", prefixes: ["17"] },
  { name: "Granada", prefixes: ["18"] },
  { name: "Guadalajara", prefixes: ["19"] },
  { name: "Huelva", prefixes: ["21"] },
  { name: "Huesca", prefixes: ["22"] },
  { name: "Illes Balears", prefixes: ["07"] },
  { name: "Jaén", prefixes: ["23"] },
  { name: "La Rioja", prefixes: ["26"] },
  { name: "Las Palmas", prefixes: ["35"] },
  { name: "León", prefixes: ["24"] },
  { name: "Lleida", prefixes: ["25"] },
  { name: "Lugo", prefixes: ["27"] },
  { name: "Madrid", prefixes: ["28"] },
  { name: "Málaga", prefixes: ["29"] },
  { name: "Melilla", prefixes: ["52"] },
  { name: "Murcia", prefixes: ["30"] },
  { name: "Navarra", prefixes: ["31"] },
  { name: "Ourense", prefixes: ["32"] },
  { name: "Palencia", prefixes: ["34"] },
  { name: "Pontevedra", prefixes: ["36"] },
  { name: "Salamanca", prefixes: ["37"] },
  { name: "Santa Cruz de Tenerife", prefixes: ["38"] },
  { name: "Segovia", prefixes: ["40"] },
  { name: "Sevilla", prefixes: ["41"] },
  { name: "Soria", prefixes: ["42"] },
  { name: "Tarragona", prefixes: ["43"] },
  { name: "Teruel", prefixes: ["44"] },
  { name: "Toledo", prefixes: ["45"] },
  { name: "Valencia", prefixes: ["46"] },
  { name: "Valladolid", prefixes: ["47"] },
  { name: "Zamora", prefixes: ["49"] },
  { name: "Zaragoza", prefixes: ["50"] },
];

const exempt = new Set(["Las Palmas", "Santa Cruz de Tenerife", "Ceuta", "Melilla"]);

export function isExemptProvince(province: string) {
  return exempt.has(province);
}

export function findProvince(name: string) {
  return provinces.find((province) => province.name === name) ?? null;
}

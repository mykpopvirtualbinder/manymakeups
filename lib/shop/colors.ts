export type HairColor = {
  code: string;
  name: string;
  swatch: string;
};

export const hairColors: HairColor[] = [
  { code: "01", name: "Negro", swatch: "#161311" },
  { code: "1B", name: "Negro natural", swatch: "#0c0b0a" },
  { code: "1C", name: "Castaño muy oscuro", swatch: "#3a2418" },
  { code: "02", name: "Castaño oscuro", swatch: "#4a2e1e" },
  { code: "04", name: "Castaño", swatch: "#6d4428" },
  { code: "06", name: "Castaño claro", swatch: "#8d5a34" },
  { code: "08", name: "Rubio oscuro", swatch: "#a67c4e" },
  { code: "16", name: "Rubio", swatch: "#c4a06a" },
  { code: "18", name: "Rubio claro", swatch: "#d7b98a" },
  { code: "22", name: "Rubio dorado", swatch: "#e2c48a" },
  { code: "27", name: "Cobrizo", swatch: "#b86a45" },
  { code: "33", name: "Caoba", swatch: "#8a4034" },
  { code: "613", name: "Rubio platino", swatch: "#f2e4c4" },
  { code: "60", name: "Rubio ceniza", swatch: "#d5cdc2" },
  { code: "1001", name: "Rubio beige claro", swatch: "#d2c6b8" },
  { code: "60W", name: "Rubio ceniza frío", swatch: "#c9c3bc" },
  { code: "SILVER", name: "Plata", swatch: "#b7b4b6" },
  { code: "1B/613", name: "Negro con mechas platino", swatch: "linear-gradient(115deg, #12100e 46%, #f2e4c4 54%)" },
  { code: "02/613", name: "Castaño oscuro con mechas platino", swatch: "linear-gradient(115deg, #4a2e1e 46%, #f2e4c4 54%)" },
  { code: "04/613", name: "Castaño con mechas platino", swatch: "linear-gradient(115deg, #6d4428 46%, #f2e4c4 54%)" },
  { code: "06/613", name: "Castaño claro con mechas platino", swatch: "linear-gradient(115deg, #8d5a34 46%, #f2e4c4 54%)" },
  { code: "12/613", name: "Rubio medio con mechas platino", swatch: "linear-gradient(115deg, #b8926a 46%, #f2e4c4 54%)" },
  { code: "18/613", name: "Rubio claro con mechas platino", swatch: "linear-gradient(115deg, #c48b78 46%, #f3e4d4 54%)" },
  { code: "27/613", name: "Cobrizo con mechas platino", swatch: "linear-gradient(115deg, #b86a45 46%, #f2e4c4 54%)" },
];

export function getColor(code: string) {
  return hairColors.find((color) => color.code === code) ?? null;
}

export function colorSample(code: string) {
  return `/shop/muestras/${code.replace(/\//g, "-")}.jpg`;
}

import { normalize } from "./math";
export type Row = {
  name: string;
  price: string;
  size: string;
  unit: "ml" | "oz";
};
export const initial: Row[] = [
  { name: "Product A", price: "", size: "", unit: "ml" },
  { name: "Product B", price: "", size: "", unit: "ml" },
];
export function parseRows(raw?: string): Row[] {
  if (!raw || raw.length > 10000) return initial;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data) || data.length < 2 || data.length > 6)
      return initial;
    if (
      !data.every((r: unknown) => {
        if (typeof r !== "object" || r === null) return false;
        const v = r as Record<string, unknown>;
        return (
          typeof v.name === "string" &&
          v.name.length <= 80 &&
          typeof v.price === "string" &&
          v.price.trim() !== "" &&
          typeof v.size === "string" &&
          v.size.trim() !== "" &&
          (v.unit === "ml" || v.unit === "oz") &&
          !!normalize(Number(v.price), Number(v.size), v.unit)
        );
      })
    )
      return initial;
    return data.map((r) => ({
      name: r.name,
      price: r.price,
      size: r.size,
      unit: r.unit,
    }));
  } catch {
    return initial;
  }
}

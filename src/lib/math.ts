export const ML_PER_US_OZ = 29.5735295625;
export function normalize(price: number, size: number, unit: "ml" | "oz") {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(size) ||
    price < 0 ||
    size <= 0
  )
    return null;
  const ml = unit === "oz" ? size * ML_PER_US_OZ : size;
  const perMl = price / ml;
  if (!Number.isFinite(perMl) || !Number.isFinite(perMl * ML_PER_US_OZ))
    return null;
  return { ml, perMl, perOz: perMl * ML_PER_US_OZ };
}
export function difference(a: number, b: number) {
  return a === 0 ? null : ((b - a) / a) * 100;
}
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
export function compareLabels(a: string[], b: string[]) {
  const match = (v: string, list: string[]) =>
    list.some((x) => x.toLowerCase() === v.toLowerCase());
  return {
    shared: a.filter((x) => match(x, b)),
    onlyA: a.filter((x) => !match(x, b)),
    onlyB: b.filter((x) => !match(x, a)),
  };
}

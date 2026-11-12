import raw from "../data/public-catalog.json";
import { catalogSchema } from "./catalog-schema";
import { catalogSelectors } from "./catalog-selectors";
export type { Product, Ingredient } from "./catalog-schema";

export const catalog = catalogSchema.omit({ comparisons: true }).parse(raw);
export const { ingredientForName, products, brandName, priceFor, sourceFor } =
  catalogSelectors(catalog);

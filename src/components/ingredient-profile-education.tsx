import "server-only";
import { IngredientEducation } from "./ingredient-education";
import { policyForPath } from "@/lib/publication-registry";
import { ingredientPath } from "@/lib/config";
import type { Ingredient } from "@/lib/data";

export function IngredientProfileEducation({
  ingredient,
}: {
  ingredient: Ingredient;
}) {
  return (
    <IngredientEducation
      ingredient={ingredient}
      scientificReviewed={
        policyForPath(ingredientPath(ingredient.slug))?.scientificReviewed
      }
    />
  );
}

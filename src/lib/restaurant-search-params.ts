import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import type { PriceBracket, RestaurantSort } from "@/lib/restaurants";

const SORT_VALUES: RestaurantSort[] = ["name", "rating", "distance"];
const PRICE_BRACKET_VALUES: PriceBracket[] = ["under5000", "under10000", "under20000", "over20000"];

export function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseArea(value: string | string[] | undefined): CommercialArea | undefined {
  const raw = firstValue(value);
  return raw && raw in CommercialArea ? (raw as CommercialArea) : undefined;
}

export function parseCategory(value: string | string[] | undefined): FoodCategory | undefined {
  const raw = firstValue(value);
  return raw && raw in FoodCategory ? (raw as FoodCategory) : undefined;
}

export function parseSort(value: string | string[] | undefined): RestaurantSort {
  const raw = firstValue(value);
  return (SORT_VALUES as string[]).includes(raw ?? "") ? (raw as RestaurantSort) : "name";
}

export function parsePriceBracket(value: string | string[] | undefined): PriceBracket | undefined {
  const raw = firstValue(value);
  return (PRICE_BRACKET_VALUES as string[]).includes(raw ?? "") ? (raw as PriceBracket) : undefined;
}

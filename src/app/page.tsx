import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import { RestaurantCard } from "@/components/restaurant-card";
import { RestaurantFilterBar } from "@/components/restaurant-filter-bar";
import { RestaurantsMap } from "@/components/restaurants-map";
import { getRestaurants, type RestaurantSort } from "@/lib/restaurants";

const SORT_VALUES: RestaurantSort[] = ["name", "rating", "distance"];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseArea(value: string | string[] | undefined): CommercialArea | undefined {
  const raw = firstValue(value);
  return raw && raw in CommercialArea ? (raw as CommercialArea) : undefined;
}

function parseCategory(value: string | string[] | undefined): FoodCategory | undefined {
  const raw = firstValue(value);
  return raw && raw in FoodCategory ? (raw as FoodCategory) : undefined;
}

function parseSort(value: string | string[] | undefined): RestaurantSort {
  const raw = firstValue(value);
  return (SORT_VALUES as string[]).includes(raw ?? "") ? (raw as RestaurantSort) : "name";
}

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const area = parseArea(searchParams.area);
  const category = parseCategory(searchParams.category);
  const q = firstValue(searchParams.q)?.trim() || undefined;
  const sort = parseSort(searchParams.sort);
  const partnered = firstValue(searchParams.partnered) === "1";

  const restaurants = await getRestaurants({ area, category, q, sort, partnered });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">오늘 학식 말고 뭐 먹지?</h1>
        <p className="text-sm text-muted-foreground">
          전남대 주변 상권별 맛집을 찾아보세요.
        </p>
      </div>

      <RestaurantFilterBar area={area} category={category} q={q} sort={sort} partnered={partnered} />

      <RestaurantsMap restaurants={restaurants} area={area} />

      {restaurants.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          조건에 맞는 식당이 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </main>
  );
}

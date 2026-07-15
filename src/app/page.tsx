import { CollapsibleResults } from "@/components/collapsible-results";
import { RestaurantCard } from "@/components/restaurant-card";
import { RestaurantFilterBar } from "@/components/restaurant-filter-bar";
import { RestaurantsMap } from "@/components/restaurants-map";
import { AREA_LABELS } from "@/lib/restaurant-labels";
import { firstValue, parseArea, parseCategory, parseSort } from "@/lib/restaurant-search-params";
import { getRestaurants } from "@/lib/restaurants";

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

      <CollapsibleResults
        label={`전남대 주변 맛집 검색 결과 (${restaurants.length}개) · ${area ? AREA_LABELS[area] : "캠퍼스 전체"}`}
      >
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
      </CollapsibleResults>
    </main>
  );
}

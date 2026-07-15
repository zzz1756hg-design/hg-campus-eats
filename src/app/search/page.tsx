import { RestaurantCard } from "@/components/restaurant-card";
import { SearchFilterPanel } from "@/components/search-filter-panel";
import {
  firstValue,
  parseArea,
  parseCategory,
  parsePriceBracket,
  parseSort,
} from "@/lib/restaurant-search-params";
import { getRestaurants } from "@/lib/restaurants";

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const area = parseArea(searchParams.area);
  const category = parseCategory(searchParams.category);
  const q = firstValue(searchParams.q)?.trim() || undefined;
  const sort = parseSort(searchParams.sort);
  const partnered = firstValue(searchParams.partnered) === "1";
  const priceBracket = parsePriceBracket(searchParams.priceBracket);

  const restaurants = await getRestaurants({ area, category, q, sort, partnered, priceBracket });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">검색 필터</h1>
        <p className="text-sm text-muted-foreground">원하는 조건으로 맛집을 좁혀보세요.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <SearchFilterPanel
          area={area}
          category={category}
          q={q}
          sort={sort}
          partnered={partnered}
          priceBracket={priceBracket}
        />

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            검색 매칭 결과: {restaurants.length}개 맛집 발견
          </p>
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
        </div>
      </div>
    </main>
  );
}

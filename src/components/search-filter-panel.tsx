import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import type { PriceBracket, RestaurantSort } from "@/lib/restaurants";
import { AREA_LABELS, AREAS, CATEGORY_LABELS, CATEGORIES } from "@/lib/restaurant-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  area?: CommercialArea;
  category?: FoodCategory;
  q?: string;
  sort?: RestaurantSort;
  partnered?: boolean;
  priceBracket?: PriceBracket;
};

const PRICE_BRACKET_OPTIONS: { value: PriceBracket; label: string }[] = [
  { value: "under5000", label: "~5천원" },
  { value: "under10000", label: "~1만원" },
  { value: "under20000", label: "~2만원" },
  { value: "over20000", label: "2만원 이상" },
];

const SORT_OPTIONS: { value: RestaurantSort; label: string }[] = [
  { value: "name", label: "이름순" },
  { value: "rating", label: "평점 높은순" },
  { value: "distance", label: "가까운순" },
];

const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function SearchFilterPanel({ area, category, q, sort = "name", partnered, priceBracket }: Props) {
  return (
    <form action="/search" method="get" className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="q">식당, 메뉴 검색</Label>
        <Input id="q" type="search" name="q" placeholder="예) 제육볶음" defaultValue={q ?? ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="priceBracket">가격대</Label>
        <select id="priceBracket" name="priceBracket" defaultValue={priceBracket ?? ""} className={selectClassName}>
          <option value="">전체 가격</option>
          {PRICE_BRACKET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">카테고리</Label>
        <select id="category" name="category" defaultValue={category ?? ""} className={selectClassName}>
          <option value="">전체</option>
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="area">캠퍼스 문 (위치)</Label>
        <select id="area" name="area" defaultValue={area ?? ""} className={selectClassName}>
          <option value="">전체 구역</option>
          {AREAS.map((value) => (
            <option key={value} value={value}>
              {AREA_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sort">정렬 기준</Label>
        <select id="sort" name="sort" defaultValue={sort} className={selectClassName}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="partnered"
          name="partnered"
          value="1"
          defaultChecked={partnered}
          className="size-4"
        />
        <Label htmlFor="partnered">제휴 이벤트 매장만</Label>
      </div>

      <Button type="submit">필터 적용하기</Button>
    </form>
  );
}

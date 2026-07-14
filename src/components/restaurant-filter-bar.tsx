import Link from "next/link";

import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import type { RestaurantSort } from "@/lib/restaurants";
import { AREA_LABELS, AREAS, CATEGORY_LABELS, CATEGORIES } from "@/lib/restaurant-labels";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  area?: CommercialArea;
  category?: FoodCategory;
  q?: string;
  sort?: RestaurantSort;
};

const SORT_OPTIONS: { value: RestaurantSort; label: string }[] = [
  { value: "name", label: "이름순" },
  { value: "rating", label: "별점순" },
  { value: "distance", label: "거리순" },
];

function filterHref(current: Props, changes: Partial<Props>) {
  const next = { ...current, ...changes };
  const params = new URLSearchParams();
  if (next.area) params.set("area", next.area);
  if (next.category) params.set("category", next.category);
  if (next.q) params.set("q", next.q);
  if (next.sort && next.sort !== "name") params.set("sort", next.sort);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: active ? "default" : "outline", size: "sm" }),
        "rounded-full"
      )}
    >
      {children}
    </Link>
  );
}

export function RestaurantFilterBar({ area, category, q, sort = "name" }: Props) {
  const current = { area, category, q, sort };

  return (
    <div className="flex flex-col gap-3">
      <form action="/" className="flex gap-2">
        {area && <input type="hidden" name="area" value={area} />}
        {category && <input type="hidden" name="category" value={category} />}
        {sort !== "name" && <input type="hidden" name="sort" value={sort} />}
        <Input
          type="search"
          name="q"
          placeholder="식당 이름으로 검색"
          defaultValue={q ?? ""}
          className="h-9"
        />
      </form>

      <div className="flex flex-wrap gap-1.5">
        <FilterLink href={filterHref(current, { area: undefined })} active={!area}>
          전체 상권
        </FilterLink>
        {AREAS.map((value) => (
          <FilterLink
            key={value}
            href={filterHref(current, { area: value })}
            active={area === value}
          >
            {AREA_LABELS[value]}
          </FilterLink>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterLink href={filterHref(current, { category: undefined })} active={!category}>
          전체 카테고리
        </FilterLink>
        {CATEGORIES.map((value) => (
          <FilterLink
            key={value}
            href={filterHref(current, { category: value })}
            active={category === value}
          >
            {CATEGORY_LABELS[value]}
          </FilterLink>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">정렬</span>
        {SORT_OPTIONS.map((option) => (
          <FilterLink
            key={option.value}
            href={filterHref(current, { sort: option.value })}
            active={sort === option.value}
          >
            {option.label}
          </FilterLink>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";

import type { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import { updateRestaurantInfo } from "@/lib/actions/admin-restaurant-info";
import { AREAS, AREA_LABELS, CATEGORIES, CATEGORY_LABELS } from "@/lib/restaurant-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function AdminRestaurantInfoForm({
  restaurantId,
  name,
  address,
  phone,
  area,
  category,
}: {
  restaurantId: string;
  name: string;
  address: string;
  phone: string | null;
  area: CommercialArea;
  category: FoodCategory;
}) {
  const action = updateRestaurantInfo.bind(null, restaurantId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-dashed p-3 text-sm">
      <h3 className="text-sm font-semibold">식당 정보 수정 (관리자)</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 flex flex-col gap-1">
          <Label htmlFor={`restaurant-name-${restaurantId}`}>이름</Label>
          <Input
            id={`restaurant-name-${restaurantId}`}
            name="name"
            defaultValue={name}
            required
            className="h-8"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label htmlFor={`restaurant-address-${restaurantId}`}>주소</Label>
          <Input
            id={`restaurant-address-${restaurantId}`}
            name="address"
            defaultValue={address}
            required
            className="h-8"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`restaurant-area-${restaurantId}`}>상권</Label>
          <select
            id={`restaurant-area-${restaurantId}`}
            name="area"
            defaultValue={area}
            className={selectClassName}
          >
            {AREAS.map((value) => (
              <option key={value} value={value}>
                {AREA_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`restaurant-category-${restaurantId}`}>카테고리</Label>
          <select
            id={`restaurant-category-${restaurantId}`}
            name="category"
            defaultValue={category}
            className={selectClassName}
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label htmlFor={`restaurant-phone-${restaurantId}`}>전화번호</Label>
          <Input
            id={`restaurant-phone-${restaurantId}`}
            name="phone"
            defaultValue={phone ?? ""}
            className="h-8"
          />
        </div>
      </div>
      {state?.error && <p className="text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "저장 중..." : "정보 저장"}
      </Button>
    </form>
  );
}

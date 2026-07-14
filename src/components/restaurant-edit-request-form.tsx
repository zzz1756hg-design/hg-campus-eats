"use client";

import { useActionState, useState } from "react";

import {
  submitInfoCorrectionRequest,
  submitMenuAddRequest,
  submitMenuPriceFixRequest,
} from "@/lib/actions/restaurant-edit-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MenuOption = { id: string; name: string; price: number };
type TabKey = "info" | "menu-add" | "menu-price";

const TABS: { key: TabKey; label: string }[] = [
  { key: "info", label: "정보 수정" },
  { key: "menu-add", label: "메뉴 추가" },
  { key: "menu-price", label: "메뉴 가격 수정" },
];

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function SuccessMessage() {
  return (
    <p className="text-sm text-muted-foreground">
      수정요청이 접수되었어요. 검토 후 반영될 예정이에요.
    </p>
  );
}

function InfoCorrectionForm({ restaurantId }: { restaurantId: string }) {
  const action = submitInfoCorrectionRequest.bind(null, restaurantId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.success) return <SuccessMessage />;

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Label htmlFor="description">어떤 정보가 틀렸나요?</Label>
      <Textarea
        id="description"
        name="description"
        required
        maxLength={500}
        placeholder="예: 전화번호가 바뀌었어요. 062-000-0000으로 수정해주세요."
      />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "제출 중..." : "수정요청 제출"}
      </Button>
    </form>
  );
}

function MenuAddForm({ restaurantId }: { restaurantId: string }) {
  const action = submitMenuAddRequest.bind(null, restaurantId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.success) return <SuccessMessage />;

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="menuName">메뉴 이름</Label>
          <Input id="menuName" name="menuName" required maxLength={50} className="h-8" />
        </div>
        <div className="flex w-28 flex-col gap-1">
          <Label htmlFor="menuPrice">가격</Label>
          <Input id="menuPrice" name="menuPrice" type="number" min={0} required className="h-8" />
        </div>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "제출 중..." : "메뉴 추가요청 제출"}
      </Button>
    </form>
  );
}

function MenuPriceFixForm({ restaurantId, menus }: { restaurantId: string; menus: MenuOption[] }) {
  const action = submitMenuPriceFixRequest.bind(null, restaurantId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.success) return <SuccessMessage />;

  if (menus.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        등록된 메뉴가 없어서 가격 수정요청을 할 수 없어요.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="menuId">메뉴 선택</Label>
          <select id="menuId" name="menuId" required className={selectClassName}>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name} ({menu.price.toLocaleString()}원)
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-28 flex-col gap-1">
          <Label htmlFor="menuPrice">제안 가격</Label>
          <Input id="menuPrice" name="menuPrice" type="number" min={0} required className="h-8" />
        </div>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "제출 중..." : "가격 수정요청 제출"}
      </Button>
    </form>
  );
}

export function RestaurantEditRequestForm({
  restaurantId,
  menus,
}: {
  restaurantId: string;
  menus: MenuOption[];
}) {
  const [tab, setTab] = useState<TabKey>("info");

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <h3 className="text-sm font-semibold">식당 정보가 틀렸나요?</h3>
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <Button
            key={t.key}
            type="button"
            size="sm"
            variant={tab === t.key ? "default" : "outline"}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      {tab === "info" && <InfoCorrectionForm restaurantId={restaurantId} />}
      {tab === "menu-add" && <MenuAddForm restaurantId={restaurantId} />}
      {tab === "menu-price" && <MenuPriceFixForm restaurantId={restaurantId} menus={menus} />}
    </div>
  );
}

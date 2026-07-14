"use client";

import { useActionState } from "react";

import { createMenu, deleteMenu, updateMenu } from "@/lib/actions/admin-menus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type MenuItem = { id: string; name: string; price: number };

function MenuRow({ restaurantId, menu }: { restaurantId: string; menu: MenuItem }) {
  const editAction = updateMenu.bind(null, menu.id, restaurantId);
  const [state, formAction, pending] = useActionState(editAction, undefined);

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <form action={formAction} className="flex flex-1 items-center gap-2">
          <Input name="name" defaultValue={menu.name} required className="h-8" />
          <Input name="price" type="number" defaultValue={menu.price} required className="h-8 w-28" />
          <Button type="submit" size="sm" variant="outline" disabled={pending}>
            저장
          </Button>
        </form>
        <form action={deleteMenu.bind(null, menu.id, restaurantId)}>
          <Button type="submit" size="sm" variant="ghost">
            삭제
          </Button>
        </form>
      </div>
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
    </li>
  );
}

function AddMenuForm({ restaurantId }: { restaurantId: string }) {
  const action = createMenu.bind(null, restaurantId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Input name="name" placeholder="메뉴 이름" required className="h-8" />
        <Input name="price" type="number" placeholder="가격" required className="h-8 w-28" />
        <Button type="submit" size="sm" disabled={pending}>
          추가
        </Button>
      </div>
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  );
}

export function AdminMenuManager({
  restaurantId,
  menus,
}: {
  restaurantId: string;
  menus: MenuItem[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dashed p-3">
      <h3 className="text-sm font-semibold">메뉴 관리 (관리자)</h3>
      {menus.length > 0 && (
        <ul className="flex flex-col gap-2">
          {menus.map((menu) => (
            <MenuRow key={menu.id} restaurantId={restaurantId} menu={menu} />
          ))}
        </ul>
      )}
      <AddMenuForm restaurantId={restaurantId} />
    </div>
  );
}

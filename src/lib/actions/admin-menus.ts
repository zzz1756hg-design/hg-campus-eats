"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";

const MenuSchema = z.object({
  name: z.string().trim().min(1, { error: "메뉴 이름을 입력해주세요." }).max(50),
  price: z.coerce.number().int().min(0, { error: "가격을 확인해주세요." }),
});

export type MenuState = { error?: string } | undefined;

export async function createMenu(
  restaurantId: string,
  _state: MenuState,
  formData: FormData
): Promise<MenuState> {
  await requireAdminSession();

  const parsed = MenuSchema.safeParse({ name: formData.get("name"), price: formData.get("price") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  await prisma.menu.create({ data: { restaurantId, ...parsed.data } });
  revalidatePath(`/restaurants/${restaurantId}`);
}

export async function updateMenu(
  menuId: string,
  restaurantId: string,
  _state: MenuState,
  formData: FormData
): Promise<MenuState> {
  await requireAdminSession();

  const parsed = MenuSchema.safeParse({ name: formData.get("name"), price: formData.get("price") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  await prisma.menu.update({ where: { id: menuId }, data: parsed.data });
  revalidatePath(`/restaurants/${restaurantId}`);
}

export async function deleteMenu(menuId: string, restaurantId: string) {
  await requireAdminSession();
  await prisma.menu.delete({ where: { id: menuId } });
  revalidatePath(`/restaurants/${restaurantId}`);
}

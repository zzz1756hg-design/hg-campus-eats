"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  InfoCorrectionSchema,
  MenuAddSchema,
  MenuPriceFixSchema,
} from "@/lib/validations/restaurant-edit-request";

export type EditRequestState = { error?: string; success?: boolean } | undefined;

export async function submitInfoCorrectionRequest(
  restaurantId: string,
  _state: EditRequestState,
  formData: FormData
): Promise<EditRequestState> {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요해요." };

  const parsed = InfoCorrectionSchema.safeParse({ description: formData.get("description") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  await prisma.restaurantEditRequest.create({
    data: {
      userId: session.user.id,
      restaurantId,
      type: "INFO_CORRECTION",
      description: parsed.data.description,
    },
  });

  revalidatePath("/edit-requests");
  return { success: true };
}

export async function submitMenuAddRequest(
  restaurantId: string,
  _state: EditRequestState,
  formData: FormData
): Promise<EditRequestState> {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요해요." };

  const parsed = MenuAddSchema.safeParse({
    menuName: formData.get("menuName"),
    menuPrice: formData.get("menuPrice"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  await prisma.restaurantEditRequest.create({
    data: {
      userId: session.user.id,
      restaurantId,
      type: "MENU_ADD",
      menuName: parsed.data.menuName,
      menuPrice: parsed.data.menuPrice,
    },
  });

  revalidatePath("/edit-requests");
  return { success: true };
}

export async function submitMenuPriceFixRequest(
  restaurantId: string,
  _state: EditRequestState,
  formData: FormData
): Promise<EditRequestState> {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요해요." };

  const parsed = MenuPriceFixSchema.safeParse({
    menuId: formData.get("menuId"),
    menuPrice: formData.get("menuPrice"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const menu = await prisma.menu.findUnique({ where: { id: parsed.data.menuId } });
  if (!menu || menu.restaurantId !== restaurantId) {
    return { error: "메뉴를 찾을 수 없어요." };
  }

  await prisma.restaurantEditRequest.create({
    data: {
      userId: session.user.id,
      restaurantId,
      type: "MENU_PRICE_FIX",
      menuId: menu.id,
      menuName: menu.name,
      menuPrice: parsed.data.menuPrice,
    },
  });

  revalidatePath("/edit-requests");
  return { success: true };
}

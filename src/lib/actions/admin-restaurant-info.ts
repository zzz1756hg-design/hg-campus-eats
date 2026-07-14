"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";

const UpdateRestaurantSchema = z.object({
  name: z.string().trim().min(1, { error: "식당 이름을 입력해주세요." }).max(100),
  address: z.string().trim().min(1, { error: "주소를 입력해주세요." }).max(200),
  phone: z.string().trim(),
  area: z.enum(CommercialArea),
  category: z.enum(FoodCategory),
});

export type UpdateRestaurantState = { error?: string } | undefined;

export async function updateRestaurantInfo(
  restaurantId: string,
  _state: UpdateRestaurantState,
  formData: FormData
): Promise<UpdateRestaurantState> {
  await requireAdminSession();

  const parsed = UpdateRestaurantSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    area: formData.get("area"),
    category: formData.get("category"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const { name, address, phone, area, category } = parsed.data;

  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { name, address, phone: phone || null, area, category },
  });

  revalidatePath(`/restaurants/${restaurantId}`);
  revalidatePath("/");
}

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RestaurantRequestSchema } from "@/lib/validations/restaurant-request";

export type RestaurantRequestState = { error?: string; success?: boolean } | undefined;

export async function submitRestaurantRequest(
  _state: RestaurantRequestState,
  formData: FormData
): Promise<RestaurantRequestState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "로그인이 필요해요." };
  }

  const parsed = RestaurantRequestSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const { name, address, reason } = parsed.data;

  await prisma.restaurantRequest.create({
    data: {
      userId: session.user.id,
      name,
      address: address || null,
      reason: reason || null,
    },
  });

  revalidatePath("/requests");
  return { success: true };
}

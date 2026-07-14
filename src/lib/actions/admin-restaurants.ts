"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";

export async function setRestaurantPartnership(restaurantId: string, isPartnered: boolean) {
  await requireAdminSession();

  await prisma.restaurant.update({ where: { id: restaurantId }, data: { isPartnered } });

  revalidatePath(`/restaurants/${restaurantId}`);
  revalidatePath("/");
}

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(restaurantId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("로그인이 필요해요.");
  }
  const userId = session.user.id;

  const existing = await prisma.favorite.findUnique({
    where: { userId_restaurantId: { userId, restaurantId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId, restaurantId } });
  }

  revalidatePath(`/restaurants/${restaurantId}`);
  revalidatePath("/");
}

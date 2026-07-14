"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";

export async function adminDeleteReview(reviewId: string) {
  await requireAdminSession();

  const review = await prisma.review.delete({ where: { id: reviewId } });

  revalidatePath("/admin/reviews");
  revalidatePath(`/restaurants/${review.restaurantId}`);
}

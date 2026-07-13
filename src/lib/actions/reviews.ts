"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  content: z
    .string()
    .trim()
    .min(1, { error: "리뷰 내용을 입력해주세요." })
    .max(1000, { error: "리뷰는 1000자 이내로 작성해주세요." }),
});

export type ReviewState = { error?: string } | undefined;

export async function submitReview(
  restaurantId: string,
  _state: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "로그인이 필요해요." };
  }

  const parsed = ReviewSchema.safeParse({
    rating: formData.get("rating"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const { rating, content } = parsed.data;
  const userId = session.user.id;

  await prisma.review.upsert({
    where: { userId_restaurantId: { userId, restaurantId } },
    create: { userId, restaurantId, rating, content },
    update: { rating, content },
  });

  revalidatePath(`/restaurants/${restaurantId}`);
}

"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { auth } from "@/auth";
import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

const ApproveSchema = z.object({
  area: z.enum(CommercialArea),
  category: z.enum(FoodCategory),
  latitude: z.coerce.number({ error: "위도를 숫자로 입력해주세요." }),
  longitude: z.coerce.number({ error: "경도를 숫자로 입력해주세요." }),
  phone: z.string().trim(),
});

export type AdminRequestState = { error?: string } | undefined;

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("관리자만 접근할 수 있어요.");
  }
  return session;
}

export async function approveRequest(
  requestId: string,
  _state: AdminRequestState,
  formData: FormData
): Promise<AdminRequestState> {
  await requireAdmin();

  const parsed = ApproveSchema.safeParse({
    area: formData.get("area"),
    category: formData.get("category"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const request = await prisma.restaurantRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "PENDING") {
    return { error: "이미 처리된 요청이에요." };
  }

  const { area, category, latitude, longitude, phone } = parsed.data;

  await prisma.$transaction(async (tx) => {
    const restaurant = await tx.restaurant.create({
      data: {
        name: request.name,
        address: request.address ?? "",
        latitude,
        longitude,
        phone: phone || null,
        area,
        category,
      },
    });
    await tx.restaurantRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED", restaurantId: restaurant.id },
    });
  });

  revalidatePath("/admin/requests");
  revalidatePath("/");
}

export async function rejectRequest(requestId: string) {
  await requireAdmin();

  await prisma.restaurantRequest.updateMany({
    where: { id: requestId, status: "PENDING" },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/requests");
}

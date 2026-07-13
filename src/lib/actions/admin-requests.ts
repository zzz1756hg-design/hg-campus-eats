"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";

const ApproveSchema = z.object({
  name: z.string().trim().min(1, { error: "식당 이름을 입력해주세요." }).max(100),
  address: z.string().trim().min(1, { error: "주소를 입력해주세요." }).max(200),
  area: z.enum(CommercialArea),
  category: z.enum(FoodCategory),
  latitude: z.coerce.number({ error: "위도를 숫자로 입력해주세요." }),
  longitude: z.coerce.number({ error: "경도를 숫자로 입력해주세요." }),
  phone: z.string().trim(),
  kakaoPlaceId: z.string().trim(),
});

export type AdminRequestState = { error?: string } | undefined;

export async function approveRequest(
  requestId: string,
  _state: AdminRequestState,
  formData: FormData
): Promise<AdminRequestState> {
  await requireAdminSession();

  const parsed = ApproveSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    area: formData.get("area"),
    category: formData.get("category"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    phone: formData.get("phone"),
    kakaoPlaceId: formData.get("kakaoPlaceId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const request = await prisma.restaurantRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "PENDING") {
    return { error: "이미 처리된 요청이에요." };
  }

  const { name, address, area, category, latitude, longitude, phone, kakaoPlaceId } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name,
          address,
          latitude,
          longitude,
          phone: phone || null,
          area,
          category,
          kakaoPlaceId: kakaoPlaceId || null,
        },
      });
      await tx.restaurantRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED", restaurantId: restaurant.id },
      });
    });
  } catch {
    return { error: "이미 등록된 카카오 장소이거나 저장에 실패했어요." };
  }

  revalidatePath("/admin/requests");
  revalidatePath("/");
}

export async function rejectRequest(requestId: string) {
  await requireAdminSession();

  await prisma.restaurantRequest.updateMany({
    where: { id: requestId, status: "PENDING" },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/requests");
}

"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";

export async function approveEditRequest(editRequestId: string) {
  await requireAdminSession();

  const editRequest = await prisma.restaurantEditRequest.findUnique({ where: { id: editRequestId } });
  if (!editRequest || editRequest.status !== "PENDING") return;

  if (editRequest.type === "MENU_ADD" && editRequest.menuName && editRequest.menuPrice !== null) {
    await prisma.menu.create({
      data: {
        restaurantId: editRequest.restaurantId,
        name: editRequest.menuName,
        price: editRequest.menuPrice,
      },
    });
  } else if (editRequest.type === "MENU_PRICE_FIX" && editRequest.menuId && editRequest.menuPrice !== null) {
    await prisma.menu.update({
      where: { id: editRequest.menuId },
      data: { price: editRequest.menuPrice },
    });
  }
  // INFO_CORRECTION: no automatic mutation. Admin applies the fix separately via
  // the restaurant info editor, then approves here to close out the request.

  await prisma.restaurantEditRequest.update({
    where: { id: editRequestId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/edit-requests");
  revalidatePath(`/restaurants/${editRequest.restaurantId}`);
}

const RejectSchema = z.object({
  rejectionReason: z.string().trim().min(1, { error: "거절 사유를 입력해주세요." }).max(300),
});

export type RejectEditRequestState = { error?: string } | undefined;

export async function rejectEditRequest(
  editRequestId: string,
  _state: RejectEditRequestState,
  formData: FormData
): Promise<RejectEditRequestState> {
  await requireAdminSession();

  const parsed = RejectSchema.safeParse({ rejectionReason: formData.get("rejectionReason") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  await prisma.restaurantEditRequest.updateMany({
    where: { id: editRequestId, status: "PENDING" },
    data: { status: "REJECTED", rejectionReason: parsed.data.rejectionReason },
  });

  revalidatePath("/admin/edit-requests");
}

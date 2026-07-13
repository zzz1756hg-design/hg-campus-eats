"use server";

import { revalidatePath } from "next/cache";

import { Role } from "@/generated/prisma/enums";
import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";

export async function setUserRole(userId: string, role: Role) {
  const session = await requireAdminSession();

  if (session.user.id === userId) {
    throw new Error("본인 권한은 여기서 변경할 수 없어요.");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

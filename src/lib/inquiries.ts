import { prisma } from "@/lib/prisma";

export function getMyInquiries(userId: string) {
  return prisma.inquiry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getAllInquiries() {
  return prisma.inquiry.findMany({
    orderBy: [{ answeredAt: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }],
    include: { user: { select: { name: true, email: true } } },
  });
}

import { auth } from "@/auth";

export async function requireAdminSession() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("관리자만 접근할 수 있어요.");
  }
  return session;
}

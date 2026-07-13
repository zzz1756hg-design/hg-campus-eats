import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setUserRole } from "@/lib/actions/admin-users";
import { getAllUsers } from "@/lib/users";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const users = await getAllUsers();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">회원 관리</h1>
        <p className="text-sm text-muted-foreground">전체 {users.length}명</p>
      </div>

      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"
          >
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                {user.role === "ADMIN" ? "관리자" : "일반회원"}
              </Badge>
              {user.id !== session.user.id && (
                <form
                  action={setUserRole.bind(null, user.id, user.role === "ADMIN" ? "USER" : "ADMIN")}
                >
                  <Button type="submit" size="sm" variant="outline">
                    {user.role === "ADMIN" ? "관리자 해제" : "관리자로 지정"}
                  </Button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RestaurantRequestForm } from "@/components/restaurant-request-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewRestaurantRequestPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>식당 등록 요청</CardTitle>
          <CardDescription>목록에 없는 식당을 추가해달라고 요청해보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <RestaurantRequestForm />
        </CardContent>
      </Card>
    </main>
  );
}

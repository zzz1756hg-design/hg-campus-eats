import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { InquiryForm } from "@/components/inquiry-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewInquiryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>1:1 문의</CardTitle>
          <CardDescription>궁금한 점이나 불편한 점을 남겨주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <InquiryForm />
        </CardContent>
      </Card>
    </main>
  );
}

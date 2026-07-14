"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { requireAdminSession } from "@/lib/actions/admin-guard";
import { prisma } from "@/lib/prisma";
import { InquiryAnswerSchema, InquirySchema } from "@/lib/validations/inquiry";

export type InquiryState = { error?: string; success?: boolean } | undefined;

export async function submitInquiry(
  _state: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요해요." };

  const parsed = InquirySchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  await prisma.inquiry.create({
    data: { userId: session.user.id, title: parsed.data.title, content: parsed.data.content },
  });

  revalidatePath("/inquiries");
  return { success: true };
}

export type AnswerInquiryState = { error?: string } | undefined;

export async function answerInquiry(
  inquiryId: string,
  _state: AnswerInquiryState,
  formData: FormData
): Promise<AnswerInquiryState> {
  await requireAdminSession();

  const parsed = InquiryAnswerSchema.safeParse({ answer: formData.get("answer") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { answer: parsed.data.answer, answeredAt: new Date() },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/inquiries");
}

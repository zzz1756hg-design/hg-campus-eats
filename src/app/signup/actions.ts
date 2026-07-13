"use server";

import bcrypt from "bcryptjs";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignupSchema } from "@/lib/validations/auth";

export type SignupState = { error?: string } | undefined;

export async function signup(_state: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "이미 가입된 이메일이에요." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  await signIn("credentials", { email, password, redirectTo: "/" });
}

"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/validations/auth";

export type LoginState = { error?: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "이메일 또는 비밀번호가 올바르지 않아요." };
    }
    throw error;
  }
}

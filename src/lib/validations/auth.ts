import * as z from "zod";

export const SignupSchema = z.object({
  name: z.string().trim().min(1, { error: "이름을 입력해주세요." }),
  email: z.email({ error: "올바른 이메일을 입력해주세요." }).trim(),
  password: z
    .string()
    .min(8, { error: "비밀번호는 8자 이상이어야 해요." })
    .regex(/[a-zA-Z]/, { error: "영문자를 포함해주세요." })
    .regex(/[0-9]/, { error: "숫자를 포함해주세요." }),
});

export const LoginSchema = z.object({
  email: z.email({ error: "올바른 이메일을 입력해주세요." }).trim(),
  password: z.string().min(1, { error: "비밀번호를 입력해주세요." }),
});

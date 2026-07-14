import * as z from "zod";

export const InquirySchema = z.object({
  title: z.string().trim().min(1, { error: "제목을 입력해주세요." }).max(100),
  content: z.string().trim().min(1, { error: "내용을 입력해주세요." }).max(2000),
});

export const InquiryAnswerSchema = z.object({
  answer: z.string().trim().min(1, { error: "답변 내용을 입력해주세요." }).max(2000),
});

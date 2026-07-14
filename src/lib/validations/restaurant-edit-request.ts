import * as z from "zod";

export const InfoCorrectionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, { error: "수정이 필요한 내용을 입력해주세요." })
    .max(500, { error: "500자 이내로 입력해주세요." }),
});

export const MenuAddSchema = z.object({
  menuName: z.string().trim().min(1, { error: "메뉴 이름을 입력해주세요." }).max(50),
  menuPrice: z.coerce.number({ error: "가격을 숫자로 입력해주세요." }).int().min(0),
});

export const MenuPriceFixSchema = z.object({
  menuId: z.string().trim().min(1, { error: "가격을 수정할 메뉴를 선택해주세요." }),
  menuPrice: z.coerce.number({ error: "가격을 숫자로 입력해주세요." }).int().min(0),
});

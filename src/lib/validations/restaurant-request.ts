import * as z from "zod";

export const RestaurantRequestSchema = z.object({
  name: z.string().trim().min(1, { error: "식당 이름을 입력해주세요." }).max(100),
  address: z.string().trim().min(1, { error: "식당 위치를 입력해주세요." }).max(200),
  reason: z.string().trim().max(500, { error: "요청 사유는 500자 이내로 입력해주세요." }),
  menuName: z.string().trim().min(1, { error: "대표메뉴 이름을 입력해주세요." }).max(50),
  menuPrice: z.coerce.number({ error: "대표메뉴 가격을 숫자로 입력해주세요." }).int().min(0),
});

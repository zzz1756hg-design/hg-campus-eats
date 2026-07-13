import * as z from "zod";

export const RestaurantRequestSchema = z.object({
  name: z.string().trim().min(1, { error: "식당 이름을 입력해주세요." }).max(100),
  address: z.string().trim().max(200, { error: "주소는 200자 이내로 입력해주세요." }),
  reason: z.string().trim().max(500, { error: "요청 사유는 500자 이내로 입력해주세요." }),
});

import { setRestaurantPartnership } from "@/lib/actions/admin-restaurants";
import { Button } from "@/components/ui/button";

export function AdminPartnershipToggle({
  restaurantId,
  isPartnered,
}: {
  restaurantId: string;
  isPartnered: boolean;
}) {
  return (
    <form action={setRestaurantPartnership.bind(null, restaurantId, !isPartnered)}>
      <Button type="submit" size="sm" variant={isPartnered ? "outline" : "default"}>
        {isPartnered ? "제휴 해제" : "제휴 식당으로 지정"}
      </Button>
    </form>
  );
}

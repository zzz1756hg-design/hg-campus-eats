const STARS = [5, 4, 3, 2, 1] as const;

export function ReviewRatingBreakdown({ reviews }: { reviews: { rating: number }[] }) {
  const total = reviews.length;
  const counts = STARS.map((star) => reviews.filter((review) => review.rating === star).length);

  return (
    <div className="flex flex-col gap-1.5">
      {STARS.map((star, index) => {
        const count = counts[index];
        const percent = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-6 shrink-0">{star}점</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-point" style={{ width: `${percent}%` }} />
            </div>
            <span className="w-4 shrink-0 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

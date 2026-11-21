import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { StarIcon } from "./icons";

const STAR = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

export type RatingProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  value: number;
  max?: number;
  /** Number of reviews, shown as "(128)". */
  count?: number;
  /** Show the number next to the stars (so the rating isn't shown by color alone). Default true. */
  showValue?: boolean;
  size?: keyof typeof STAR;
};

/** Read-only star rating, supports fractions (4.3 fills 4.3 stars). */
export function Rating({ value, max = 5, count, showValue = true, size = "md", className, ...props }: RatingProps) {
  const percent = Math.max(0, Math.min(1, value / max)) * 100;
  const stars = Array.from({ length: max }, (_, i) => (
    <StarIcon key={i} fill="currentColor" stroke="none" className={STAR[size]} />
  ));

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-small", className)} {...props}>
      <span role="img" aria-label={`${value} out of ${max} stars`} className="relative inline-flex">
        <span className="flex text-muted-foreground/40">{stars}</span>
        <span className="absolute inset-y-0 start-0 flex overflow-hidden text-rating" style={{ width: `${percent}%` }}>
          {stars}
        </span>
      </span>
      {showValue && <span className="font-medium tabular-nums">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-muted-foreground tabular-nums">({count})</span>}
    </span>
  );
}

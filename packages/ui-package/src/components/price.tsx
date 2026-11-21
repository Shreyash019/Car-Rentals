import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { formatPrice, type PriceFormatOptions } from "../lib/format";
import { Badge } from "./badge";

const SIZE = { sm: "text-body", md: "text-h4", lg: "text-h3" } as const;

export type PriceProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  PriceFormatOptions & {
    amount: number;
    /** Price before discount. Shown struck through when higher than amount. */
    originalAmount?: number;
    /** e.g. "/day". */
    period?: string;
    /** Adds a "−20%" badge when discounted. */
    showDiscount?: boolean;
    size?: keyof typeof SIZE;
  };

export function Price({
  amount,
  originalAmount,
  period,
  showDiscount = false,
  size = "md",
  currency,
  locale,
  decimals,
  className,
  ...props
}: PriceProps) {
  const fmt = { currency, locale, decimals };
  const discount = originalAmount && originalAmount > amount ? Math.round((1 - amount / originalAmount) * 100) : 0;

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)} {...props}>
      <span className={cn("font-display font-semibold tabular-nums", SIZE[size])}>{formatPrice(amount, fmt)}</span>
      {period && <span className="text-small text-muted-foreground">{period}</span>}
      {discount > 0 && (
        <>
          <s className="text-small text-muted-foreground tabular-nums">
            <span className="sr-only">Original price </span>
            {formatPrice(originalAmount!, fmt)}
          </s>
          {showDiscount && <Badge tone="highlight">−{discount}%</Badge>}
        </>
      )}
    </span>
  );
}

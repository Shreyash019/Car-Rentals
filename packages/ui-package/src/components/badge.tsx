import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-medium whitespace-nowrap",
  {
    variants: {
    tone: {
      neutral: "tone-muted",
      primary: "tone-primary-subtle",
      success: "tone-success-subtle",
      warning: "tone-warning-subtle",
      danger: "tone-danger-subtle",
      highlight: "tone-highlight-subtle",
      info: "tone-info-subtle",
      callout: "tone-callout-subtle",
      rating: "tone-rating",
    },

    },
    defaultVariants: { tone: "neutral" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

/** Small status pill, e.g. <Badge tone="success">Active</Badge> */
export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

const cardVariants = cva(
  "relative flex min-w-0 flex-col gap-4 rounded-card p-(--card-p) text-surface-foreground",
  {
    variants: {
      variant: {
        elevated: "border border-border bg-surface shadow-card",
        outline: "border border-border bg-surface",
        filled: "bg-muted",
        ghost: "bg-transparent",
        glass: "fx-glass",
      },
      tone: {
        none: "",
        primary: "border-transparent bg-primary-subtle text-primary-subtle-foreground",
        success: "border-transparent bg-success-subtle text-success-subtle-foreground",
        warning: "border-transparent bg-warning-subtle text-warning-subtle-foreground",
        danger: "border-transparent bg-danger-subtle text-danger-subtle-foreground",
        highlight: "border-transparent bg-highlight-subtle text-highlight-subtle-foreground",
        info: "border-transparent bg-info-subtle text-info-subtle-foreground",
        callout: "border-transparent bg-callout-subtle text-callout-subtle-foreground",
      },
      // --card-p is also used by CardMedia to bleed to the edges
      padding: {
        none: "[--card-p:0px]",
        sm: "[--card-p:0.75rem]",
        md: "[--card-p:var(--spacing-gutter)]",
        lg: "[--card-p:2.5rem]",
      },
      interactive: {
        true: "fx-lift cursor-pointer focus-within:focus-halo",
      },
    },
    defaultVariants: { variant: "elevated", tone: "none", padding: "md" },
  },
);

type CardElement = "div" | "article" | "section" | "li" | "aside";

export type CardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & {
    /** HTML element to render. Default "div". */
    as?: CardElement;
  };

/**
 * Whole card clickable: set `interactive` and put a link in the title with
 * className="after:absolute after:inset-0" (keeps one real link for screen readers).
 */
export function Card({ as: Tag = "div", className, variant, tone, padding, interactive, ...props }: CardProps) {
  return <Tag className={cn(cardVariants({ variant, tone, padding, interactive }), className)} {...props} />;
}

/** Image/video at the top that reaches the card edges. Use as the first child. */
export function CardMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "-mx-(--card-p) overflow-hidden first:-mt-(--card-p) first:rounded-t-[calc(var(--radius-card)-1px)]",
        "[&>img]:w-full [&>img]:object-cover",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  action,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { action?: ReactNode }) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)} {...props}>
      <div className="grid min-w-0 gap-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({
  as: Tag = "h3",
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" | "p" }) {
  return <Tag className={cn("font-display text-h4", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-small text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0", className)} {...props} />;
}

const JUSTIFY = { start: "justify-start", end: "justify-end", between: "justify-between" } as const;

export function CardFooter({
  justify = "start",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { justify?: keyof typeof JUSTIFY }) {
  // mt-auto: footers line up at the bottom when cards in a grid have different heights
  return <div className={cn("mt-auto flex flex-wrap items-center gap-3", JUSTIFY[justify], className)} {...props} />;
}

export { cardVariants };

import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-card border border-border bg-surface p-gutter text-surface-foreground shadow-card",
        className,
      )}
      {...props}
    />
  );
}

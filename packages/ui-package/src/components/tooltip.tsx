"use client";

import type { ReactNode } from "react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger,
  type TooltipProps as AriaTooltipProps,
} from "react-aria-components";
import { cn } from "../lib/cn";

export type TooltipProps = {
  content: ReactNode;
  /** Element that shows the tooltip on hover/focus. Must be a <TriggerButton>. */
  children: ReactNode;
  placement?: AriaTooltipProps["placement"];
  /** ms before showing. Default 500. */
  delay?: number;
  closeDelay?: number;
  isDisabled?: boolean;
  className?: string;
};

/** Short hint on hover/focus. Never put essential info here: touch screens don't show it. */
export function Tooltip({ content, children, placement = "top", delay = 500, closeDelay, isDisabled, className }: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} closeDelay={closeDelay} isDisabled={isDisabled}>
      {children}
      <AriaTooltip
        placement={placement}
        offset={6}
        className={cn(
          "z-50 max-w-xs rounded-control bg-foreground px-2.5 py-1.5 text-caption text-background shadow-overlay overlay-fade",
          className,
        )}
      >
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}

"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import { cn } from "../lib/cn";

export type PopoverProps = {
  /** Opens the popover. Must be a <TriggerButton>. */
  trigger: ReactNode;
  children: ReactNode | ((opts: { close: () => void }) => ReactNode);
  /** e.g. "bottom start", "top", "right". Default "bottom start". */
  placement?: AriaPopoverProps["placement"];
  offset?: number;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Screen-reader name, needed when the content has no heading. */
  label?: string;
  className?: string;
  classNames?: Partial<Record<"popover" | "content", string>>;
};

/** Floating panel next to a button (filters, quick forms). Esc / click outside closes it. */
export function Popover({
  trigger,
  children,
  placement = "bottom start",
  offset = 8,
  isOpen,
  defaultOpen,
  onOpenChange,
  label,
  className,
  classNames = {},
}: PopoverProps) {
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger}
      <AriaPopover
        placement={placement}
        offset={offset}
        className={cn("overlay-panel overlay-pop z-50", className, classNames.popover)}
      >
        <Dialog aria-label={label} className={cn("p-4 outline-none", classNames.content)}>
          {children}
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}

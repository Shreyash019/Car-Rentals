"use client";

import type { VariantProps } from "class-variance-authority";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button";

export type TriggerButtonProps = Omit<AriaButtonProps, "className"> &
  VariantProps<typeof buttonVariants> & { className?: string };

/**
 * Looks exactly like <Button>, but can open React Aria overlays
 * (Popover, Dialog, Drawer, DropdownMenu, Tooltip). Use onPress instead of onClick.
 */
export function TriggerButton({ variant, size, fullWidth, className, ...props }: TriggerButtonProps) {
  return <AriaButton className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />;
}

"use client";

import type { ReactNode } from "react";
import {
  Header,
  Menu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger,
  Popover,
  Separator,
  type Key,
  type MenuItemProps as AriaMenuItemProps,
  type PopoverProps,
} from "react-aria-components";
import { cn } from "../lib/cn";

export type DropdownMenuProps = {
  /** Opens the menu. Must be a <TriggerButton>. */
  trigger: ReactNode;
  /** <MenuItem>, <MenuSeparator>, <MenuSection>. */
  children: ReactNode;
  /** Called with the chosen item's id (instead of onAction on each item). */
  onAction?: (id: Key) => void;
  placement?: PopoverProps["placement"];
  /** Screen-reader name of the menu, e.g. "Actions for Ravi Motors". */
  label?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
};

/** Action menu with full keyboard support (arrows, Home/End, type to jump). */
export function DropdownMenu({
  trigger,
  children,
  onAction,
  placement = "bottom end",
  label,
  isOpen,
  onOpenChange,
  className,
}: DropdownMenuProps) {
  return (
    <MenuTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger}
      <Popover placement={placement} offset={6} className="overlay-panel overlay-pop z-50 min-w-48">
        <Menu aria-label={label} onAction={onAction} className={cn("max-h-80 overflow-y-auto p-1 outline-none", className)}>
          {children}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export type MenuItemProps = Omit<AriaMenuItemProps, "className" | "children"> & {
  children: ReactNode;
  icon?: ReactNode;
  /** Keyboard hint shown on the right, e.g. "⌘E". */
  shortcut?: string;
  tone?: "default" | "danger";
  className?: string;
};

export function MenuItem({ children, icon, shortcut, tone = "default", textValue, className, ...props }: MenuItemProps) {
  return (
    <AriaMenuItem
      {...props}
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cn("overlay-item", tone === "danger" && "overlay-item-danger", className)}
    >
      {icon && <span className="shrink-0 opacity-80">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut && <kbd className="font-sans text-caption text-muted-foreground">{shortcut}</kbd>}
    </AriaMenuItem>
  );
}

export function MenuSeparator() {
  return <Separator className="my-1 h-px bg-border" />;
}

export function MenuSection({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <AriaMenuSection>
      {title && <Header className="px-3 py-1.5 text-caption font-medium text-muted-foreground">{title}</Header>}
      {children}
    </AriaMenuSection>
  );
}

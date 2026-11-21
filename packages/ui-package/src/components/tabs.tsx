"use client";

import { cva } from "class-variance-authority";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type TabItem = { value: string; label: ReactNode; content: ReactNode; disabled?: boolean };

const LIST = {
  underline: "flex gap-1 border-b border-border",
  pills: "inline-flex gap-1 rounded-control bg-muted p-1",
} as const;

const tabVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-small font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        underline: "-mb-px border-b-2 border-transparent px-3 py-2 aria-selected:border-primary aria-selected:text-foreground",
        pills: "rounded-[calc(var(--radius-control)-2px)] px-3 py-1.5 aria-selected:bg-surface aria-selected:text-foreground aria-selected:shadow-card",
      },
    },
    defaultVariants: { variant: "underline" },
  },
);

export type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: keyof typeof LIST;
  /** Tabs share the full width equally. */
  fullWidth?: boolean;
  /** Keep hidden panels in the page (e.g. form fields inside tabs still submit). */
  keepMounted?: boolean;
  /** Screen-reader name for the tab list. */
  label?: string;
  className?: string;
  classNames?: Partial<Record<"root" | "list" | "tab" | "panel", string>>;
};

/** Accessible tabs: arrow keys, Home and End move between tabs. */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  fullWidth = false,
  keepMounted = false,
  label,
  className,
  classNames = {},
}: TabsProps) {
  const baseId = useId();
  const firstEnabled = items.find((i) => !i.disabled)?.value;
  const [inner, setInner] = useState(defaultValue ?? firstEnabled);
  const current = value ?? inner;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(next: string) {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const enabled = items.filter((i) => !i.disabled);
    const index = enabled.findIndex((i) => i.value === current);
    let next: TabItem | undefined;
    if (e.key === "ArrowRight") next = enabled[(index + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next.value);
    tabRefs.current[next.value]?.focus();
  }

  return (
    <div className={cn("min-w-0", className, classNames.root)}>
      <div
        role="tablist"
        aria-label={label}
        className={cn(LIST[variant], fullWidth && "flex w-full *:flex-1", "max-w-full overflow-x-auto", classNames.list)}
      >
        {items.map((item, i) => {
          const selected = item.value === current;
          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current[item.value] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-controls={`${baseId}-panel-${i}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.value)}
              onKeyDown={handleKeyDown}
              className={cn(tabVariants({ variant }), classNames.tab)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, i) => {
        const selected = item.value === current;
        if (!selected && !keepMounted) return null;
        return (
          <div
            key={item.value}
            role="tabpanel"
            id={`${baseId}-panel-${i}`}
            aria-labelledby={`${baseId}-tab-${i}`}
            hidden={!selected}
            tabIndex={0}
            className={cn("pt-4 focus-visible:outline-none", classNames.panel)}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}

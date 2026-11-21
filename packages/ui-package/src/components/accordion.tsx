import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { ChevronDownIcon } from "./icons";

export type AccordionItem = { id?: string; title: ReactNode; content: ReactNode; defaultOpen?: boolean };

export type AccordionProps = {
  items: AccordionItem[];
  /** "single" = opening one closes the others. */
  type?: "multiple" | "single";
  variant?: "divided" | "separated";
  className?: string;
  classNames?: Partial<Record<"root" | "item" | "trigger" | "icon" | "content", string>>;
};

export function Accordion({ items, type = "multiple", variant = "divided", className, classNames = {} }: AccordionProps) {
  const groupName = useId();

  return (
    <div
      className={cn(
        variant === "divided" ? "divide-y divide-border overflow-hidden rounded-card border border-border" : "flex flex-col gap-3",
        className,
        classNames.root,
      )}
    >
      {items.map((item, i) => (
        <details
          key={item.id ?? i}
          name={type === "single" ? groupName : undefined}
          open={item.defaultOpen}
          className={cn("group", variant === "separated" && "rounded-card border border-border bg-surface", classNames.item)}
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-medium hover:bg-table-hover [&::-webkit-details-marker]:hidden",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              classNames.trigger,
            )}
          >
            <span>{item.title}</span>
            <ChevronDownIcon
              className={cn("text-muted-foreground transition-transform duration-200 group-open:rotate-180", classNames.icon)}
            />
          </summary>
          <div className={cn("px-4 pb-4 text-muted-foreground", classNames.content)}>{item.content}</div>
        </details>
      ))}
    </div>
  );
}

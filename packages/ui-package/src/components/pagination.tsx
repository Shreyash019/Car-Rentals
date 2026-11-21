import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

type PageItem = number | "gap";

/** 1 … 4 5 6 … 20 — always the same number of slots, so buttons don't jump around. */
function pageItems(page: number, count: number, siblings: number): PageItem[] {
  if (count <= siblings * 2 + 5) return Array.from({ length: count }, (_, i) => i + 1);
  const start = Math.max(Math.min(page - siblings, count - siblings * 2 - 2), 3);
  const end = Math.min(Math.max(page + siblings, siblings * 2 + 3), count - 2);
  const items: PageItem[] = [1, start > 3 ? "gap" : 2];
  for (let p = start; p <= end; p++) items.push(p);
  items.push(end < count - 2 ? "gap" : count - 1, count);
  return items;
}

export type PaginationProps = {
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  /** Link mode (best for Next.js): page => URL. Works in server components. */
  getHref?: (page: number) => string;
  /** Button mode: called with the new page. */
  onPageChange?: (page: number) => void;
  /** Link component for link mode, e.g. next/link's Link. Default <a>. */
  linkComponent?: ElementType;
  /** Pages shown on each side of the current one. Default 1. */
  siblings?: number;
  /** With pageSize, shows "Showing 11–20 of 57". */
  total?: number;
  pageSize?: number;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
};

export function Pagination({
  page,
  pageCount,
  getHref,
  onPageChange,
  linkComponent: LinkComponent = "a",
  siblings = 1,
  total,
  pageSize,
  previousLabel = "Previous page",
  nextLabel = "Next page",
  className,
}: PaginationProps) {
  if (pageCount <= 1 && total === undefined) return null;

  function control(target: number, content: ReactNode, opts: { label?: string; active?: boolean; disabled?: boolean } = {}) {
    const cls = cn(
      buttonVariants({ variant: opts.active ? "primary" : "ghost", size: "sm" }),
      "min-w-8 px-2",
      !opts.active && "text-foreground",
    );
    if (opts.disabled) {
      return (
        <span aria-disabled="true" aria-label={opts.label} className={cn(cls, "pointer-events-none opacity-50")}>
          {content}
        </span>
      );
    }
    const shared = { "aria-label": opts.label, "aria-current": opts.active ? ("page" as const) : undefined, className: cls };
    if (getHref) {
      return (
        <LinkComponent href={getHref(target)} {...shared}>
          {content}
        </LinkComponent>
      );
    }
    return (
      <button type="button" onClick={() => onPageChange?.(target)} {...shared}>
        {content}
      </button>
    );
  }

  const from = total !== undefined && pageSize ? Math.min((page - 1) * pageSize + 1, total) : undefined;
  const to = total !== undefined && pageSize ? Math.min(page * pageSize, total) : undefined;

  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      {from !== undefined && (
        <p className="text-small text-muted-foreground">
          Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span>
        </p>
      )}
      {pageCount > 1 && (
        <ul className="flex flex-wrap items-center gap-1">
          <li>{control(page - 1, <ChevronLeftIcon />, { label: previousLabel, disabled: page <= 1 })}</li>
          {pageItems(page, pageCount, siblings).map((item, i) =>
            item === "gap" ? (
              <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted-foreground">
                …
              </li>
            ) : (
              <li key={item}>{control(item, item, { label: `Page ${item}`, active: item === page })}</li>
            ),
          )}
          <li>{control(page + 1, <ChevronRightIcon />, { label: nextLabel, disabled: page >= pageCount })}</li>
        </ul>
      )}
    </nav>
  );
}

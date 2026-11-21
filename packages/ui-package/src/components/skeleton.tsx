import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/** Grey pulsing placeholder. Size it with classes: <Skeleton className="h-6 w-40" /> */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("skeleton h-4 w-full", className)} {...props} />;
}

// Keep in sync with ROW_PADDING in data-table.tsx so nothing jumps when data arrives.
const ROW_PADDING = { sm: "py-2", md: "py-3", lg: "py-4" } as const;
const BAR_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6"];

export type TableSkeletonProps = {
  /** Same widths you give DataTable columns, e.g. ["30%", "35%", "15%", "20%"]. */
  columnWidths: string[];
  rows?: number;
  rowHeight?: keyof typeof ROW_PADDING;
  /** Screen-reader text. */
  label?: string;
  className?: string;
};

/** Loading placeholder shaped like <DataTable>. Use it as a Suspense fallback. */
export function TableSkeleton({
  columnWidths,
  rows = 5,
  rowHeight = "md",
  label = "Loading…",
  className,
}: TableSkeletonProps) {
  return (
    <div role="status" className={cn("w-full overflow-hidden rounded-card border border-table-border", className)}>
      <span className="sr-only">{label}</span>
      <table aria-hidden="true" className="w-full table-fixed border-collapse">
        <colgroup>
          {columnWidths.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead className="bg-table-header">
          <tr className="border-b border-table-border">
            {columnWidths.map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="flex h-5 items-center">
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r} className="border-b border-table-border last:border-0">
              {columnWidths.map((_, c) => (
                <td key={c} className={cn("px-4", ROW_PADDING[rowHeight])}>
                  <div className="flex h-5 items-center">
                    <Skeleton className={cn("h-3", BAR_WIDTHS[(r + c) % BAR_WIDTHS.length])} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

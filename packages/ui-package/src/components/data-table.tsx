"use client";

import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cn } from "../lib/cn";

const ROW_PADDING = { sm: "py-2", md: "py-3", lg: "py-4" } as const;
const ALIGN = { left: "text-left", center: "text-center", right: "text-right" } as const;

/** Clicks on these elements (or inside them) never trigger the row click. */
const IGNORE_ROW_CLICK =
  "a,button,input,select,textarea,label,[role='button'],[data-row-click-ignore]";

type ClickEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export type DataTableClassNames = Partial<
  Record<
    | "root"
    | "table"
    | "thead"
    | "headerRow"
    | "th"
    | "tbody"
    | "row"
    | "td"
    | "cellButton"
    | "empty",
    string
  >
>;

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  /** Simple field display. Use `cell` for custom rendering. */
  accessor?: keyof T;
  /** Custom cell renderer. Takes priority over `accessor`. */
  cell?: (row: T) => ReactNode;
  /** e.g. "30%". Use the same values as TableSkeleton's columnWidths to avoid layout shift. */
  width?: string;
  /** Text alignment for header and cells. Default "left". */
  align?: keyof typeof ALIGN;
  /** Makes this column's cells clickable (rendered as buttons). */
  onCellClick?: (row: T, event: ClickEvent) => void;
  /** Accessible name for the clickable cell, e.g. row => `Email ${row.name}`. */
  cellLabel?: (row: T) => string;
  /** Extra classes for this column's body cells. */
  className?: string;
  /** Extra classes for this column's header cell. */
  headerClassName?: string;
};

export type DataTableProps<T> = {
  /** Rows to render. */
  data: T[];
  /** Column definitions. */
  columns: DataTableColumn<T>[];
  /** Stable unique id per row (used as React key). */
  getRowId: (row: T) => string;
  /** Makes whole rows clickable (mouse + Enter/Space). */
  onRowClick?: (row: T, event: ClickEvent) => void;
  /** Accessible name for a clickable row, e.g. row => `Open ${row.name}`. */
  rowLabel?: (row: T) => string;
  /** Row density. Default "md". */
  rowHeight?: keyof typeof ROW_PADDING;
  /** Shown when `data` is empty. */
  emptyMessage?: ReactNode;
  /** Screen-reader caption describing the table. */
  caption?: string;
  /** Visual preset. Default "default". */
  variant?: "default" | "striped" | "bordered";
  /** Keep the header visible while the body scrolls. */
  stickyHeader?: boolean;
  /** Extra classes for the outer wrapper (same as classNames.root). */
  className?: string;
  /** Per-part class overrides for this table. */
  classNames?: DataTableClassNames;
  /** Conditional row styling, e.g. row => row.status === "pending" && "bg-amber-50". */
  rowClassName?: (row: T) => string | false | null | undefined;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function DataTable<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  rowLabel,
  rowHeight = "md",
  emptyMessage = "No records found",
  caption,
  variant = "default",
  stickyHeader = false,
  className,
  classNames = {},
  rowClassName,
}: DataTableProps<T>) {
  const rowClickable = Boolean(onRowClick);
  const hasWidths = columns.some((col) => col.width);
  const bordered = variant === "bordered";

  function handleRowClick(row: T, e: MouseEvent<HTMLTableRowElement>) {
    if (!onRowClick) return;
    // A button/link/input inside the row was clicked: let it handle itself.
    if ((e.target as HTMLElement).closest(IGNORE_ROW_CLICK)) return;
    // User was selecting text, not clicking.
    if (window.getSelection()?.toString()) return;
    onRowClick(row, e);
  }

  function handleRowKeyDown(row: T, e: KeyboardEvent<HTMLTableRowElement>) {
    if (!onRowClick) return;
    // Ignore keys pressed on inner buttons/inputs.
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(row, e);
    }
  }

  function renderContent(col: DataTableColumn<T>, row: T): ReactNode {
    if (col.cell) return col.cell(row);
    if (col.accessor !== undefined) {
      const value = row[col.accessor];
      return value === null || value === undefined ? "" : String(value);
    }
    return null;
  }

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-card border border-table-border",
        stickyHeader && "max-h-[70vh] overflow-y-auto",
        className,
        classNames.root,
      )}
    >
      <table className={cn("w-full table-fixed border-collapse", classNames.table)}>
        {caption && <caption className="sr-only">{caption}</caption>}

        {hasWidths && (
          <colgroup>
            {columns.map((col) => (
              <col key={col.id} style={{ width: col.width ?? "auto" }} />
            ))}
          </colgroup>
        )}

        <thead
          className={cn(
            "bg-table-header",
            stickyHeader && "sticky top-0 z-10 bg-background",
            classNames.thead,
          )}
        >
          <tr className={cn("border-b border-table-border", classNames.headerRow)}>
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={cn(
                  "px-4 py-3 text-sm font-medium",
                  ALIGN[col.align ?? "left"],
                  bordered && "border-r border-table-border last:border-r-0",
                  classNames.th,
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={classNames.tbody}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={cn("px-4 py-8 text-center text-sm opacity-70", classNames.empty)}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={rowClickable ? (e) => handleRowClick(row, e) : undefined}
                onKeyDown={rowClickable ? (e) => handleRowKeyDown(row, e) : undefined}
                tabIndex={rowClickable ? 0 : undefined}
                aria-label={rowClickable ? rowLabel?.(row) : undefined}
                className={cn(
                  "border-b border-table-border last:border-0",
                  variant === "striped" && "even:bg-table-stripe",
                  rowClickable &&
                    "cursor-pointer hover:bg-table-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500",
                  classNames.row,
                  rowClassName?.(row),
                )}
              >
                {columns.map((col) => {
                  const content = renderContent(col, row);
                  return (
                    <td
                      key={col.id}
                      className={cn(
                        "px-4 text-sm",
                        ROW_PADDING[rowHeight],
                        ALIGN[col.align ?? "left"],
                        bordered && "border-r border-table-border last:border-r-0",
                        classNames.td,
                        col.className,
                      )}
                    >
                      {col.onCellClick ? (
                        <button
                          type="button"
                          onClick={(e) => col.onCellClick!(row, e)}
                          aria-label={col.cellLabel?.(row)}
                          className={cn(
                            "rounded-sm text-left text-brand-600 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-brand-500",
                            classNames.cellButton,
                          )}
                        >
                          {content}
                        </button>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { ChevronRightIcon } from "./icons";

export type BreadcrumbItem = { label: ReactNode; href?: string };

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  items: BreadcrumbItem[];
  /** e.g. next/link's Link. Default <a>. */
  linkComponent?: ElementType;
  separator?: ReactNode;
};

/** The last item is the current page (not a link). */
export function Breadcrumbs({ items, linkComponent: LinkComponent = "a", separator, className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-small", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-1.5">
              {item.href && !last ? (
                <LinkComponent href={item.href} className="link">
                  {item.label}
                </LinkComponent>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "font-medium text-foreground")}>
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden="true">{separator ?? <ChevronRightIcon className="size-3.5" />}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

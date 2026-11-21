import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { InboxIcon } from "./icons";

const SIZES = {
  sm: { root: "gap-2 py-6", icon: "size-6", title: "text-body" },
  md: { root: "gap-3 py-12", icon: "size-8", title: "text-h4" },
} as const;

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Custom icon, or false for none. Default: inbox. */
  icon?: ReactNode | false;
  /** Buttons, e.g. <Button>Add a car</Button>. */
  action?: ReactNode;
  size?: keyof typeof SIZES;
  classNames?: Partial<Record<"root" | "icon" | "title" | "description" | "action", string>>;
};

/** "Nothing here yet" block for empty lists, searches with no results, etc. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  size = "md",
  className,
  classNames = {},
  ...props
}: EmptyStateProps) {
  const s = SIZES[size];
  return (
    <div className={cn("flex flex-col items-center text-center", s.root, className, classNames.root)} {...props}>
      {icon !== false && (
        <div className={cn("grid place-items-center rounded-full bg-muted p-3 text-muted-foreground", classNames.icon)}>
          {icon ?? <InboxIcon className={s.icon} />}
        </div>
      )}
      <p className={cn("font-display font-semibold", s.title, classNames.title)}>{title}</p>
      {description && (
        <p className={cn("max-w-md text-small text-muted-foreground", classNames.description)}>{description}</p>
      )}
      {action && <div className={cn("mt-2 flex flex-wrap justify-center gap-3", classNames.action)}>{action}</div>}
    </div>
  );
}

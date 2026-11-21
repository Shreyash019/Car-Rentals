import type { HTMLAttributes, ReactNode } from "react";
import { BRAND } from "../lib/brand";
import { cn } from "../lib/cn";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const HEADER_VARIANT = {
  plain: "border-b border-border bg-background",
  glass: "fx-glass border-0 border-b",
  strong: "tone-strong",
} as const;

export type AppHeaderProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  /** Left side. Default <Logo />. Wrap it in your router's <Link> to make it clickable. */
  brand?: ReactNode;
  /** Label after the brand, e.g. <Badge>Admin</Badge>. */
  badge?: ReactNode;
  /** Navigation links, rendered inside <nav>. */
  nav?: ReactNode;
  navLabel?: string;
  /** Right side. Default <ThemeToggle />. Pass null to hide. */
  actions?: ReactNode;
  variant?: keyof typeof HEADER_VARIANT;
  /** Stays at the top while scrolling. */
  sticky?: boolean;
  classNames?: Partial<Record<"root" | "inner" | "brand" | "nav" | "actions", string>>;
};

/** One header for every app/zone. */
export function AppHeader({
  brand,
  badge,
  nav,
  navLabel = "Main",
  actions,
  variant = "plain",
  sticky = false,
  className,
  classNames = {},
  ...props
}: AppHeaderProps) {
  return (
    <header
      className={cn(HEADER_VARIANT[variant], sticky && "sticky top-0 z-40", className, classNames.root)}
      {...props}
    >
      <div className={cn("page-container flex h-16 items-center justify-between gap-4", classNames.inner)}>
        <div className={cn("flex min-w-0 items-center gap-3", classNames.brand)}>
          {brand ?? <Logo />}
          {badge}
        </div>
        <div className={cn("flex items-center gap-4", classNames.actions)}>
          {nav && (
            <nav aria-label={navLabel} className={cn("flex items-center gap-4 text-small", classNames.nav)}>
              {nav}
            </nav>
          )}
          {actions === undefined ? <ThemeToggle /> : actions}
        </div>
      </div>
    </header>
  );
}

const FOOTER_VARIANT = {
  plain: "border-t border-border text-muted-foreground",
  muted: "tone-muted",
  deep: "tone-deep",
} as const;

export type AppFooterProps = HTMLAttributes<HTMLElement> & {
  /** Right side, e.g. links. */
  end?: ReactNode;
  variant?: keyof typeof FOOTER_VARIANT;
  classNames?: Partial<Record<"root" | "inner", string>>;
};

/** Footer. Default content: "© {BRAND.name}". */
export function AppFooter({ end, variant = "plain", className, classNames = {}, children, ...props }: AppFooterProps) {
  return (
    <footer className={cn(FOOTER_VARIANT[variant], className, classNames.root)} {...props}>
      <div className={cn("page-container flex flex-wrap items-center justify-between gap-4 py-8 text-small", classNames.inner)}>
        <div>{children ?? <>© {BRAND.name}</>}</div>
        {end}
      </div>
    </footer>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon, XIcon } from "./icons";

const alertVariants = cva("flex items-start gap-3 rounded-card border p-4 text-small", {
  variants: {
    tone: {
    neutral: "border-border tone-muted",
    info: "border-info/30 tone-info-subtle",
    success: "border-success/30 tone-success-subtle",
    warning: "border-warning/40 tone-warning-subtle",
    danger: "border-danger/30 tone-danger-subtle",
    highlight: "border-highlight/30 tone-highlight-subtle",
    },
  },
  defaultVariants: { tone: "info" },
});

const ICONS = {
  neutral: InfoIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: XCircleIcon,
  highlight: InfoIcon,
} as const;

export type AlertClassNames = Partial<Record<"root" | "icon" | "body" | "title" | "description" | "action" | "close", string>>;

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: ReactNode;
    /** Custom icon, or false for no icon. Default depends on tone. */
    icon?: ReactNode | false;
    /** Buttons/links under the text, e.g. <Button size="sm">Retry</Button>. */
    action?: ReactNode;
    /** Shows a close (×) button. */
    onDismiss?: () => void;
    dismissLabel?: string;
    classNames?: AlertClassNames;
  };

/** Inline message box. danger/warning are announced to screen readers immediately. */
export function Alert({
  tone,
  title,
  icon,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
  role,
  className,
  classNames = {},
  children,
  ...props
}: AlertProps) {
  const t = tone ?? "info";
  const Icon = ICONS[t];

  return (
    <div
      role={role ?? (t === "danger" || t === "warning" ? "alert" : "status")}
      className={cn(alertVariants({ tone }), className, classNames.root)}
      {...props}
    >
      {icon !== false && <span className={cn("mt-0.5 shrink-0", classNames.icon)}>{icon ?? <Icon className="size-5" />}</span>}
      <div className={cn("grid min-w-0 flex-1 gap-1", classNames.body)}>
        {title && <p className={cn("font-medium", classNames.title)}>{title}</p>}
        {children && <div className={classNames.description}>{children}</div>}
        {action && <div className={cn("mt-2 flex flex-wrap gap-2", classNames.action)}>{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={cn("-m-1 shrink-0 rounded-control p-1 opacity-70 hover:opacity-100", classNames.close)}
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}

export { alertVariants };

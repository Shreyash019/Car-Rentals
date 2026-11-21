import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/cn";

const SIZE = {
  sm: { track: "h-5 w-9", thumb: "size-4 peer-checked:translate-x-4" },
  md: { track: "h-6 w-11", thumb: "size-5 peer-checked:translate-x-5" },
} as const;

export type SwitchProps = Omit<ComponentProps<"input">, "type" | "size" | "role"> & {
  label?: ReactNode;
  description?: ReactNode;
  size?: keyof typeof SIZE;
  classNames?: Partial<Record<"root" | "input" | "track" | "thumb" | "label" | "description", string>>;
};

/** On/off toggle for settings that apply at once (e.g. "Car available"). A real checkbox underneath. */
export function Switch({
  label,
  description,
  size = "md",
  id,
  className,
  classNames = {},
  "aria-describedby": describedBy,
  ...props
}: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description ? `${inputId}-desc` : undefined;
  const s = SIZE[size];

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-start gap-3 text-small has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
        classNames.root,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          {...props}
          id={inputId}
          type="checkbox"
          role="switch"
          aria-describedby={[describedBy, descId].filter(Boolean).join(" ") || undefined}
          className={cn("peer absolute inset-0 m-0 size-full cursor-[inherit] opacity-0", classNames.input)}
        />
        <span
          aria-hidden="true"
          className={cn(
            "rounded-full bg-input transition-colors duration-200 peer-checked:bg-primary",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
            s.track,
            classNames.track,
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 rounded-full bg-primary-foreground shadow-card transition-transform duration-200 ease-standard",
            s.thumb,
            classNames.thumb,
          )}
        />
      </span>
      {(label || description) && (
        <span className="grid gap-0.5">
          {label && <span className={cn("font-medium", classNames.label)}>{label}</span>}
          {description && (
            <span id={descId} className={cn("text-caption text-muted-foreground", classNames.description)}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

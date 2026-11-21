import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { choiceInputClass, choiceVariants } from "../lib/control";
import { FieldError } from "./form-field";

export type CheckboxProps = Omit<ComponentProps<"input">, "type" | "size"> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** "card" = selectable tile. */
  variant?: "default" | "card";
  classNames?: Partial<Record<"root" | "option" | "input" | "label" | "description" | "error", string>>;
};

export function Checkbox({
  label,
  description,
  error,
  variant,
  id,
  className,
  classNames = {},
  "aria-describedby": describedBy,
  ...props
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description ? `${inputId}-desc` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("min-w-0", className, classNames.root)}>
      <label className={cn(choiceVariants({ variant }), classNames.option)}>
        <input
          {...props}
          type="checkbox"
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={[describedBy, descId, errorId].filter(Boolean).join(" ") || undefined}
          className={cn(choiceInputClass, classNames.input)}
        />
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
      {error && (
        <FieldError id={errorId} className={classNames.error}>
          {error}
        </FieldError>
      )}
    </div>
  );
}

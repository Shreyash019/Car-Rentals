import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { controlVariants, type ControlVariantProps } from "../lib/control";
import { FormField, useField, type FieldProps, type FieldSlotClassNames } from "./form-field";

const ICON_PAD = {
  sm: { start: "[--field-ps:2rem]", end: "[--field-pe:2rem]" },
  md: { start: "[--field-ps:2.5rem]", end: "[--field-pe:2.5rem]" },
  lg: { start: "[--field-ps:3rem]", end: "[--field-pe:3rem]" },
} as const;

/** Icons don't block clicks on the input, but buttons/links inside them still work. */
const SLOT =
  "pointer-events-none absolute inset-y-0 flex items-center text-muted-foreground [&_a]:pointer-events-auto [&_button]:pointer-events-auto";

export type InputClassNames = FieldSlotClassNames &
  Partial<Record<"control" | "wrapper" | "startIcon" | "endIcon", string>>;

export type InputProps = Omit<ComponentProps<"input">, "size"> &
  ControlVariantProps &
  FieldProps & {
    /** Icon or text inside the left edge, e.g. a search icon or "₹". */
    startIcon?: ReactNode;
    /** Icon or button inside the right edge, e.g. a show-password button. */
    endIcon?: ReactNode;
    classNames?: InputClassNames;
  };

export function Input({
  label,
  hint,
  error,
  required,
  variant,
  size,
  startIcon,
  endIcon,
  id,
  className,
  classNames = {},
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const field = useField({ id, hint, error, describedBy });
  const pad = ICON_PAD[size ?? "md"];

  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      controlId={field.controlId}
      hintId={field.hintId}
      errorId={field.errorId}
      className={className}
      classNames={classNames}
    >
      <div className={cn("relative", classNames.wrapper)}>
        {startIcon && <span className={cn(SLOT, "start-0 ps-3", classNames.startIcon)}>{startIcon}</span>}
        <input
          {...props}
          id={field.controlId}
          required={required}
          aria-invalid={field.invalid || undefined}
          aria-describedby={field.ariaDescribedBy}
          className={cn(
            controlVariants({ variant, size }),
            startIcon && pad.start,
            endIcon && pad.end,
            classNames.control,
          )}
        />
        {endIcon && <span className={cn(SLOT, "end-0 pe-3", classNames.endIcon)}>{endIcon}</span>}
      </div>
    </FormField>
  );
}

"use client";

import { useState, type ChangeEvent, type ComponentProps } from "react";
import { cn } from "../lib/cn";
import { controlVariants, type ControlVariantProps } from "../lib/control";
import { FormField, useField, type FieldProps, type FieldSlotClassNames } from "./form-field";

const RESIZE = { none: "resize-none", vertical: "resize-y", both: "resize" } as const;

export type TextareaClassNames = FieldSlotClassNames & Partial<Record<"control" | "counter", string>>;

export type TextareaProps = ComponentProps<"textarea"> &
  ControlVariantProps &
  FieldProps & {
    /** Grow with the text (up to max-h-80). Browsers without support keep `rows`. */
    autoResize?: boolean;
    /** Drag handle. Default "vertical". Ignored with autoResize. */
    resize?: keyof typeof RESIZE;
    /** Show "12 / 200" under the box. Needs maxLength. */
    showCount?: boolean;
    classNames?: TextareaClassNames;
  };

export function Textarea({
  label,
  hint,
  error,
  required,
  variant,
  size,
  autoResize = false,
  resize = "vertical",
  showCount = false,
  rows = 3,
  id,
  className,
  classNames = {},
  onChange,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const field = useField({ id, hint, error, describedBy });
  const [typed, setTyped] = useState(() => String(props.defaultValue ?? "").length);
  const length = props.value !== undefined ? String(props.value).length : typed;

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setTyped(e.target.value.length);
    onChange?.(e);
  }

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
      <textarea
        {...props}
        id={field.controlId}
        rows={rows}
        required={required}
        onChange={handleChange}
        aria-invalid={field.invalid || undefined}
        aria-describedby={field.ariaDescribedBy}
        className={cn(
          controlVariants({ variant, size }),
          "[--field-h:5rem]",
          autoResize ? "field-sizing-content max-h-80 resize-none" : RESIZE[resize],
          classNames.control,
        )}
      />
      {showCount && props.maxLength !== undefined && (
        <p
          className={cn(
            "mt-1 text-end text-caption tabular-nums text-muted-foreground",
            length >= props.maxLength && "text-danger-subtle-foreground",
            classNames.counter,
          )}
        >
          {length} / {props.maxLength}
        </p>
      )}
    </FormField>
  );
}

import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { controlVariants, type ControlVariantProps } from "../lib/control";
import { FormField, useField, type FieldProps, type FieldSlotClassNames } from "./form-field";
import { ChevronDownIcon } from "./icons";



export type SelectOption = { value: string | number; label: string; disabled?: boolean };
export type SelectOptionGroup = { label: string; options: SelectOption[] };

export type SelectClassNames = FieldSlotClassNames & Partial<Record<"control" | "wrapper" | "icon", string>>;

export type SelectProps = Omit<ComponentProps<"select">, "size"> &
  ControlVariantProps &
  FieldProps & {
    /** Options or groups. You can also pass <option> children instead. */
    options?: (SelectOption | SelectOptionGroup)[];
    /** First, empty option, e.g. "Choose a city". With `required` it must be changed. */
    placeholder?: string;
    /** Replace the chevron icon. */
    icon?: ReactNode;
    classNames?: SelectClassNames;
  };

function isGroup(o: SelectOption | SelectOptionGroup): o is SelectOptionGroup {
  return "options" in o;
}

function renderOption(o: SelectOption) {
  return (
    <option key={o.value} value={o.value} disabled={o.disabled}>
      {o.label}
    </option>
  );
}

export function Select({
  label,
  hint,
  error,
  required,
  variant,
  size,
  options,
  placeholder,
  icon,
  multiple,
  children,
  id,
  className,
  classNames = {},
  "aria-describedby": describedBy,
  ...props
}: SelectProps) {
  const field = useField({ id, hint, error, describedBy });

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
        <select
          {...props}
          id={field.controlId}
          multiple={multiple}
          required={required}
          aria-invalid={field.invalid || undefined}
          aria-describedby={field.ariaDescribedBy}
          className={cn(
            controlVariants({ variant, size }),
            !multiple && "appearance-none [--field-pe:2.5rem]",
            // grey text while the placeholder is selected
            "[&:has(option[value='']:checked)]:text-muted-foreground [&_option]:text-foreground",
            classNames.control,
          )}
        >
          {placeholder !== undefined && !multiple && <option value="">{placeholder}</option>}
          {options?.map((o) =>
            isGroup(o) ? (
              <optgroup key={o.label} label={o.label}>
                {o.options.map(renderOption)}
              </optgroup>
            ) : (
              renderOption(o)
            ),
          )}
          {children}
        </select>
        {!multiple && (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground",
              classNames.icon,
            )}
          >
            {icon ?? <ChevronDownIcon />}
          </span>
        )}
      </div>
    </FormField>
  );
}

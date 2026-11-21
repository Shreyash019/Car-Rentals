import type { ChangeEvent, ReactNode } from "react";
import { cn } from "../lib/cn";
import { choiceInputClass, choiceLayout, choiceVariants } from "../lib/control";
import { FieldError, FieldHint, useField, type FieldProps } from "./form-field";

export type CheckboxOption = { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean };

export type CheckboxGroupClassNames = Partial<
  Record<"root" | "legend" | "options" | "option" | "input" | "label" | "description" | "hint" | "error", string>
>;

export type CheckboxGroupProps = Omit<FieldProps, "required"> & {
  /** Every checked box submits `name=value`, so forms get all selected values. */
  name: string;
  options: CheckboxOption[];
  /** Controlled selection (use with onValueChange). */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[], event: ChangeEvent<HTMLInputElement>) => void;
  /** Shows a * on the legend. "At least one" must be checked in your own validation. */
  required?: boolean;
  variant?: "default" | "card";
  orientation?: keyof typeof choiceLayout;
  disabled?: boolean;
  id?: string;
  className?: string;
  classNames?: CheckboxGroupClassNames;
  renderOption?: (option: CheckboxOption) => ReactNode;
};

export function CheckboxGroup({
  name,
  options,
  value,
  defaultValue = [],
  onValueChange,
  label,
  hint,
  error,
  required,
  variant,
  orientation = "vertical",
  disabled,
  id,
  className,
  classNames = {},
  renderOption,
}: CheckboxGroupProps) {
  const field = useField({ id, hint, error });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!onValueChange) return;
    const v = e.target.value;
    if (value) {
      onValueChange(e.target.checked ? [...value, v] : value.filter((x) => x !== v), e);
      return;
    }
    const group = e.currentTarget.closest("fieldset");
    const checked = group
      ? Array.from(group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')).map((i) => i.value)
      : [];
    onValueChange(checked, e);
  }

  return (
    <fieldset
      id={field.controlId}
      disabled={disabled}
      aria-describedby={field.ariaDescribedBy}
      className={cn("min-w-0", className, classNames.root)}
    >
      {label && (
        <legend className={cn("mb-2 text-small font-medium", classNames.legend)}>
          {label}
          {required && (
            <span aria-hidden="true" className="ms-0.5 text-danger-subtle-foreground">
              *
            </span>
          )}
        </legend>
      )}

      <div className={cn(choiceLayout[orientation], classNames.options)}>
        {options.map((opt, i) => {
          const optionId = `${field.controlId}-${i}`;
          const descId = opt.description ? `${optionId}-desc` : undefined;
          return (
            <label key={opt.value} className={cn(choiceVariants({ variant }), classNames.option)}>
              <input
                type="checkbox"
                id={optionId}
                name={name}
                value={opt.value}
                disabled={opt.disabled}
                aria-invalid={field.invalid || undefined}
                aria-describedby={descId}
                {...(value ? { checked: value.includes(opt.value) } : { defaultChecked: defaultValue.includes(opt.value) })}
                onChange={value || onValueChange ? handleChange : undefined}
                className={cn(choiceInputClass, classNames.input)}
              />
              {renderOption ? (
                renderOption(opt)
              ) : (
                <span className="grid gap-0.5">
                  <span className={cn("font-medium", classNames.label)}>{opt.label}</span>
                  {opt.description && (
                    <span id={descId} className={cn("text-caption text-muted-foreground", classNames.description)}>
                      {opt.description}
                    </span>
                  )}
                </span>
              )}
            </label>
          );
        })}
      </div>

      {error ? (
        <FieldError id={field.errorId} className={classNames.error}>
          {error}
        </FieldError>
      ) : hint ? (
        <FieldHint id={field.hintId} className={classNames.hint}>
          {hint}
        </FieldHint>
      ) : null}
    </fieldset>
  );
}

import type { ChangeEvent, ReactNode } from "react";
import { cn } from "../lib/cn";
import { choiceInputClass, choiceLayout, choiceVariants } from "../lib/control";
import { FieldError, FieldHint, useField, type FieldProps } from "./form-field";

export type RadioOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupClassNames = Partial<
  Record<"root" | "legend" | "options" | "option" | "input" | "label" | "description" | "hint" | "error", string>
>;

export type RadioGroupProps = FieldProps & {
  name: string;
  options: RadioOption[];
  /** Controlled value (use with onValueChange). */
  value?: string;
  /** Uncontrolled starting value. */
  defaultValue?: string;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** "card" = selectable tiles. Default "default". */
  variant?: "default" | "card";
  /** Default "vertical". "grid" fits as many columns as there is room for. */
  orientation?: keyof typeof choiceLayout;
  disabled?: boolean;
  id?: string;
  className?: string;
  classNames?: RadioGroupClassNames;
  /** Replace an option's text completely. The option has a `group` class, so
      `group-has-checked:` styles work inside. */
  renderOption?: (option: RadioOption) => ReactNode;
};

export function RadioGroup({
  name,
  options,
  value,
  defaultValue,
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
}: RadioGroupProps) {
  const field = useField({ id, hint, error });
  const controlled = value !== undefined;

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
                type="radio"
                id={optionId}
                name={name}
                value={opt.value}
                required={required}
                disabled={opt.disabled}
                aria-invalid={field.invalid || undefined}
                aria-describedby={descId}
                {...(controlled ? { checked: value === opt.value } : { defaultChecked: defaultValue === opt.value })}
                onChange={onValueChange ? (e) => onValueChange(e.target.value, e) : undefined}
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

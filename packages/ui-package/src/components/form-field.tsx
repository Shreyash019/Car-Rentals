import { useId, type HTMLAttributes, type LabelHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

/** Props every form control shares. */
export type FieldProps = {
  /** Visible label. If you leave it out, pass aria-label instead. */
  label?: ReactNode;
  /** Helper text under the control. Hidden while `error` is shown. */
  hint?: ReactNode;
  /** Error message. Turns the control red and sets aria-invalid. */
  error?: ReactNode;
  /** Adds a red * to the label and the native `required` attribute. */
  required?: boolean;
};

export type FieldSlotClassNames = Partial<Record<"root" | "label" | "hint" | "error", string>>;

/** Creates ids and aria props that link a control to its label, hint and error. */
export function useField({
  id,
  hint,
  error,
  describedBy,
}: {
  id?: string;
  hint?: ReactNode;
  error?: ReactNode;
  describedBy?: string;
}) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const hintId = hint && !error ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  return {
    controlId,
    hintId,
    errorId,
    invalid: Boolean(error),
    ariaDescribedBy: [describedBy, errorId, hintId].filter(Boolean).join(" ") || undefined,
  };
}

export function FieldLabel({
  required,
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn("label", className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className="ms-0.5 text-danger-subtle-foreground">
          *
        </span>
      )}
    </label>
  );
}

export function FieldHint({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("hint", className)} {...props} />;
}

export function FieldError({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("error-text", className)} {...props} />;
}

export type FormFieldProps = FieldProps & {
  controlId: string;
  hintId?: string;
  errorId?: string;
  className?: string;
  classNames?: FieldSlotClassNames;
  children: ReactNode;
};

/** Label + control + hint/error. Wrap any custom control in it to match the others. */
export function FormField({
  label,
  hint,
  error,
  required,
  controlId,
  hintId,
  errorId,
  className,
  classNames = {},
  children,
}: FormFieldProps) {
  return (
    <div className={cn("w-full min-w-0", className, classNames.root)}>
      {label && (
        <FieldLabel htmlFor={controlId} required={required} className={classNames.label}>
          {label}
        </FieldLabel>
      )}
      {children}
      {error ? (
        <FieldError id={errorId} className={classNames.error}>
          {error}
        </FieldError>
      ) : hint ? (
        <FieldHint id={hintId} className={classNames.hint}>
          {hint}
        </FieldHint>
      ) : null}
    </div>
  );
}

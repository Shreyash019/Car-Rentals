"use client";

import { useState, type ChangeEvent, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { FormField, useField, type FieldProps, type FieldSlotClassNames } from "./form-field";
import { FileIcon, UploadIcon } from "./icons";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export type FileUploadProps = Omit<ComponentProps<"input">, "type" | "size" | "onChange"> &
  FieldProps & {
    /** Max size per file in bytes, e.g. 5 * 1024 * 1024. */
    maxSize?: number;
    onFilesChange?: (files: File[]) => void;
    /** Text inside the drop area. */
    prompt?: ReactNode;
    classNames?: FieldSlotClassNames & Partial<Record<"dropzone" | "list" | "file", string>>;
  };

export function FileUpload({
  label,
  hint,
  error,
  required,
  maxSize,
  onFilesChange,
  prompt,
  multiple,
  disabled,
  id,
  className,
  classNames = {},
  "aria-describedby": describedBy,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const shownError = error ?? sizeError;
  const shownHint = hint ?? (maxSize ? `Up to ${formatBytes(maxSize)}${multiple ? " per file" : ""}.` : undefined);
  const field = useField({ id, hint: shownHint, error: shownError, describedBy });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setDragging(false);
    const list = Array.from(e.target.files ?? []);
    const tooBig = maxSize ? list.filter((f) => f.size > maxSize) : [];
    const message = tooBig.length
      ? `${tooBig.map((f) => f.name).join(", ")} ${tooBig.length === 1 ? "is" : "are"} larger than ${formatBytes(maxSize!)}.`
      : "";
    e.target.setCustomValidity(message); // blocks form submit while invalid
    setSizeError(message || null);
    setFiles(list);
    onFilesChange?.(list);
  }

  return (
    <FormField
      label={label}
      hint={shownHint}
      error={shownError}
      required={required}
      controlId={field.controlId}
      hintId={field.hintId}
      errorId={field.errorId}
      className={className}
      classNames={classNames}
    >
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-input bg-surface px-4 py-8 text-center text-small transition-colors hover:bg-table-hover",
          "has-focus-visible:border-ring has-focus-visible:focus-halo",
          "has-disabled:cursor-not-allowed has-disabled:opacity-50",
          dragging && "border-primary bg-primary-subtle",
          field.invalid && "border-danger",
          classNames.dropzone,
        )}
      >
        <UploadIcon className="size-6 text-muted-foreground" />
        <p>
          {prompt ?? (
            <>
              <span className="font-medium text-link">Choose {multiple ? "files" : "a file"}</span> or drag{" "}
              {multiple ? "them" : "it"} here
            </>
          )}
        </p>
        <input
          {...props}
          id={field.controlId}
          type="file"
          multiple={multiple}
          disabled={disabled}
          required={required}
          aria-invalid={field.invalid || undefined}
          aria-describedby={field.ariaDescribedBy}
          onChange={handleChange}
          className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
      </div>

      {files.length > 0 && (
        <ul className={cn("mt-2 grid gap-1", classNames.list)}>
          {files.map((f) => (
            <li
              key={`${f.name}-${f.size}`}
              className={cn("flex items-center gap-2 rounded-control bg-muted px-3 py-2 text-small", classNames.file)}
            >
              <FileIcon className="text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="text-caption tabular-nums text-muted-foreground">{formatBytes(f.size)}</span>
            </li>
          ))}
        </ul>
      )}
    </FormField>
  );
}

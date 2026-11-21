"use client";

import { useState } from "react";
import { cn } from "../lib/cn";
import { MinusIcon, PlusIcon } from "./icons";
import { Input, type InputProps } from "./input";

export type NumberInputProps = Omit<
  InputProps,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step" | "startIcon" | "endIcon"
> & {
  /** Controlled value. null = empty. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Hide the − / + buttons. */
  hideButtons?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
};

function decimals(n: number) {
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

const STEP_BUTTON =
  "grid size-7 place-items-center rounded-control text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-40";

/** Number field with − / + buttons, e.g. rental days or passengers. Submits like a normal input. */
export function NumberInput({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  hideButtons = false,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  disabled,
  readOnly,
  onBlur,
  classNames,
  ...props
}: NumberInputProps) {
  const [inner, setInner] = useState<number | null>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

  function commit(next: number | null) {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  }

  function bump(direction: 1 | -1) {
    const base = current ?? min ?? 0;
    commit(clamp(Number((base + direction * step).toFixed(decimals(step)))));
  }

  const locked = disabled || readOnly;
  const canDecrease = !locked && (min === undefined || (current ?? min) > min);
  const canIncrease = !locked && (max === undefined || current === null || current < max);

  return (
    <Input
      {...props}
      type="number"
      inputMode={step % 1 === 0 ? "numeric" : "decimal"}
      value={current ?? ""}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      onChange={(e) => {
        const n = e.target.valueAsNumber;
        commit(Number.isNaN(n) ? null : n);
      }}
      onBlur={(e) => {
        if (current !== null && clamp(current) !== current) commit(clamp(current));
        onBlur?.(e);
      }}
      startIcon={
        hideButtons ? undefined : (
          <button type="button" tabIndex={-1} aria-label={decrementLabel} disabled={!canDecrease} onClick={() => bump(-1)} className={cn(STEP_BUTTON, "-ms-2")}>
            <MinusIcon />
          </button>
        )
      }
      endIcon={
        hideButtons ? undefined : (
          <button type="button" tabIndex={-1} aria-label={incrementLabel} disabled={!canIncrease} onClick={() => bump(1)} className={cn(STEP_BUTTON, "-me-2")}>
            <PlusIcon />
          </button>
        )
      }
      classNames={{
        ...classNames,
        control: cn(
          !hideButtons && "text-center",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          classNames?.control,
        ),
      }}
    />
  );
}

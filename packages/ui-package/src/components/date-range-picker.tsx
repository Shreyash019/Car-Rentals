"use client";

import type { ReactNode } from "react";
import {
  Button as AriaButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateRangePicker as AriaDateRangePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  Text,
  type CalendarCellRenderProps,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateSegmentRenderProps,
  type DateValue,
} from "react-aria-components";
import { cn } from "../lib/cn";
import { controlVariants, type ControlVariantProps } from "../lib/control";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

export type DateRangePickerProps<T extends DateValue> = Omit<
  AriaDateRangePickerProps<T>,
  "children" | "className" | "isInvalid"
> &
  ControlVariantProps & {
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    /** Months side by side in the calendar (2 is nice on desktop). Default 1. */
    visibleMonths?: 1 | 2;
    className?: string;
    classNames?: Partial<Record<"root" | "label" | "control" | "popover" | "calendar" | "hint" | "error", string>>;
  };

const NAV_BUTTON =
  "grid size-8 place-items-center rounded-control text-foreground outline-none hover:bg-muted data-disabled:opacity-40 data-focus-visible:focus-halo";

const segmentClass = ({ isPlaceholder, isFocused, type }: DateSegmentRenderProps) =>
  cn(
    "rounded-sm tabular-nums outline-none",
    type !== "literal" && "px-0.5",
    isFocused ? "bg-primary text-primary-foreground" : isPlaceholder && "text-muted-foreground",
  );

const cellClass = ({
  isSelected,
  isSelectionStart,
  isSelectionEnd,
  isOutsideMonth,
  isUnavailable,
  isDisabled,
  isHovered,
}: CalendarCellRenderProps) =>
  cn(
    "grid size-9 cursor-default place-items-center text-small tabular-nums outline-none",
    isOutsideMonth && "invisible",
    !isSelected && "rounded-control",
    !isSelected && isHovered && "bg-muted",
    isSelected && !isSelectionStart && !isSelectionEnd && "bg-primary-subtle text-primary-subtle-foreground",
    (isSelectionStart || isSelectionEnd) && "bg-primary text-primary-foreground",
    isSelectionStart && "rounded-s-control",
    isSelectionEnd && "rounded-e-control",
    isUnavailable && "text-muted-foreground line-through",
    isDisabled && "opacity-40",
  );

/**
 * Pick-up / return dates. Type the dates or pick them in the calendar.
 * Values are @internationalized/date objects: use today(), parseDate() from @car-rentals/ui.
 * For form posts, use startName / endName.
 */
export function DateRangePicker<T extends DateValue>({
  label,
  hint,
  error,
  visibleMonths = 1,
  variant,
  size,
  isRequired,
  className,
  classNames = {},
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker
      {...props}
      isRequired={isRequired}
      isInvalid={Boolean(error)}
      className={cn("w-full min-w-0", className, classNames.root)}
    >
      {label && (
        <Label className={cn("label", classNames.label)}>
          {label}
          {isRequired && (
            <span aria-hidden="true" className="ms-0.5 text-danger-subtle-foreground">
              *
            </span>
          )}
        </Label>
      )}
      <Group className={cn(controlVariants({ variant, size }), "[--field-pe:0.375rem]", classNames.control)}>
        <div className="flex items-center gap-1">
          <DateInput slot="start" className="flex min-w-0">
            {(segment) => <DateSegment segment={segment} className={segmentClass} />}
          </DateInput>
          <span aria-hidden="true" className="px-1 text-muted-foreground">
            –
          </span>
          <DateInput slot="end" className="flex min-w-0 flex-1">
            {(segment) => <DateSegment segment={segment} className={segmentClass} />}
          </DateInput>
          <AriaButton className={cn(NAV_BUTTON, "-my-1 ms-auto text-muted-foreground")}>
            <CalendarIcon />
          </AriaButton>
        </div>
      </Group>
      {hint && !error && (
        <Text slot="description" className={cn("hint", classNames.hint)}>
          {hint}
        </Text>
      )}
      <FieldError className={cn("error-text", classNames.error)}>{error}</FieldError>

      <Popover placement="bottom start" offset={6} className={cn("overlay-panel overlay-pop z-50", classNames.popover)}>
        <Dialog className="p-3 outline-none">
          <RangeCalendar visibleDuration={{ months: visibleMonths }} className={classNames.calendar}>
            <header className="mb-2 flex items-center justify-between gap-2">
              <AriaButton slot="previous" className={NAV_BUTTON}>
                <ChevronLeftIcon />
              </AriaButton>
              <Heading className="text-small font-semibold" />
              <AriaButton slot="next" className={NAV_BUTTON}>
                <ChevronRightIcon />
              </AriaButton>
            </header>
            <div className="flex gap-6">
              {Array.from({ length: visibleMonths }, (_, i) => (
                <CalendarGrid key={i} offset={i ? { months: i } : undefined} className="border-collapse">
                  <CalendarGridHeader>
                    {(day) => (
                      <CalendarHeaderCell className="size-9 text-caption font-medium text-muted-foreground">{day}</CalendarHeaderCell>
                    )}
                  </CalendarGridHeader>
                  <CalendarGridBody>{(date) => <CalendarCell date={date} className={cellClass} />}</CalendarGridBody>
                </CalendarGrid>
              ))}
            </div>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}

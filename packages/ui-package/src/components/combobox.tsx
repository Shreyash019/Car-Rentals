"use client";

import type { ReactNode } from "react";
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
  type ComboBoxProps as AriaComboBoxProps,
} from "react-aria-components";
import { cn } from "../lib/cn";
import { controlVariants, type ControlVariantProps } from "../lib/control";
import { CheckIcon, ChevronDownIcon } from "./icons";

export type ComboboxItem = {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type ComboboxProps = Omit<
  AriaComboBoxProps<ComboboxItem>,
  | "children"
  | "items"
  | "defaultItems"
  | "className"
  | "isInvalid"
  | "disabledKeys"
> &
  ControlVariantProps & {
    items: ComboboxItem[];
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    placeholder?: string;
    emptyMessage?: ReactNode;
    className?: string;
    classNames?: Partial<
      Record<
        | "root"
        | "label"
        | "control"
        | "button"
        | "popover"
        | "list"
        | "item"
        | "hint"
        | "error",
        string
      >
    >;
  };

/** Searchable select: type to filter, arrows to move, Enter to pick. */
export function Combobox({
  items,
  label,
  hint,
  error,
  placeholder,
  emptyMessage = "No matches",
  variant,
  size,
  isRequired,
  className,
  classNames = {},
  ...props
}: ComboboxProps) {

  return (
    <AriaComboBox
      {...props}
      defaultItems={items}
      disabledKeys={items.filter((i) => i.disabled).map((i) => i.id)}
      isRequired={isRequired}
      isInvalid={Boolean(error)}
      className={cn("w-full min-w-0", className, classNames.root)}
    >
      {label && (
        <Label className={cn("label", classNames.label)}>
          {label}
          {isRequired && (
            <span
              aria-hidden="true"
              className="ms-0.5 text-danger-subtle-foreground"
            >
              *
            </span>
          )}
        </Label>
      )}
      <div className="relative">
        <Input
          placeholder={placeholder}
          className={cn(
            controlVariants({ variant, size }),
            "[--field-pe:2.5rem]",
            classNames.control,
          )}
        />
        <AriaButton
          className={cn(
            "absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground outline-none",
            classNames.button,
          )}
        >
          <ChevronDownIcon />
        </AriaButton>
      </div>
      {hint && !error && (
        <Text slot="description" className={cn("hint", classNames.hint)}>
          {hint}
        </Text>
      )}
      <FieldError className={cn("error-text", classNames.error)}>
        {error}
      </FieldError>

      <Popover
        offset={4}
        className={cn(
          "overlay-panel overlay-fade z-50 w-(--trigger-width)",
          classNames.popover,
        )}
      >
        <ListBox<ComboboxItem>
          renderEmptyState={() => (
            <p className="px-3 py-2 text-small text-muted-foreground">
              {emptyMessage}
            </p>
          )}
          className={cn(
            "max-h-72 overflow-y-auto p-1 outline-none",
            classNames.list,
          )}
        >
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.label}
              className={cn("overlay-item", classNames.item)}
            >
              {({ isSelected }) => (
                <>
                  <span className="grid min-w-0 flex-1">
                    <span
                      className={cn("truncate", isSelected && "font-medium")}
                    >
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="truncate text-caption text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </span>
                  {isSelected && <CheckIcon className="text-link" />}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}

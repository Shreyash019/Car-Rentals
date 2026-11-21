import { cva, type VariantProps } from "class-variance-authority";

/**
 * Shared look for text-like controls (Input, Textarea, Select).
 * The CSS lives in styles.css (`field`, `field-sm`, `field-lg`, `field-filled`, `field-ghost`);
 * this only maps props to those classes. Change the look there.
 */
export const controlVariants = cva("field", {
  variants: {
    variant: { outline: "", filled: "field-filled", ghost: "field-ghost" },
    size: { sm: "field-sm", md: "", lg: "field-lg" },
  },
  defaultVariants: { variant: "outline", size: "md" },
});

export type ControlVariantProps = VariantProps<typeof controlVariants>;

/** Shared look for one radio/checkbox row. "card" = big selectable tile. */
export const choiceVariants = cva("group flex cursor-pointer items-start gap-3 text-small", {
  variants: {
    variant: {
      default: "",
      card: [
        "rounded-card border border-border bg-surface p-4 transition-colors hover:bg-table-hover",
        "has-checked:border-primary has-checked:bg-primary-subtle",
        "has-focus-visible:focus-halo",
      ],
    },
  },
  compoundVariants: [],
  defaultVariants: { variant: "default" },
});

/** The small native radio/checkbox itself, colored with the brand. */
export const choiceInputClass =
  "mt-0.5 size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed group-has-disabled:cursor-not-allowed";

  /** Layout for a list of radios/checkboxes. "grid" fits as many columns as there is room for. */
export const choiceLayout = {
  vertical: "flex flex-col gap-3",
  horizontal: "flex flex-wrap gap-x-6 gap-y-3",
  grid: "grid gap-3 grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))]",
} as const;

import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's built-in names. Register the custom theme
 * names from styles.css so they merge correctly, e.g. "text-small" is a font
 * size, not a text color, and must not remove "text-primary-foreground".
 * Keep these lists in sync with the @theme blocks in styles.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "h4", "body-lg", "body", "small", "caption"],
      font: ["display"],
      radius: ["control", "card"],
      shadow: ["card", "overlay"],
      spacing: ["gutter", "section"],
      ease: ["standard"],
      breakpoint: ["xs"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

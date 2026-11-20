import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "h4", "body-lg", "body", "small", "caption"],
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

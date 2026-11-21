/* eslint-disable @next/next/no-img-element -- plain <img>: works in every app without next.config image setup */
import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

const SIZE = {
  xs: "size-6 text-caption",
  sm: "size-8 text-caption",
  md: "size-10 text-small",
  lg: "size-14 text-body",
  xl: "size-20 text-h4",
} as const;

const TONE = {
  primary: "tone-primary-subtle",
  highlight: "tone-highlight-subtle",
  success: "tone-success-subtle",
  neutral: "tone-muted",
} as const;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Person or company name: used for initials and the accessible name. */
  name: string;
  /** Photo URL. If it fails to load, the initials show. */
  src?: string;
  size?: keyof typeof SIZE;
  shape?: "circle" | "square";
  tone?: keyof typeof TONE;
};

export function Avatar({
  name,
  src,
  size = "md",
  shape = "circle",
  tone = "primary",
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "relative inline-grid shrink-0 select-none place-items-center overflow-hidden font-medium",
        SIZE[size],
        shape === "circle" ? "rounded-full" : "rounded-control",
        TONE[tone],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{initials(name)}</span>
      {src && (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}

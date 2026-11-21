import type { SVGProps } from "react";
import { cn } from "../lib/cn";

const SIZE = { sm: "size-4", md: "size-5", lg: "size-8" } as const;

export type SpinnerProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  size?: keyof typeof SIZE;
  /** Text for screen readers, e.g. "Loading cars". Leave out when a parent already says it. */
  label?: string;
};

export function Spinner({ size = "md", label, className, ...props }: SpinnerProps) {
  const svg = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0 animate-spin", SIZE[size], className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
  if (!label) return svg;
  return (
    <span role="status" className="inline-flex items-center">
      {svg}
      <span className="sr-only">{label}</span>
    </span>
  );
}

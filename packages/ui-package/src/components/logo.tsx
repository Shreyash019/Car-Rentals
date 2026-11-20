/* eslint-disable @next/next/no-img-element -- plain <img>: works in every app without next.config image setup */
import type { ImgHTMLAttributes } from "react";
import { BRAND } from "../lib/brand";
import { cn } from "../lib/cn";

type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  /** "full" = icon + name (headers). "mark" = square icon only. Default "full". */
  variant?: "full" | "mark";
};

/** Brand logo from BRAND (lib/brand.ts). Size it with a height class, e.g. className="h-8". */
export function Logo({ variant = "full", className, ...props }: LogoProps) {
  const full = variant === "full";
  return (
    <img
      src={full ? BRAND.logoUrl : BRAND.logoMarkUrl}
      alt={BRAND.name}
      width={full ? 160 : 40}
      height={40}
      decoding="async"
      className={cn("h-8 w-auto", full ? "rounded-control" : "rounded-full", className)}
      {...props}
    />
  );
}

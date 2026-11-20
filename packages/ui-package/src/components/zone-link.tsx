import type { AnchorHTMLAttributes } from "react";

type Zone = "customers" | "admin" | "providers";
const ZONE_PREFIX: Record<Zone, string> = { customers: "", admin: "/admin", providers: "/providers" };

type ZoneLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { zone: Zone; href: string };

/** Link to a page in ANOTHER zone. Within the same zone, use next/link instead. */
export function ZoneLink({ zone, href, ...props }: ZoneLinkProps) {
  const path = href.startsWith("/") ? href : `/${href}`;
  return <a href={`${ZONE_PREFIX[zone]}${path === "/" && zone !== "customers" ? "" : path}`} {...props} />;
}

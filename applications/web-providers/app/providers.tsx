"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UIProvider } from "@car-rentals/ui";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  // useHref adds this zone's basePath so "open in new tab" on menu links works.
  return (
    <UIProvider navigate={router.push} useHref={(href) => `/admin${href}`}>
      {children}
    </UIProvider>
  );
}

"use client";

import type { ReactNode } from "react";
import { I18nProvider, RouterProvider } from "react-aria-components";
import { Toaster, type ToasterProps } from "./toast";

export type UIProviderProps = {
  children: ReactNode;
  /** Locale for dates and numbers. Fixed so server and browser render the same text. Default "en-IN". */
  locale?: string;
  /** Client-side navigation for menu items with href, e.g. router.push from next/navigation. */
  navigate?: (path: string) => void;
  /** Turns an app path into the real href, e.g. adds the zone's basePath ("/admin"). */
  useHref?: (href: string) => string;
  /** Toaster options, or false if you render <Toaster /> yourself. */
  toaster?: ToasterProps | false;
};

/** Put once around each app's <body> content. */
export function UIProvider({ children, locale = "en-IN", navigate, useHref, toaster }: UIProviderProps) {
  const content = (
    <I18nProvider locale={locale}>
      {children}
      {toaster !== false && <Toaster {...toaster} />}
    </I18nProvider>
  );
  return navigate ? (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {content}
    </RouterProvider>
  ) : (
    content
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { setThemeMode, type ThemeMode } from "../lib/theme";
import { Button } from "./button";

const NEXT_MODE: Record<ThemeMode, ThemeMode> = { light: "dark", dark: "system", system: "light" };
const LABEL: Record<ThemeMode, string> = { light: "☀ Light", dark: "☾ Dark", system: "◐ Auto" };

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme-mode"] });
  return () => observer.disconnect();
}

function readMode(): ThemeMode {
  const mode = document.documentElement.dataset.themeMode;
  return mode === "light" || mode === "dark" ? mode : "system";
}

/**
 * Cycles Light → Dark → Auto (follow the OS). The choice is remembered in this browser.
 * Needs themeScript() in the app's <head>.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, readMode, () => "system" as ThemeMode);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => setThemeMode(NEXT_MODE[mode])}
      aria-label={`Theme: ${LABEL[mode].slice(2)}. Click to change.`}
    >
      {LABEL[mode]}
    </Button>
  );
}

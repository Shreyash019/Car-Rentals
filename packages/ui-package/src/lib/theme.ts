export type Theme = "light" | "dark";
export type ThemeMode = Theme | "system";

const STORAGE_KEY = "theme-mode";

const envMode = process.env.NEXT_PUBLIC_THEME;

/**
 * Default theme mode for visitors who haven't picked one yet.
 * Set with NEXT_PUBLIC_THEME=light | dark | system (default: system = follow the OS).
 */
export const APP_THEME_MODE: ThemeMode =
  envMode === "light" || envMode === "dark" || envMode === "system" ? envMode : "system";

/** Theme rendered on the server. The theme script corrects it before the first paint. */
export const APP_THEME: Theme = APP_THEME_MODE === "dark" ? "dark" : "light";

/**
 * Inline script for <head>. Runs before the page paints, so there is no flash of the
 * wrong theme. Applies the saved choice (or the default), follows OS changes in
 * "system" mode, and exposes window.__setThemeMode for <ThemeToggle>.
 *
 *   <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
 */
export function themeScript(defaultMode: ThemeMode = APP_THEME_MODE): string {
  return `(function(){try{var d=document.documentElement,k=${JSON.stringify(STORAGE_KEY)},m=${JSON.stringify(defaultMode)};try{m=localStorage.getItem(k)||m}catch(e){}var q=window.matchMedia("(prefers-color-scheme: dark)");function a(){d.dataset.theme=m==="system"?(q.matches?"dark":"light"):m;d.dataset.themeMode=m}a();q.addEventListener("change",a);window.__setThemeMode=function(n){m=n;try{localStorage.setItem(k,n)}catch(e){}a()}}catch(e){}})();`;
}

/** Change the theme mode from client code (used by <ThemeToggle>). Remembered per browser. */
export function setThemeMode(mode: ThemeMode): void {
  const w = window as Window & { __setThemeMode?: (m: ThemeMode) => void };
  if (w.__setThemeMode) {
    w.__setThemeMode(mode);
    return;
  }
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themeMode = mode;
}

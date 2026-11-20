export type Theme = "light" | "dark";

export const APP_THEME: Theme = process.env.NEXT_PUBLIC_THEME === "dark" ? "dark" : "light";

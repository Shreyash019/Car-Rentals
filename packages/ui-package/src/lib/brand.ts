/**
 * ★ BRAND IDENTITY — the one place for name, logo, icons and share image.
 *
 * The image URLs below are PLACEHOLDERS (placehold.co). Replace each one with the
 * real file URL when you have it; every app picks the change up automatically.
 * Colors live in styles.css (section 1); keep themeColor in sync with --brand-600.
 */
export const BRAND = {
  name: "Car Rentals",
  shortName: "CR",
  tagline: "Rent the right car in minutes",
  description: "Book cars from trusted local partners, with free cancellation and clear prices.",

  /** Full logo (icon + name), roughly 4:1. Used in headers. */
  logoUrl: "https://placehold.co/320x80/1d4ed8/ffffff/png?text=Car+Rentals&font=montserrat",
  /** Square logo mark (icon only). Used where space is tight. */
  logoMarkUrl: "https://placehold.co/128x128/e21266/ffffff/png?text=CR&font=montserrat",

  /** Browser tab icon. */
  faviconUrl: "https://placehold.co/64x64/1d4ed8/ffffff/png?text=CR&font=montserrat",
  /** Home-screen icon on iPhone/iPad (180×180). */
  appleIconUrl: "https://placehold.co/180x180/1d4ed8/ffffff/png?text=CR&font=montserrat",
  /** Preview image when a link is shared (1200×630). */
  ogImageUrl: "https://placehold.co/1200x630/1d4ed8/ffffff/png?text=Car+Rentals&font=montserrat",

  /** Browser UI color on phones (address bar). Light = brand blue, dark = page background. */
  themeColor: { light: "#1d4ed8", dark: "#0a0a0a" },
} as const;

export type Brand = typeof BRAND;

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_THEME, BRAND, themeScript } from "@car-rentals/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: `${BRAND.name} Admin`, template: `%s · ${BRAND.name} Admin` },
  description: `Manage partners, cars and bookings for ${BRAND.name}.`,
  applicationName: `${BRAND.name} Admin`,
  icons: { icon: BRAND.faviconUrl, apple: BRAND.appleIconUrl },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: BRAND.themeColor.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={APP_THEME}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

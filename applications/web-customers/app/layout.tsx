import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_THEME, BRAND, themeScript } from "@car-rentals/ui";
import "./globals.css";
import { Header, Footer } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} · ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  icons: { icon: BRAND.faviconUrl, apple: BRAND.appleIconUrl },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: BRAND.name,
    description: BRAND.description,
    images: [
      { url: BRAND.ogImageUrl, width: 1200, height: 630, alt: BRAND.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.description,
    images: [BRAND.ogImageUrl],
  },
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
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

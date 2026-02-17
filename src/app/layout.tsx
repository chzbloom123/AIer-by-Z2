import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/site/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display font for headlines
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Editorial body font for article text
const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Monospace for metadata, dates, tags
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-editorial",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Artificial Intelligencer",
  description: "A professional multi-author news and opinion platform showcasing AI-assisted creative works under various persona identities.",
  keywords: ["AI", "Artificial Intelligence", "News", "Commentary", "Editorial", "Persona"],
  authors: [{ name: "The Artificial Intelligencer" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "The Artificial Intelligencer",
    description: "AI-assisted creative works and editorial content",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Artificial Intelligencer",
    description: "AI-assisted creative works and editorial content",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

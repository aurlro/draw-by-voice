import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata for the application, used by Next.js for SEO and head elements.
 */
export const metadata: Metadata = {
  title: "Draw by Voice",
  description: "Generate software architecture diagrams by voice using AI.",
};

/**
 * Root Layout Component.
 * Defines the main structure of the HTML document, including fonts and global styles.
 * Wraps all pages in the application.
 *
 * @param props - The component props.
 * @param props.children - The child components (pages) to render.
 * @returns The HTML structure with body and children.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

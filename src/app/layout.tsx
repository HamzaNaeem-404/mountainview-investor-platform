import type { Metadata } from "next";
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Mountain View — Investor Operations Demo",
  description:
    "Illustrative staff-facing CRM prototype for Mountain View Investment Services. Fictional data only.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full font-[family-name:var(--font-sans)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

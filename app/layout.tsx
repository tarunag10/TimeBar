import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import DisclaimerBanner from "@/components/DisclaimerBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TimeBar — England & Wales Limitation Calculator",
  description:
    "Calculate likely limitation expiry dates for common England & Wales civil claim types. A lawyer-friendly decision-support tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col bg-[#050a18] text-slate-200 font-[var(--font-inter)]">
        <Header />
        <DisclaimerBanner />
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  );
}

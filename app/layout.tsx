import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import ThemeProvider from "@/components/ThemeProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TimeBar — England & Wales Limitation Calculator",
  description:
    "Estimate limitation deadlines for common England & Wales civil claims with legal references, clear reasoning, and plain-English guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:light)').matches){document.documentElement.setAttribute('data-theme','light')}else{document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="relative min-h-full flex flex-col bg-[var(--bg-primary)] text-slate-200 font-[var(--font-manrope)]">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-1.5 focus:rounded-lg focus:bg-[var(--accent)] focus:text-[var(--ring-bg)] focus:text-sm focus:font-semibold"
          >
            Skip to content
          </a>
          <Header />
          <DisclaimerBanner />
          <main id="main-content" role="main" className="relative z-10 flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

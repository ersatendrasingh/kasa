import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import SiteHeader from "@/components/site-header";
import { ThemeInitializer } from "@/components/site/theme-initializer";
import { SiteFooter } from "@/components/site/site-footer";
import { PageUxControls } from "@/components/site/page-ux-controls";
import { SiteStructuredData } from "@/components/site/structured-data";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = localFont({
  src: "../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const poppins = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-WCLQ27XF";
const DEFAULT_ADSENSE_CLIENT_ID = "ca-pub-2007753908126813";
const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID?.trim() || DEFAULT_ADSENSE_CLIENT_ID;
const hasValidAdsenseClientId = /^ca-pub-\d{10,}$/.test(ADSENSE_CLIENT_ID ?? "");

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getkasa.in"),
  title: {
    default: "KASA | LMS Software for Coaching Institutes and Online Academies",
    template: "%s | KASA",
  },
  description:
    "KASA is an all-in-one LMS software for coaching institutes, online academies, trainers, and EdTech teams to sell courses, run live classes, manage students, collect payments, issue certificates, and track growth.",
  applicationName: "KASA",
  authors: [{ name: "KASA", url: "https://www.getkasa.in" }],
  creator: "KASA",
  publisher: "KASA",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/kasa-favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.getkasa.in",
    siteName: "KASA",
    title: "KASA | LMS Software for Coaching Institutes and Online Academies",
    description:
      "Launch a branded academy website, sell courses, manage learners, live classes, payments, certificates, and institute operations from one LMS platform.",
    images: [
      {
        url: "/kasa-hero.png",
        width: 1200,
        height: 630,
        alt: "KASA LMS software for coaching institutes and online academies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KASA | LMS Software for Coaching Institutes",
    description:
      "All-in-one LMS, academy website, live classes, payments, certificates, and education CRM for modern training institutes.",
    images: ["/kasa-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "google-adsense-account": ADSENSE_CLIENT_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "scroll-smooth", "antialiased", inter.variable, poppins.variable, "font-sans", geist.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        {hasValidAdsenseClientId ? (
          <Script
            id="google-adsense"
            async
            strategy="beforeInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          />
        ) : null}
        <Script id="gtm" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            (function(w,d,s,l,i){
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeInitializer />
        <SiteStructuredData />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <PageUxControls />
        <Toaster />
      </body>
    </html>
  );
}

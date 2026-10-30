import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { ReactNode } from "react";
import { site } from "@/content/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});
const body = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

const title = `${site.name} | ${site.role}`;
const images = [{ url: "/og.jpg", width: 1200, height: 630, alt: title }];

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.intro,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: site.name, title, description: site.intro, images },
  twitter: { card: "summary_large_image", title, description: site.intro, images },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressRegion: "Gujarat", addressCountry: "IN" },
  sameAs: site.socials.map((social) => social.href),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}

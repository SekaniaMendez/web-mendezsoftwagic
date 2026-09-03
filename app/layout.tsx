import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "mendezsoftwagic.vercel.app";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "MendezSoftwagic — Engineering the impossible";
  const description = "Software engineering, artificial intelligence, geospatial technology and interactive worlds crafted in Costa Rica.";
  const socialImage = new URL("/og.png", origin).toString();
  return {
    metadataBase: new URL(origin), title: { default: title, template: "%s | MendezSoftwagic" }, description,
    keywords: ["Software engineering", "AI engineering", "C++", "Python", "TypeScript", "Swift", "Unreal Engine", "Costa Rica"],
    icons: { icon: "/images/mendez_softwagic_icon-v3.png", apple: "/images/mendez_softwagic_icon-v3.png" },
    openGraph: { title, description, type: "website", siteName: "MendezSoftwagic", images: [{ url: socialImage, width: 1200, height: 630, alt: "MendezSoftwagic — Engineering the impossible" }] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#05070a", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

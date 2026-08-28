import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "mendezsoftwagic.vercel.app";
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `https://${host}/sitemap.xml` };
}

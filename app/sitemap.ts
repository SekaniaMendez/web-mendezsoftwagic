import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "mendezsoftwagic.vercel.app";
  const baseUrl = `https://${host}`;
  return [{ url: baseUrl, priority: 1 }, ...projects.map((project) => ({ url: `${baseUrl}/work/${project.slug}`, priority: 0.8 }))];
}

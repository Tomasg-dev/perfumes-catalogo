import type { MetadataRoute } from "next";
import { getPerfumes } from "@/lib/sheets";
import { getAllTenisSlugs } from "@/lib/tenis";
import { SITE_URL } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [perfumes, tenis] = await Promise.all([getPerfumes(), getAllTenisSlugs()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/perfumes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/tenis`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const perfumeRoutes: MetadataRoute.Sitemap = perfumes.map((perfume) => ({
    url: `${SITE_URL}/producto/${perfume.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tenisRoutes: MetadataRoute.Sitemap = tenis.map((item) => ({
    url: `${SITE_URL}/tenis/${item.slug}`,
    lastModified: new Date(item.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...perfumeRoutes, ...tenisRoutes];
}

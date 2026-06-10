import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const pages = [
  "",
  "/fuer-fachkraefte",
  "/fuer-arbeitgeber",
  "/ablauf",
  "/branchen",
  "/ueber-uns",
  "/faq",
  "/kontakt",
  "/bewerbung",
  "/anfrage",
  "/ressourcen",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rks-fachkraefte.de";

  return routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );
}

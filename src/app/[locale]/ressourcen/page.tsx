import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { QualificationCalculator } from "@/components/tools/QualificationCalculator";
import { SalaryCalculator } from "@/components/tools/SalaryCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const articles = [
  { title: "Leben in Deutschland — Ein Leitfaden", slug: "leben-in-deutschland", date: "2025-12-01" },
  { title: "Deutsch lernen — Tipps für Anfänger", slug: "deutsch-lernen", date: "2025-11-15" },
  { title: "Visum-Checkliste für Fachkräfte", slug: "visum-checkliste", date: "2025-10-20" },
  { title: "Anerkennung ausländischer Abschlüsse", slug: "anerkennung", date: "2025-09-10" },
];

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero title="Ressourcen & Tools" subtitle="Ratgeber, Rechner und hilfreiche Informationen" />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <QualificationCalculator />
            <SalaryCalculator />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-6">Ratgeber-Artikel</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Card key={article.slug} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted">{new Date(article.date).toLocaleDateString(locale)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

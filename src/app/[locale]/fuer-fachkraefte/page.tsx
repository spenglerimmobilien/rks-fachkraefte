import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default async function CandidatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CandidatesContent />;
}

function CandidatesContent() {
  const t = useTranslations("candidates");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("benefits.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["1", "2", "3", "4", "5"].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-sm">{t(`benefits.${i}`)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("requirements.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["1", "2", "3", "4", "5"].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-navy shrink-0 mt-0.5" />
                  <span className="text-sm">{t(`requirements.${i}`)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-12">
          <Link href="/bewerbung">
            <Button variant="gold" size="lg">Jetzt bewerben →</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

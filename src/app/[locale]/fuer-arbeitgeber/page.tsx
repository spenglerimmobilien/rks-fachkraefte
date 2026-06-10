import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Building2, Clock, Shield, LayoutDashboard } from "lucide-react";

export default async function EmployersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EmployersContent />;
}

function EmployersContent() {
  const t = useTranslations("employers");

  const icons = [Shield, Clock, Building2, CheckCircle, CheckCircle];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("benefits.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["1", "2", "3", "4", "5"].map((i, idx) => {
                const Icon = icons[idx];
                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-sand/50">
                    <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <span>{t(`benefits.${i}`)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="mt-8 border-brand-red/20 bg-navy/5">
            <CardContent className="p-6 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy mb-2">{t("portalInfoTitle")}</h3>
                <p className="text-muted leading-relaxed">{t("portalInfoDesc")}</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <Link href="/anfrage">
              <Button variant="gold" size="lg">{t("ctaRequest")} →</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

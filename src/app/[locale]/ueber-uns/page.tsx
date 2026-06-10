import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, GraduationCap, Award, Target } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

  const highlights = [
    { key: "network", icon: Globe, title: t("networkTitle"), desc: t("networkDesc") },
    { key: "schools", icon: GraduationCap, title: t("schoolsTitle"), desc: t("schoolsDesc") },
    { key: "quality", icon: Award, title: t("qualityTitle"), desc: t("qualityDesc") },
  ] as const;

  const stats = [
    { value: "2019", label: t("statFounded") },
    { value: "2", label: t("statLocations") },
    { value: "15+", label: t("statTeam") },
    { value: "10+", label: t("statPartners") },
  ];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-brand-red/20">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-brand-red" />
                </div>
                <CardTitle>{t("missionTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted leading-relaxed">{t("mission")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-navy" />
                </div>
                <CardTitle>{t("visionTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted leading-relaxed">{t("vision")}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {highlights.map(({ key, icon: Icon, title, desc }) => (
              <Card key={key} className="card-hover overflow-hidden">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shrink-0">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-3">{title}</h3>
                    <p className="text-muted leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((item) => (
              <div key={item.label} className="p-6 rounded-2xl bg-sand text-center card-hover">
                <div className="text-3xl font-black text-navy">{item.value}</div>
                <div className="text-sm text-muted mt-1 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

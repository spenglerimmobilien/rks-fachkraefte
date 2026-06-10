import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { VisaTimeline } from "@/components/tools/VisaTimeline";

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProcessContent />;
}

function ProcessContent() {
  const t = useTranslations("process");
  const stepKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-0">
            {stepKeys.map((key, i) => (
              <div key={key} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-navy font-bold shrink-0">
                    {key}
                  </div>
                  {i < stepKeys.length - 1 && <div className="w-0.5 flex-1 bg-gold/30 my-2" />}
                </div>
                <div className="pb-10">
                  <h3 className="font-bold text-navy text-lg mb-1">{t(`steps.${key}.title`)}</h3>
                  <p className="text-muted">{t(`steps.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-sand/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisaTimeline />
        </div>
      </section>
    </>
  );
}

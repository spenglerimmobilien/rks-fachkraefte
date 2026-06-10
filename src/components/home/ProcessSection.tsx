import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const stepKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

export function ProcessSection() {
  const t = useTranslations("process");

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{t("title")}</h2>
          <p className="text-muted text-lg">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {stepKeys.map((key, i) => (
            <div key={key} className="relative text-center">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-navy font-bold text-lg mx-auto mb-3">
                {key}
              </div>
              <h3 className="font-semibold text-navy text-sm mb-1">{t(`steps.${key}.title`)}</h3>
              <p className="text-muted text-xs">{t(`steps.${key}.desc`)}</p>
              {i < stepKeys.length - 1 && (
                <div className="hidden md:block absolute top-6 start-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-gold/30" />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/ablauf">
            <Button variant="outline">{t("title")} →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

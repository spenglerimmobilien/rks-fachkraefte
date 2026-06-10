import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function CtaSection() {
  const t = useTranslations("cta");
  const g = useTranslations("gamification");

  return (
    <section className="py-20 md:py-28 gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 mountain-pattern" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="flex justify-center mb-6">
          <Star className="h-8 w-8 text-brand-red fill-brand-red animate-pulse-glow" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-4">{t("title")}</h2>
        <p className="text-white/75 text-lg mb-3 max-w-2xl mx-auto">{t("subtitle")}</p>
        <p className="text-brand-red-light text-sm font-semibold mb-8">{g("finalCta")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/bewerbung">
            <Button variant="gold" size="lg" className="w-full sm:w-auto min-w-[200px]">
              {t("candidate")}
            </Button>
          </Link>
          <Link href="/anfrage">
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px] border-white/40 text-white hover:bg-white hover:text-navy">
              {t("employer")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

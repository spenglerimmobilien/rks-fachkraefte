import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { Heart, Wrench, Monitor, UtensilsCrossed, Truck, HardHat } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const industries = [
  { key: "nursing", icon: Heart },
  { key: "craft", icon: Wrench },
  { key: "it", icon: Monitor },
  { key: "gastronomy", icon: UtensilsCrossed },
  { key: "logistics", icon: Truck },
  { key: "construction", icon: HardHat },
] as const;

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <IndustriesContent />;
}

function IndustriesContent() {
  const t = useTranslations("industries");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map(({ key, icon: Icon }) => (
            <div key={key} className="border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-4">
                <Icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="font-bold text-navy text-lg mb-2">{t(key)}</h3>
              <p className="text-muted text-sm mb-4">
                Qualifizierte Fachkräfte im Bereich {t(key)} — sorgfältig ausgewählt und geprüft.
              </p>
              <Link href="/bewerbung">
                <Button variant="outline" size="sm">Bewerben →</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

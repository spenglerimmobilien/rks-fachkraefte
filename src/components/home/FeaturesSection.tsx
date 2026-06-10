import { useTranslations } from "next-intl";
import { Shield, HeartHandshake, Building2, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { key: "exclusive", icon: Shield },
  { key: "support", icon: HeartHandshake },
  { key: "quality", icon: Building2 },
  { key: "languages", icon: Languages },
] as const;

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="py-16 md:py-24 bg-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">{t("title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ key, icon: Icon }) => (
            <Card key={key} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center mb-2">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <CardTitle className="text-lg">{t(`${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted text-sm">{t(`${key}.desc`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

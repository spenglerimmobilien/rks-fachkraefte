import { useTranslations } from "next-intl";

const stats = [
  { key: "placed", value: "500+" },
  { key: "employers", value: "50+" },
  { key: "satisfaction", value: "98%" },
  { key: "countries", value: "2" },
] as const;

export function StatsSection() {
  const t = useTranslations("stats");

  return (
    <section className="bg-white py-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-navy mb-1">{stat.value}</div>
              <div className="text-sm text-muted">{t(stat.key)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

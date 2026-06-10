"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Wrench, Monitor, UtensilsCrossed, Truck, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

const industries = [
  { key: "nursing", icon: Heart },
  { key: "craft", icon: Wrench },
  { key: "it", icon: Monitor },
  { key: "gastronomy", icon: UtensilsCrossed },
  { key: "logistics", icon: Truck },
  { key: "construction", icon: HardHat },
] as const;

export function IndustriesSection() {
  const t = useTranslations("industries");
  const g = useTranslations("gamification");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 mountain-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">{t("title")}</h2>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
          <p className="text-sm text-brand-red-light mt-2">{g("pickIndustry")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelected(selected === key ? null : key)}
              className={cn(
                "bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-center transition-all card-hover hover:border-white/25 hover:bg-white/10",
                selected === key && "border-brand-red bg-brand-red/20 scale-105 quest-step-active"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform",
                selected === key ? "bg-brand-red text-white scale-110" : "bg-white/10"
              )}>
                <Icon className="h-7 w-7" />
              </div>
              <span className="text-sm font-semibold">{t(key)}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-8 text-center animate-slide-up">
            <p className="text-white/70 mb-4">
              {g("selectedIndustry")}: <strong className="text-white">{t(selected as typeof industries[number]["key"])}</strong>
            </p>
            <Link href="/bewerbung">
              <span className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 cursor-pointer">
                {g("applyNow")} →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

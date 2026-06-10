"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Shield, Zap, Award, HeartHandshake, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const achievements = [
  { key: "exclusive", icon: Shield, color: "from-brand-red/20 to-brand-red/5" },
  { key: "support", icon: HeartHandshake, color: "from-navy/10 to-navy/5" },
  { key: "quality", icon: Award, color: "from-brand-red/15 to-transparent" },
  { key: "languages", icon: Zap, color: "from-navy/10 to-brand-red/5" },
] as const;

export function AchievementSection() {
  const t = useTranslations("features");
  const g = useTranslations("gamification");
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setUnlocked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-navy mb-3">{t("title")}</h2>
          <p className="text-muted">{g("tapToUnlock")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievements.map(({ key, icon: Icon, color }) => {
            const isUnlocked = unlocked.has(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={cn(
                  "text-start p-6 rounded-2xl border-2 transition-all card-hover",
                  isUnlocked
                    ? "border-brand-red bg-gradient-to-br shadow-lg shadow-brand-red/10"
                    : "border-border bg-white grayscale hover:grayscale-0",
                  color
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isUnlocked ? "bg-brand-red text-white" : "bg-sand text-navy"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {isUnlocked && (
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-brand-red" />
                      {g("unlocked")}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">{t(`${key}.title`)}</h3>
                <p className={cn("text-sm transition-all", isUnlocked ? "text-navy/80" : "text-muted blur-[2px] select-none")}>
                  {t(`${key}.desc`)}
                </p>
              </button>
            );
          })}
        </div>

        {unlocked.size === achievements.length && (
          <div className="mt-8 text-center animate-slide-up">
            <span className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full font-bold">
              <TrophyIcon />
              {g("allUnlocked")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function TrophyIcon() {
  return <Award className="h-5 w-5 text-brand-red-light" />;
}

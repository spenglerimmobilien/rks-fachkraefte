"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MountainSilhouette } from "@/components/brand/MountainSilhouette";
import { Check, Lock, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const stepKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

export function JourneyGameSection() {
  const t = useTranslations("process");
  const g = useTranslations("gamification");
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progress = ((activeStep + 1) / stepKeys.length) * 100;
  const xp = completedSteps.length * 150;

  const handleStepClick = (index: number) => {
    if (index <= activeStep + 1) {
      setActiveStep(index);
      if (!completedSteps.includes(index)) {
        setCompletedSteps((prev) => [...prev, index]);
      }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden">
      <MountainSilhouette className="absolute top-0 left-0 right-0 w-full text-white h-24 rotate-180 opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red-light px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Trophy className="h-4 w-4" />
            {g("questTitle")}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-3">{t("title")}</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">{g("yourProgress")}</span>
            <span className="font-bold text-brand-red-light">{xp} XP</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/10" />
          <p className="text-xs text-white/40 mt-2 text-center">
            {g("stepOf", { current: activeStep + 1, total: stepKeys.length })}
          </p>
        </div>

        <div className="grid md:grid-cols-7 gap-3 mb-10">
          {stepKeys.map((key, i) => {
            const isActive = i === activeStep;
            const isCompleted = completedSteps.includes(i);
            const isLocked = i > activeStep + 1;

            return (
              <button
                key={key}
                onClick={() => handleStepClick(i)}
                disabled={isLocked}
                className={cn(
                  "relative p-4 rounded-2xl border-2 text-center transition-all",
                  isActive && "border-brand-red bg-brand-red/20 quest-step-active scale-105",
                  isCompleted && !isActive && "border-brand-red/50 bg-brand-red/10",
                  !isActive && !isCompleted && !isLocked && "border-white/15 bg-white/5 hover:border-white/30",
                  isLocked && "border-white/5 bg-white/5 opacity-40 cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold",
                  isCompleted ? "bg-brand-red text-white" : isActive ? "gradient-accent text-white" : "bg-white/10"
                )}>
                  {isCompleted ? <Check className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : key}
                </div>
                <p className="text-xs font-semibold leading-tight hidden md:block">
                  {t(`steps.${key}.title`)}
                </p>
                {isActive && (
                  <Star className="absolute -top-1 -end-1 h-4 w-4 text-brand-red fill-brand-red" />
                )}
              </button>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8 text-center animate-slide-up">
          <h3 className="text-xl font-bold mb-2">
            {t(`steps.${stepKeys[activeStep]}.title`)}
          </h3>
          <p className="text-white/70 mb-6">
            {t(`steps.${stepKeys[activeStep]}.desc`)}
          </p>
          {activeStep < stepKeys.length - 1 ? (
            <Button
              variant="gold"
              onClick={() => handleStepClick(activeStep + 1)}
            >
              {g("nextStep")} →
            </Button>
          ) : (
            <Link href="/bewerbung">
              <Button variant="gold" size="lg">
                {g("startQuest")} 🏔️
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

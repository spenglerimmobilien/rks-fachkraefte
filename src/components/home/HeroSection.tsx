"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { MountainSilhouette } from "@/components/brand/MountainSilhouette";
import { ArrowRight, Star, Briefcase, UserRound, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Path = "candidate" | "employer" | null;

export function HeroSection() {
  const t = useTranslations("hero");
  const g = useTranslations("gamification");
  const [selectedPath, setSelectedPath] = useState<Path>(null);

  return (
    <section className="gradient-hero text-white relative overflow-hidden min-h-[90vh] flex items-center">
      <MountainSilhouette className="absolute bottom-0 left-0 right-0 w-full text-white h-32 md:h-48" />
      <div className="absolute inset-0 mountain-pattern" />
      <div className="absolute top-1/4 end-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm mb-6 border border-white/10">
              <Star className="h-4 w-4 text-brand-red-light fill-brand-red-light" />
              <span>{t("trust")}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-8 leading-relaxed max-w-xl">
              {t("subtitle")}
            </p>

            <div className="mb-8">
              <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                {g("choosePath")}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedPath("candidate")}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-start transition-all card-hover",
                    selectedPath === "candidate"
                      ? "border-brand-red bg-brand-red/20 quest-step-active"
                      : "border-white/20 bg-white/5 hover:border-white/40"
                  )}
                >
                  <UserRound className="h-6 w-6 text-brand-red-light mb-2" />
                  <p className="font-bold">{g("pathCandidate")}</p>
                  <p className="text-xs text-white/60 mt-1">{g("pathCandidateDesc")}</p>
                  {selectedPath === "candidate" && (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-brand-red-light font-semibold">
                      <Trophy className="h-3 w-3" /> +100 XP
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setSelectedPath("employer")}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-start transition-all card-hover",
                    selectedPath === "employer"
                      ? "border-brand-red bg-brand-red/20 quest-step-active"
                      : "border-white/20 bg-white/5 hover:border-white/40"
                  )}
                >
                  <Briefcase className="h-6 w-6 text-brand-red-light mb-2" />
                  <p className="font-bold">{g("pathEmployer")}</p>
                  <p className="text-xs text-white/60 mt-1">{g("pathEmployerDesc")}</p>
                  {selectedPath === "employer" && (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-brand-red-light font-semibold">
                      <Trophy className="h-3 w-3" /> +100 XP
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={selectedPath === "employer" ? "/anfrage" : "/bewerbung"}>
                <Button variant="gold" size="lg" className="w-full sm:w-auto animate-pulse-glow">
                  {selectedPath === "employer" ? t("ctaEmployer") : t("ctaCandidate")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ablauf">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-navy">
                  {g("exploreJourney")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-red/20 rounded-full blur-3xl scale-110" />
              <Logo size="xl" showText={false} className="relative" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-3 text-center whitespace-nowrap">
                <p className="text-3xl font-black tracking-widest">RKS</p>
                <div className="flex items-center gap-2 my-1">
                  <div className="h-px flex-1 bg-brand-red" />
                  <Star className="h-3 w-3 text-brand-red fill-brand-red" />
                  <div className="h-px flex-1 bg-brand-red" />
                </div>
                <p className="text-xs tracking-[0.3em] text-white/70 uppercase">Fachkräfte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { AnimatedStatsSection } from "@/components/home/AnimatedStatsSection";
import { AchievementSection } from "@/components/home/AchievementSection";
import { JourneyGameSection } from "@/components/home/JourneyGameSection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { CtaSection } from "@/components/home/CtaSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AnimatedStatsSection />
      <AchievementSection />
      <JourneyGameSection />
      <IndustriesSection />
      <CtaSection />
    </>
  );
}

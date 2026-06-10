"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/layout/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  const t = useTranslations("faq");
  const [tab, setTab] = useState<"candidates" | "employers">("candidates");

  const candidateItems = ["c1", "c2", "c3", "c4"] as const;
  const employerItems = ["e1", "e2", "e3"] as const;
  const items = tab === "candidates" ? candidateItems : employerItems;

  return (
    <>
      <PageHero title={t("title")} />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 mb-8 justify-center">
            <button
              onClick={() => setTab("candidates")}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-colors",
                tab === "candidates" ? "bg-navy text-white" : "bg-sand text-navy"
              )}
            >
              {t("candidatesTab")}
            </button>
            <button
              onClick={() => setTab("employers")}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-colors",
                tab === "employers" ? "bg-navy text-white" : "bg-sand text-navy"
              )}
            >
              {t("employersTab")}
            </button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {items.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>{t(`items.${key}.q`)}</AccordionTrigger>
                <AccordionContent>{t(`items.${key}.a`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

const visaSteps = [
  { key: "contract", label: "Arbeitsvertrag erhalten" },
  { key: "approval", label: "Zustimmung Bundesagentur für Arbeit" },
  { key: "visa", label: "Visumantrag bei der Botschaft" },
  { key: "insurance", label: "Krankenversicherung abschließen" },
  { key: "arrival", label: "Anreise nach Deutschland" },
  { key: "registration", label: "Anmeldung & Aufenthaltstitel" },
];

export function VisaTimeline() {
  const t = useTranslations("tools");

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">{t("visaTimeline")}</h2>
      <p className="text-muted mb-8">{t("visaTimelineDesc")}</p>
      <div className="space-y-4">
        {visaSteps.map((step, i) => (
          <div key={step.key} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 text-gold" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-navy">{i + 1}. {step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

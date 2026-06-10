"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/constants";

interface StatusTrackerProps {
  currentStatus: string;
  history: { status: string; note?: string | null; createdAt: string }[];
}

export function StatusTracker({ currentStatus, history }: StatusTrackerProps) {
  const t = useTranslations("portal");
  const currentIndex = APPLICATION_STATUSES.indexOf(currentStatus as typeof APPLICATION_STATUSES[number]);

  return (
    <div className="space-y-0">
      {APPLICATION_STATUSES.map((status, i) => {
        const isComplete = i <= currentIndex;
        const historyEntry = history.find((h) => h.status === status);

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  isComplete ? "gradient-gold text-navy" : "bg-sand text-muted"
                )}
              >
                {isComplete ? <Check className="h-5 w-5" /> : <span className="text-sm">{i + 1}</span>}
              </div>
              {i < APPLICATION_STATUSES.length - 1 && (
                <div className={cn("w-0.5 flex-1 my-1", isComplete ? "bg-gold" : "bg-border")} />
              )}
            </div>
            <div className="pb-8">
              <p className={cn("font-semibold", isComplete ? "text-navy" : "text-muted")}>
                {t(`statuses.${status}`)}
              </p>
              {historyEntry && (
                <p className="text-xs text-muted mt-1">
                  {new Date(historyEntry.createdAt).toLocaleDateString()}
                  {historyEntry.note && ` — ${historyEntry.note}`}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

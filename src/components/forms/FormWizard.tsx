"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FormWizardProps {
  steps: string[];
  currentStep: number;
  children: React.ReactNode;
}

export function FormWizard({ steps, currentStep, children }: FormWizardProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                "text-xs font-medium text-center flex-1",
                i <= currentStep ? "text-navy" : "text-muted"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 text-sm",
                  i <= currentStep ? "gradient-gold text-navy" : "bg-sand text-muted"
                )}
              >
                {i + 1}
              </div>
              <span className="hidden sm:block">{step}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} />
      </div>
      {children}
    </div>
  );
}

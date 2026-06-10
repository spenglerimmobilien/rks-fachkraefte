"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROFESSIONS, SALARY_ESTIMATES } from "@/lib/constants";

export function SalaryCalculator() {
  const t = useTranslations("tools");
  const tInd = useTranslations("industries");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState<{ min: number; max: number } | null>(null);

  const calculate = () => {
    const base = SALARY_ESTIMATES[profession];
    if (!base) return;
    const exp = parseInt(experience) || 0;
    const multiplier = 1 + exp * 0.05;
    setSalary({
      min: Math.round(base.min * multiplier),
      max: Math.round(base.max * multiplier),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("salaryCalc")}</CardTitle>
        <p className="text-sm text-muted">{t("salaryCalcDesc")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Beruf</Label>
          <Select value={profession} onValueChange={setProfession}>
            <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
            <SelectContent>
              {PROFESSIONS.map((p) => (
                <SelectItem key={p} value={p}>{tInd(p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Berufserfahrung (Jahre)</Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
            <SelectContent>
              {["0", "2", "5", "10", "15"].map((y) => (
                <SelectItem key={y} value={y}>{y}+ Jahre</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="gold" onClick={calculate} disabled={!profession || !experience}>
          {t("calculate")}
        </Button>
        {salary && (
          <div className="p-4 rounded-lg bg-navy text-white">
            <p className="text-sm text-white/70 mb-1">{t("estimatedSalary")}</p>
            <p className="text-2xl font-bold">{salary.min.toLocaleString()} – {salary.max.toLocaleString()} € / Monat</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROFESSIONS, GERMAN_LEVELS } from "@/lib/constants";

export function QualificationCalculator() {
  const t = useTranslations("tools");
  const tInd = useTranslations("industries");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [germanLevel, setGermanLevel] = useState("");
  const [result, setResult] = useState<"good" | "partial" | null>(null);

  const calculate = () => {
    const exp = parseInt(experience) || 0;
    const levelIndex = GERMAN_LEVELS.indexOf(germanLevel as typeof GERMAN_LEVELS[number]);
    const germanOk = levelIndex >= 1;
    const expOk = exp >= 2;

    if (germanOk && expOk) setResult("good");
    else setResult("partial");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("qualificationCalc")}</CardTitle>
        <p className="text-sm text-muted">{t("qualificationCalcDesc")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{tInd("title")}</Label>
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
              {["0", "1", "2", "3", "5", "10"].map((y) => (
                <SelectItem key={y} value={y}>{y}+ Jahre</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Deutsch-Niveau</Label>
          <Select value={germanLevel} onValueChange={setGermanLevel}>
            <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
            <SelectContent>
              {GERMAN_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>{l === "none" ? "Keine Kenntnisse" : l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="gold" onClick={calculate} disabled={!profession || !experience || !germanLevel}>
          {t("calculate")}
        </Button>
        {result && (
          <div className={`p-4 rounded-lg ${result === "good" ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
            {result === "good" ? t("goodMatch") : t("partialMatch")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

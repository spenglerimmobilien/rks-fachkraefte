"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FormWizard } from "./FormWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PROFESSIONS } from "@/lib/constants";
import { LayoutDashboard } from "lucide-react";

type FormData = {
  companyName: string;
  industry: string;
  location: string;
  companySize: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
  professions: string[];
  positions: string;
  urgency: string;
  requirements: string;
  contractType: string;
  salaryRange: string;
  housing: boolean;
  benefits: string;
  gdprConsent: boolean;
  password: string;
};

const initial: FormData = {
  companyName: "", industry: "", location: "", companySize: "",
  contactPerson: "", position: "", email: "", phone: "",
  professions: [], positions: "1", urgency: "THREE_MONTHS",
  requirements: "", contractType: "unbefristet", salaryRange: "",
  housing: false, benefits: "", gdprConsent: false, password: "",
};

export function EmployerWizard() {
  const t = useTranslations("employerForm");
  const tInd = useTranslations("industries");
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];
  const update = (field: keyof FormData, value: string | boolean | string[]) =>
    setData((d) => ({ ...d, [field]: value }));

  const toggleProfession = (p: string) => {
    const updated = data.professions.includes(p)
      ? data.professions.filter((x) => x !== p)
      : [...data.professions, p];
    update("professions", updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">{t("success")}</h2>
          <p className="text-muted">Wir melden uns innerhalb von 2 Werktagen bei Ihnen.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormWizard steps={steps} currentStep={step}>
      <div className="mb-6 p-4 md:p-5 rounded-xl bg-navy/5 border border-navy/10 flex gap-4 items-start">
        <LayoutDashboard className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-navy mb-1">{t("portalInfoTitle")}</p>
          <p className="text-sm text-muted leading-relaxed">{t("portalInfoDesc")}</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          {step === 0 && (
            <>
              <div><Label>{t("companyName")}</Label><Input value={data.companyName} onChange={(e) => update("companyName", e.target.value)} required /></div>
              <div><Label>{t("industry")}</Label><Input value={data.industry} onChange={(e) => update("industry", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("location")}</Label><Input value={data.location} onChange={(e) => update("location", e.target.value)} /></div>
                <div><Label>{t("companySize")}</Label><Input value={data.companySize} onChange={(e) => update("companySize", e.target.value)} placeholder="z.B. 50-200" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("contactPerson")}</Label><Input value={data.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} required /></div>
                <div><Label>{t("position")}</Label><Input value={data.position} onChange={(e) => update("position", e.target.value)} /></div>
              </div>
              <div><Label>E-Mail</Label><Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} required /></div>
              <div><Label>Telefon</Label><Input value={data.phone} onChange={(e) => update("phone", e.target.value)} /></div>
              <div><Label>Passwort (für Portal-Zugang)</Label><Input type="password" value={data.password} onChange={(e) => update("password", e.target.value)} required minLength={8} /></div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <Label>{t("professions")}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {PROFESSIONS.map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <Checkbox checked={data.professions.includes(p)} onCheckedChange={() => toggleProfession(p)} id={p} />
                      <Label htmlFor={p} className="text-sm">{tInd(p)}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div><Label>{t("positions")}</Label><Input type="number" min="1" value={data.positions} onChange={(e) => update("positions", e.target.value)} /></div>
              <div>
                <Label>{t("urgency")}</Label>
                <Select value={data.urgency} onValueChange={(v) => update("urgency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMMEDIATE">{t("urgencyImmediate")}</SelectItem>
                    <SelectItem value="THREE_MONTHS">{t("urgency3months")}</SelectItem>
                    <SelectItem value="SIX_MONTHS_PLUS">{t("urgency6months")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>{t("requirements")}</Label><Textarea value={data.requirements} onChange={(e) => update("requirements", e.target.value)} rows={4} /></div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>{t("contractType")}</Label>
                <Select value={data.contractType} onValueChange={(v) => update("contractType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unbefristet">Unbefristet</SelectItem>
                    <SelectItem value="befristet">Befristet</SelectItem>
                    <SelectItem value="ausbildung">Ausbildung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>{t("salaryRange")}</Label><Input value={data.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} placeholder="z.B. 2800-3500 €" /></div>
              <div className="flex items-center gap-2">
                <Checkbox checked={data.housing} onCheckedChange={(c) => update("housing", !!c)} id="housing" />
                <Label htmlFor="housing">{t("housing")}</Label>
              </div>
              <div><Label>{t("benefits")}</Label><Textarea value={data.benefits} onChange={(e) => update("benefits", e.target.value)} rows={3} /></div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="p-4 bg-sand rounded-lg text-sm">
                <p><strong>{data.companyName}</strong> — {data.contactPerson}</p>
                <p>{data.professions.map((p) => tInd(p as typeof PROFESSIONS[number])).join(", ")} — {data.positions} Stelle(n)</p>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox checked={data.gdprConsent} onCheckedChange={(c) => update("gdprConsent", !!c)} id="gdpr" />
                <Label htmlFor="gdpr" className="text-sm">Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.</Label>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 0 ? <Button variant="outline" onClick={() => setStep(step - 1)}>Zurück</Button> : <div />}
            {step < steps.length - 1 ? (
              <Button variant="gold" onClick={() => setStep(step + 1)} disabled={step === 0 && !data.companyName}>Weiter</Button>
            ) : (
              <Button variant="gold" onClick={handleSubmit} disabled={!data.gdprConsent || loading}>
                {loading ? "..." : t("submit")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </FormWizard>
  );
}

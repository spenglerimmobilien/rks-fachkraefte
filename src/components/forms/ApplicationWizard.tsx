"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormWizard } from "./FormWizard";
import { FileUpload } from "./FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PROFESSIONS, GERMAN_LEVELS, NATIONALITIES } from "@/lib/constants";
import { localeNames, type Locale } from "@/i18n/routing";

type FormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  city: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredLanguage: string;
  profession: string;
  experienceYears: string;
  education: string;
  institution: string;
  graduationYear: string;
  germanLevel: string;
  hasGermanCert: boolean;
  desiredRegion: string;
  startDate: string;
  driversLicense: boolean;
  motivation: string;
  gdprConsent: boolean;
  password: string;
};

const initialData: FormData = {
  firstName: "", lastName: "", birthDate: "", nationality: "Marokko", city: "",
  email: "", phone: "", whatsapp: "", preferredLanguage: "ar",
  profession: "", experienceYears: "", education: "", institution: "", graduationYear: "",
  germanLevel: "", hasGermanCert: false, desiredRegion: "", startDate: "",
  driversLicense: false, motivation: "", gdprConsent: false, password: "",
};

export function ApplicationWizard() {
  const t = useTranslations("apply");
  const tInd = useTranslations("industries");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ number: string } | null>(null);

  const steps = [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")];
  const update = (field: keyof FormData, value: string | boolean) =>
    setData((d) => ({ ...d, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)));
    formData.append("locale", locale);
    Object.entries(files).forEach(([type, fileList]) => {
      fileList.forEach((file) => formData.append(type, file));
    });

    try {
      const res = await fetch("/api/applications", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok) setResult({ number: json.applicationNumber });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">{t("success")}</h2>
          <p className="text-muted mb-4">{t("applicationNumber")}: <strong>{result.number}</strong></p>
          <Button variant="gold" onClick={() => router.push("/login")}>Zum Portal →</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormWizard steps={steps} currentStep={step}>
      <Card>
        <CardContent className="p-6 space-y-4">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("firstName")}</Label><Input value={data.firstName} onChange={(e) => update("firstName", e.target.value)} required /></div>
                <div><Label>{t("lastName")}</Label><Input value={data.lastName} onChange={(e) => update("lastName", e.target.value)} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("birthDate")}</Label><Input type="date" value={data.birthDate} onChange={(e) => update("birthDate", e.target.value)} /></div>
                <div>
                  <Label>{t("nationality")}</Label>
                  <Select value={data.nationality} onValueChange={(v) => update("nationality", v)} required>
                    <SelectTrigger><SelectValue placeholder={t("selectNationality")} /></SelectTrigger>
                    <SelectContent>
                      {NATIONALITIES.map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>{t("city")}</Label><Input value={data.city} onChange={(e) => update("city", e.target.value)} /></div>
              <div><Label>{t("email")}</Label><Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("phone")}</Label><Input value={data.phone} onChange={(e) => update("phone", e.target.value)} required /></div>
                <div><Label>{t("whatsapp")}</Label><Input value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} /></div>
              </div>
              <div>
                <Label>{t("preferredLanguage")}</Label>
                <Select value={data.preferredLanguage} onValueChange={(v) => update("preferredLanguage", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(localeNames) as Locale[]).map((l) => (
                      <SelectItem key={l} value={l}>{localeNames[l]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Passwort (für Portal-Zugang)</Label><Input type="password" value={data.password} onChange={(e) => update("password", e.target.value)} required minLength={8} /></div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <Label>{t("profession")}</Label>
                <Select value={data.profession} onValueChange={(v) => update("profession", v)}>
                  <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map((p) => <SelectItem key={p} value={p}>{tInd(p)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>{t("experience")}</Label><Input type="number" min="0" value={data.experienceYears} onChange={(e) => update("experienceYears", e.target.value)} /></div>
              <div><Label>{t("education")}</Label><Input value={data.education} onChange={(e) => update("education", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("institution")}</Label><Input value={data.institution} onChange={(e) => update("institution", e.target.value)} /></div>
                <div><Label>{t("graduationYear")}</Label><Input value={data.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} /></div>
              </div>
              <div>
                <Label>{t("germanLevel")}</Label>
                <Select value={data.germanLevel} onValueChange={(v) => update("germanLevel", v)}>
                  <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                  <SelectContent>
                    {GERMAN_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={data.hasGermanCert} onCheckedChange={(c) => update("hasGermanCert", !!c)} id="germanCert" />
                <Label htmlFor="germanCert">{t("hasGermanCert")}</Label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div><Label>{t("desiredRegion")}</Label><Input value={data.desiredRegion} onChange={(e) => update("desiredRegion", e.target.value)} placeholder="z.B. Bayern, Berlin, NRW" /></div>
              <div><Label>{t("startDate")}</Label><Input type="date" value={data.startDate} onChange={(e) => update("startDate", e.target.value)} /></div>
              <div className="flex items-center gap-2">
                <Checkbox checked={data.driversLicense} onCheckedChange={(c) => update("driversLicense", !!c)} id="license" />
                <Label htmlFor="license">{t("driversLicense")}</Label>
              </div>
              <div><Label>{t("motivation")}</Label><Textarea value={data.motivation} onChange={(e) => update("motivation", e.target.value)} maxLength={500} rows={4} /></div>
            </>
          )}

          {step === 3 && (
            <>
              <FileUpload label={t("uploadCv")} onFilesChange={(f) => setFiles((p) => ({ ...p, CV: f }))} />
              <FileUpload label={t("uploadCerts")} multiple onFilesChange={(f) => setFiles((p) => ({ ...p, EDUCATION_CERT: f }))} />
              <FileUpload label={t("uploadLangCerts")} multiple onFilesChange={(f) => setFiles((p) => ({ ...p, LANGUAGE_CERT: f }))} />
              <FileUpload label={t("uploadId")} multiple onFilesChange={(f) => setFiles((p) => ({ ...p, ID_FRONT: f }))} />
              <FileUpload label={t("uploadWorkRefs")} multiple onFilesChange={(f) => setFiles((p) => ({ ...p, WORK_REFERENCE: f }))} />
            </>
          )}

          {step === 4 && (
            <>
              <div className="p-4 bg-sand rounded-lg text-sm text-muted">
                <p><strong>{data.firstName} {data.lastName}</strong> — {data.email}</p>
                <p>{tInd(data.profession as typeof PROFESSIONS[number])} — {data.experienceYears} Jahre Erfahrung</p>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox checked={data.gdprConsent} onCheckedChange={(c) => update("gdprConsent", !!c)} id="gdpr" />
                <Label htmlFor="gdpr" className="text-sm leading-relaxed">{t("gdpr")}</Label>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>{t("back")}</Button>
            ) : <div />}
            {step < steps.length - 1 ? (
              <Button variant="gold" onClick={() => setStep(step + 1)} disabled={step === 0 && (!data.firstName || !data.email || !data.password)}>
                {t("next")}
              </Button>
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

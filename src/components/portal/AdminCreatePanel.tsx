"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROFESSIONS, GERMAN_LEVELS, APPLICATION_STATUSES } from "@/lib/constants";
import { UserPlus, Building2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateType = "candidate" | "employer";

export function AdminCreatePanel() {
  const t = useTranslations("admin");
  const tInd = useTranslations("industries");
  const tPortal = useTranslations("portal");
  const [type, setType] = useState<CreateType>("candidate");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [candidate, setCandidate] = useState({
    email: "", password: "", firstName: "", lastName: "", phone: "", city: "",
    nationality: "Marokko", profession: "", experienceYears: "", germanLevel: "",
    status: "RECEIVED", note: "",
  });

  const [employer, setEmployer] = useState({
    email: "", password: "", companyName: "", industry: "", location: "",
    companySize: "", contactPerson: "", position: "", phone: "",
    profession: "", positions: "1", urgency: "THREE_MONTHS",
    requirements: "", contractType: "unbefristet", salaryRange: "",
    housing: false, isApproved: true, requestStatus: "PENDING",
  });

  const updateCandidate = (field: string, value: string) =>
    setCandidate((c) => ({ ...c, [field]: value }));

  const updateEmployer = (field: string, value: string | boolean) =>
    setEmployer((e) => ({ ...e, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = type === "candidate" ? "/api/admin/candidates" : "/api/admin/employers";
      const body = type === "candidate"
        ? candidate
        : { ...employer, professions: employer.profession ? [employer.profession] : [] };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("createError"));
        return;
      }

      const ref = data.applicationNumber || data.requestNumber;
      setSuccess(t("createSuccess", { ref }));

      if (type === "candidate") {
        setCandidate({
          email: "", password: "", firstName: "", lastName: "", phone: "", city: "",
          nationality: "Marokko", profession: "", experienceYears: "", germanLevel: "",
          status: "RECEIVED", note: "",
        });
      } else {
        setEmployer({
          email: "", password: "", companyName: "", industry: "", location: "",
          companySize: "", contactPerson: "", position: "", phone: "",
          profession: "", positions: "1", urgency: "THREE_MONTHS",
          requirements: "", contractType: "unbefristet", salaryRange: "",
          housing: false, isApproved: true, requestStatus: "PENDING",
        });
      }
    } catch {
      setError(t("createError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => { setType("candidate"); setSuccess(null); setError(null); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
            type === "candidate" ? "border-brand-red bg-brand-red/5" : "border-border hover:border-brand-red/30"
          )}
        >
          <UserPlus className="h-5 w-5 text-brand-red" />
          <span className="font-semibold text-navy">{t("createCandidate")}</span>
        </button>
        <button
          type="button"
          onClick={() => { setType("employer"); setSuccess(null); setError(null); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
            type === "employer" ? "border-brand-red bg-brand-red/5" : "border-border hover:border-brand-red/30"
          )}
        >
          <Building2 className="h-5 w-5 text-brand-red" />
          <span className="font-semibold text-navy">{t("createEmployer")}</span>
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p>{success}</p>
          <Button variant="outline" size="sm" className="ms-auto" onClick={() => window.location.reload()}>
            {t("refreshList")}
          </Button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">{error}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{type === "candidate" ? t("createCandidate") : t("createEmployer")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "candidate" ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>{t("fieldFirstName")} *</Label><Input value={candidate.firstName} onChange={(e) => updateCandidate("firstName", e.target.value)} required /></div>
                  <div><Label>{t("fieldLastName")} *</Label><Input value={candidate.lastName} onChange={(e) => updateCandidate("lastName", e.target.value)} required /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>{t("fieldEmail")} *</Label><Input type="email" value={candidate.email} onChange={(e) => updateCandidate("email", e.target.value)} required /></div>
                  <div><Label>{t("fieldPassword")}</Label><Input type="password" value={candidate.password} onChange={(e) => updateCandidate("password", e.target.value)} placeholder={t("passwordHint")} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>{t("fieldPhone")}</Label><Input value={candidate.phone} onChange={(e) => updateCandidate("phone", e.target.value)} /></div>
                  <div><Label>{t("fieldCity")}</Label><Input value={candidate.city} onChange={(e) => updateCandidate("city", e.target.value)} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("fieldProfession")}</Label>
                    <Select value={candidate.profession} onValueChange={(v) => updateCandidate("profession", v)}>
                      <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                      <SelectContent>
                        {PROFESSIONS.map((p) => <SelectItem key={p} value={p}>{tInd(p)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("fieldGermanLevel")}</Label>
                    <Select value={candidate.germanLevel} onValueChange={(v) => updateCandidate("germanLevel", v)}>
                      <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                      <SelectContent>
                        {GERMAN_LEVELS.filter((l) => l !== "none").map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>{t("fieldExperience")}</Label><Input type="number" min="0" value={candidate.experienceYears} onChange={(e) => updateCandidate("experienceYears", e.target.value)} /></div>
                  <div>
                    <Label>{t("fieldStatus")}</Label>
                    <Select value={candidate.status} onValueChange={(v) => updateCandidate("status", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {APPLICATION_STATUSES.map((s) => <SelectItem key={s} value={s}>{tPortal(`statuses.${s}`)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>{t("internalNote")}</Label><Textarea value={candidate.note} onChange={(e) => updateCandidate("note", e.target.value)} rows={2} /></div>
              </>
            ) : (
              <>
                <div><Label>{t("fieldCompany")} *</Label><Input value={employer.companyName} onChange={(e) => updateEmployer("companyName", e.target.value)} required /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>{t("fieldEmail")} *</Label><Input type="email" value={employer.email} onChange={(e) => updateEmployer("email", e.target.value)} required /></div>
                  <div><Label>{t("fieldPassword")}</Label><Input type="password" value={employer.password} onChange={(e) => updateEmployer("password", e.target.value)} placeholder={t("passwordHint")} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>{t("fieldContactPerson")} *</Label><Input value={employer.contactPerson} onChange={(e) => updateEmployer("contactPerson", e.target.value)} required /></div>
                  <div><Label>{t("fieldPhone")}</Label><Input value={employer.phone} onChange={(e) => updateEmployer("phone", e.target.value)} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>{t("fieldLocation")}</Label><Input value={employer.location} onChange={(e) => updateEmployer("location", e.target.value)} /></div>
                  <div><Label>{t("fieldCompanySize")}</Label><Input value={employer.companySize} onChange={(e) => updateEmployer("companySize", e.target.value)} placeholder="z.B. 50-200" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("fieldProfession")}</Label>
                    <Select value={employer.profession} onValueChange={(v) => updateEmployer("profession", v)}>
                      <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                      <SelectContent>
                        {PROFESSIONS.map((p) => <SelectItem key={p} value={p}>{tInd(p)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>{t("fieldPositions")}</Label><Input type="number" min="1" value={employer.positions} onChange={(e) => updateEmployer("positions", e.target.value)} /></div>
                </div>
                <div>
                  <Label>{t("fieldRequirements")}</Label>
                  <Textarea value={employer.requirements} onChange={(e) => updateEmployer("requirements", e.target.value)} rows={3} />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={employer.isApproved} onCheckedChange={(c) => updateEmployer("isApproved", !!c)} id="approved" />
                    <Label htmlFor="approved">{t("approveImmediately")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={employer.housing} onCheckedChange={(c) => updateEmployer("housing", !!c)} id="housing" />
                    <Label htmlFor="housing">{t("fieldHousing")}</Label>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" variant="gold" disabled={loading} className="w-full md:w-auto">
              {loading ? "..." : t("createSubmit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

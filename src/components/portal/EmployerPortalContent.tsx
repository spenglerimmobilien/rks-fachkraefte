"use client";

import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus } from "lucide-react";

interface EmployerPortalContentProps {
  profile: {
    companyName: string;
    contactPerson: string | null;
    requests: {
      id: string;
      requestNumber: string;
      professions: string;
      positions: number;
      urgency: string;
      status: string;
      createdAt: string;
    }[];
  };
  candidates: {
    id: string;
    label: string;
    profession: string | null;
    experienceYears: number | null;
    germanLevel: string | null;
    region: string | null;
  }[];
  isApproved: boolean;
}

export function EmployerPortalContent({ profile, candidates, isApproved }: EmployerPortalContentProps) {
  const t = useTranslations("employerPortal");
  const tInd = useTranslations("industries");

  return (
    <>
      <PageHero title={t("title")} subtitle={profile.companyName} />
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {!isApproved && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              Ihr Konto wird derzeit von RKS geprüft. Sie erhalten Zugang zum Kandidatenpool nach Freischaltung.
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-navy">{t("requests")}</h2>
            <div className="flex gap-2">
              <Link href="/anfrage">
                <Button variant="gold" size="sm"><Plus className="h-4 w-4" />{t("newRequest")}</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}><LogOut className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {profile.requests.map((req) => (
              <Card key={req.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{req.requestNumber}</CardTitle>
                  <Badge variant="gold">{req.status}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted">
                    {JSON.parse(req.professions).map((p: string) => tInd(p as "nursing")).join(", ")} — {req.positions} Stelle(n)
                  </p>
                  <p className="text-xs text-muted mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {isApproved && (
            <>
              <h2 className="text-xl font-bold text-navy mb-4">{t("candidates")}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {candidates.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-4">
                      <p className="font-semibold text-navy">{c.label}</p>
                      <p className="text-sm text-muted mt-1">{c.profession && tInd(c.profession as "nursing")}</p>
                      <p className="text-xs text-muted">{c.experienceYears} Jahre — Deutsch {c.germanLevel}</p>
                    </CardContent>
                  </Card>
                ))}
                {candidates.length === 0 && (
                  <p className="text-muted col-span-3">Aktuell keine passenden Kandidaten verfügbar.</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { PageHero } from "@/components/layout/PageHero";
import { StatusTracker } from "./StatusTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/forms/FileUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, LogOut } from "lucide-react";

interface PortalContentProps {
  profile: {
    firstName: string;
    lastName: string;
    phone: string | null;
    profession: string | null;
    city: string | null;
    applications: {
      applicationNumber: string;
      status: string;
      statusHistory: { status: string; note: string | null; createdAt: string }[];
      documents: { id: string; fileName: string; type: string; status: string }[];
    }[];
    documents: { id: string; fileName: string; type: string; fileUrl: string; status: string }[];
  };
  userName: string;
}

export function PortalContent({ profile, userName }: PortalContentProps) {
  const t = useTranslations("portal");
  const [tab, setTab] = useState<"status" | "documents" | "profile">("status");
  const [uploading, setUploading] = useState(false);
  const application = profile.applications[0];

  const handleUpload = async (files: File[]) => {
    if (!files[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("type", "OTHER");
    await fetch("/api/portal/documents", { method: "POST", body: formData });
    setUploading(false);
    window.location.reload();
  };

  return (
    <>
      <PageHero title={t("title")} subtitle={`${t("welcome")}, ${userName}`} />
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {(["status", "documents", "profile"] as const).map((tabKey) => (
                <Button
                  key={tabKey}
                  variant={tab === tabKey ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTab(tabKey)}
                >
                  {t(tabKey)}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {tab === "status" && application && (
            <Card>
              <CardHeader>
                <CardTitle>{application.applicationNumber}</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTracker
                  currentStatus={application.status}
                  history={application.statusHistory}
                />
              </CardContent>
            </Card>
          )}

          {tab === "documents" && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>{t("documents")}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {profile.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-sand rounded-lg">
                      <FileText className="h-5 w-5 text-navy" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.fileName}</p>
                        <p className="text-xs text-muted">{doc.type} — {doc.status}</p>
                      </div>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gold">Ansehen</a>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <FileUpload label={t("uploadMore")} onFilesChange={handleUpload} />
                  {uploading && <p className="text-sm text-muted mt-2">Uploading...</p>}
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "profile" && (
            <Card>
              <CardHeader><CardTitle>{t("profile")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Vorname</Label><Input value={profile.firstName} readOnly /></div>
                  <div><Label>Nachname</Label><Input value={profile.lastName} readOnly /></div>
                </div>
                <div><Label>Telefon</Label><Input value={profile.phone || ""} readOnly /></div>
                <div><Label>Beruf</Label><Input value={profile.profession || ""} readOnly /></div>
                <div><Label>Stadt</Label><Input value={profile.city || ""} readOnly /></div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { LogOut, Download, FileText, PlusCircle } from "lucide-react";
import { AdminCreatePanel } from "./AdminCreatePanel";

interface AdminDashboardProps {
  applications: {
    id: string;
    applicationNumber: string;
    status: string;
    createdAt: string;
    candidate: { firstName: string; lastName: string; profession: string | null; email?: string };
    documents: { id: string; fileName: string; fileUrl: string; type: string }[];
    statusHistory: { note: string | null }[];
  }[];
  employerRequests: {
    id: string;
    requestNumber: string;
    status: string;
    positions: number;
    professions: string;
    employer: { companyName: string; user: { email: string } };
  }[];
  pendingEmployers: {
    id: string;
    email: string;
    employerProfile: { companyName: string } | null;
  }[];
}

export function AdminDashboard({ applications, employerRequests, pendingEmployers }: AdminDashboardProps) {
  const t = useTranslations("admin");
  const tPortal = useTranslations("portal");
  const PAGE_SIZE = 20;
  const [tab, setTab] = useState<"applications" | "requests" | "users" | "matching" | "create">("applications");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [matchRequestId, setMatchRequestId] = useState("");
  const [appPage, setAppPage] = useState(1);
  const [reqPage, setReqPage] = useState(1);

  const filteredApps = applications.filter((a) => {
    if (filter !== "ALL" && a.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.applicationNumber.toLowerCase().includes(q) ||
        a.candidate.firstName.toLowerCase().includes(q) ||
        a.candidate.lastName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const changeStatus = async (id: string, status: string) => {
    await fetch(`/api/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note: statusNote }),
    });
    window.location.reload();
  };

  const approveEmployer = async (userId: string) => {
    await fetch(`/api/users/${userId}/approve`, { method: "PATCH" });
    window.location.reload();
  };

  const matchApplication = async (appId: string) => {
    if (!matchRequestId) return;
    await fetch(`/api/applications/${appId}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerRequestId: matchRequestId }),
    });
    window.location.reload();
  };

  const exportCsv = () => {
    const headers = ["Nummer", "Name", "Beruf", "Status", "Datum"];
    const rows = applications.map((a) => [
      a.applicationNumber,
      `${a.candidate.firstName} ${a.candidate.lastName}`,
      a.candidate.profession || "",
      a.status,
      new Date(a.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bewerbungen.csv";
    a.click();
  };

  const selected = applications.find((a) => a.id === selectedApp);
  const totalAppPages = Math.max(1, Math.ceil(filteredApps.length / PAGE_SIZE));
  const paginatedApps = filteredApps.slice((appPage - 1) * PAGE_SIZE, appPage * PAGE_SIZE);
  const totalReqPages = Math.max(1, Math.ceil(employerRequests.length / PAGE_SIZE));
  const paginatedRequests = employerRequests.slice((reqPage - 1) * PAGE_SIZE, reqPage * PAGE_SIZE);

  return (
    <>
      <PageHero title={t("title")} />
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-navy">{applications.length}</p>
                <p className="text-sm text-muted">{t("applications")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-navy">{employerRequests.length}</p>
                <p className="text-sm text-muted">{t("employerRequests")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-navy">{pendingEmployers.length}</p>
                <p className="text-sm text-muted">Ausstehende Freischaltungen</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 flex-wrap">
              {(["applications", "requests", "users", "matching", "create"] as const).map((tabKey) => (
                <Button key={tabKey} variant={tab === tabKey ? "default" : "ghost"} size="sm" onClick={() => setTab(tabKey)}>
                  {tabKey === "create" ? (
                    <><PlusCircle className="h-4 w-4" />{t("createNew")}</>
                  ) : (
                    t(tabKey === "applications" ? "applications" : tabKey === "requests" ? "employerRequests" : tabKey === "users" ? "users" : "matching")
                  )}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" />{t("export")}</Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}><LogOut className="h-4 w-4" /></Button>
            </div>
          </div>

          {tab === "applications" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Suchen..." value={search} onChange={(e) => { setSearch(e.target.value); setAppPage(1); }} className="max-w-xs" />
                  <Select value={filter} onValueChange={(v) => { setFilter(v); setAppPage(1); }}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Alle</SelectItem>
                      {APPLICATION_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{tPortal(`statuses.${s}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted">{filteredApps.length} Einträge</p>
                {paginatedApps.map((app) => (
                  <Card
                    key={app.id}
                    className={`cursor-pointer transition-colors ${selectedApp === app.id ? "ring-2 ring-gold" : ""}`}
                    onClick={() => setSelectedApp(app.id)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-navy">{app.candidate.firstName} {app.candidate.lastName}</p>
                        <p className="text-sm text-muted">{app.applicationNumber} — {app.candidate.profession}</p>
                      </div>
                      <Badge variant="gold">{tPortal(`statuses.${app.status}`)}</Badge>
                    </CardContent>
                  </Card>
                ))}
                {totalAppPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" disabled={appPage <= 1} onClick={() => setAppPage(appPage - 1)}>Zurück</Button>
                    <span className="text-sm text-muted">Seite {appPage} von {totalAppPages}</span>
                    <Button variant="outline" size="sm" disabled={appPage >= totalAppPages} onClick={() => setAppPage(appPage + 1)}>Weiter</Button>
                  </div>
                )}
              </div>

              {selected && (
                <Card>
                  <CardHeader><CardTitle>{selected.applicationNumber}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>{selected.candidate.firstName} {selected.candidate.lastName}</strong></p>
                    <div>
                      <p className="text-sm font-medium mb-2">Dokumente</p>
                      {selected.documents.map((doc) => (
                        <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gold mb-1">
                          <FileText className="h-4 w-4" />{doc.fileName}
                        </a>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">{t("changeStatus")}</p>
                      <Select onValueChange={(s) => changeStatus(selected.id, s)}>
                        <SelectTrigger><SelectValue placeholder="Status wählen" /></SelectTrigger>
                        <SelectContent>
                          {APPLICATION_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{tPortal(`statuses.${s}`)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input className="mt-2" placeholder={t("internalNote")} value={statusNote} onChange={(e) => setStatusNote(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {tab === "requests" && (
            <div className="space-y-4">
            <p className="text-sm text-muted">{employerRequests.length} Einträge</p>
            <div className="grid md:grid-cols-2 gap-4">
              {paginatedRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{req.employer.companyName}</p>
                        <p className="text-sm text-muted">{req.requestNumber}</p>
                      </div>
                      <Badge>{req.status}</Badge>
                    </div>
                    <p className="text-sm mt-2">{req.positions} Stelle(n)</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {totalReqPages > 1 && (
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" disabled={reqPage <= 1} onClick={() => setReqPage(reqPage - 1)}>Zurück</Button>
                <span className="text-sm text-muted">Seite {reqPage} von {totalReqPages}</span>
                <Button variant="outline" size="sm" disabled={reqPage >= totalReqPages} onClick={() => setReqPage(reqPage + 1)}>Weiter</Button>
              </div>
            )}
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-navy">Ausstehende Arbeitgeber-Freischaltung</h3>
              {pendingEmployers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.employerProfile?.companyName}</p>
                      <p className="text-sm text-muted">{user.email}</p>
                    </div>
                    <Button variant="gold" size="sm" onClick={() => approveEmployer(user.id)}>{t("approveEmployer")}</Button>
                  </CardContent>
                </Card>
              ))}
              {pendingEmployers.length === 0 && <p className="text-muted">Keine ausstehenden Freischaltungen.</p>}
            </div>
          )}

          {tab === "create" && <AdminCreatePanel />}

          {tab === "matching" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted">Wählen Sie eine Bewerbung und eine Arbeitgeber-Anfrage zum Verknüpfen.</p>
                <Select onValueChange={setMatchRequestId}>
                  <SelectTrigger><SelectValue placeholder="Arbeitgeber-Anfrage wählen" /></SelectTrigger>
                  <SelectContent>
                    {employerRequests.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.requestNumber} — {r.employer.companyName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  {applications.filter((a) => a.status === "QUALIFIED").map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-sand rounded-lg">
                      <span>{app.candidate.firstName} {app.candidate.lastName} — {app.applicationNumber}</span>
                      <Button variant="gold" size="sm" onClick={() => matchApplication(app.id)} disabled={!matchRequestId}>
                        Match
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}

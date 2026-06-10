"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          locale,
        }),
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Mail className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-medium text-navy">E-Mail</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted text-sm">{CONTACT_EMAIL}</a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Phone className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-medium text-navy">{t("phone")}</p>
                  <p className="text-muted text-sm">{CONTACT_PHONE}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <MapPin className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-medium text-navy">Standorte</p>
                  <p className="text-muted text-sm">Van-Straße 1, 45327 Essen-Katternberg & Casablanca, Marokko</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {success ? (
            <div className="p-8 rounded-xl bg-green-50 text-green-800 text-center">
              <p className="text-lg font-medium">{t("success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea id="message" name="message" required rows={5} />
              </div>
              <Button type="submit" variant="gold" disabled={loading}>
                {loading ? "..." : t("send")}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Ungültige Anmeldedaten");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    if (role === "ADMIN") router.push("/admin");
    else if (role === "EMPLOYER") router.push("/arbeitgeber-portal");
    else router.push("/portal");
  };

  return (
    <>
      <PageHero title={t("login")} />
      <section className="py-16 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                {loading ? "..." : t("loginButton")}
              </Button>
            </form>
            <p className="text-center text-sm text-muted mt-4">
              {t("noAccount")}{" "}
              <Link href="/bewerbung" className="text-gold font-medium">{t("register")}</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/fuer-fachkraefte", label: t("candidates") },
    { href: "/fuer-arbeitgeber", label: t("employers") },
    { href: "/ablauf", label: t("process") },
    { href: "/branchen", label: t("industries") },
    { href: "/ueber-uns", label: t("about") },
    { href: "/faq", label: t("faq") },
    { href: "/kontakt", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  pathname === link.href
                    ? "text-brand-red bg-brand-red/5"
                    : "text-navy hover:text-brand-red hover:bg-sand"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/bewerbung" className="hidden md:block">
              <Button variant="gold" size="sm">{t("apply")}</Button>
            </Link>
            <Link href="/login" className="hidden md:block">
              <Button variant="outline" size="sm">{t("login")}</Button>
            </Link>
            <button
              className="lg:hidden p-2 text-navy rounded-lg hover:bg-sand"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-border pt-4 animate-slide-up">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-navy hover:text-brand-red rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-4 px-3">
              <Link href="/bewerbung" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="gold" className="w-full" size="sm">{t("apply")}</Button>
              </Link>
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">{t("login")}</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
